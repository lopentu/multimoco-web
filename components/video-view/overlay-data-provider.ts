import { OcrDataType, PhoneData, SpeechEvents } from "./overlay-data-types";
import parseVTT, { VTTData } from "./vtt-parser";

const WAV_FR = 1000;
const WAV_WINDOW = 4;
export interface OverlayData {
  ocr_blocks: OcrDataType[]
  phones: PhoneData
  wave: Int8Array
  wave_span: [number, number]
  wave_fr: number
  vtt: VTTData
  speech_events: SpeechEvents
}

export default class OverlayDataProvider {
  videoName: string = ""
  ocr_blocks: OcrDataType[] = [];
  phones: PhoneData = [];
  wave: Int8Array = new Int8Array(0);
  vtt: VTTData = [];
  speech_events: SpeechEvents = [];

  baseURL: string = "https://storage.googleapis.com/multimoco/selected"
  constructor() {

  }

  setVideoName(videoName: string) {
    this.videoName = videoName.replace(".mp4", "");

  }

  private _reset_data() {
    this.ocr_blocks = [];
    this.phones = [];
    this.wave = new Int8Array(0);
    this.vtt = [];
    this.speech_events = [];
  }

  loadData() {
    this._reset_data();
    const load_promises: Promise<any>[] = [
      this.getOCR(), this.getPhones(), this.getVTT(), 
      this.getWave(), this.getSpeechEvents()
    ];

    Promise.allSettled(load_promises).then((results: PromiseSettledResult<any>[]) => {
      const ocr_result = results[0];
      if (ocr_result.status == "fulfilled") {
        this.ocr_blocks = ocr_result.value;
      }

      const phone_result = results[1];
      if (phone_result.status == "fulfilled") {
        this.phones = phone_result.value;
      }

      const vtt_result = results[2];
      if (vtt_result.status == "fulfilled") {
        this.vtt = vtt_result.value;
      }

      const wav_result = results[3];
      if (wav_result.status == "fulfilled") {
        this.wave = wav_result.value;
      }

      const ev_results = results[4];
      if (ev_results.status == "fulfilled") {
        this.speech_events = ev_results.value;
      }
    })
  }

  getData(offset: number) {
    let overlayData = {} as OverlayData;

    const start_sec = offset - WAV_WINDOW / 2;
    const end_sec = offset + WAV_WINDOW / 2;

    if (this.ocr_blocks) {
      const offset_ms = offset * 1000;
      const ocr_blocks = this.ocr_blocks.filter((x) => {
        return x.offset <= offset_ms && offset_ms < x.offset + x.span;
      });
      overlayData.ocr_blocks = ocr_blocks;
    }

    if (this.phones) {
      const phones = this.phones.filter((x) => {
        return start_sec <= x[0] && x[1] < end_sec;
      });
      overlayData.phones = phones;
    }

    if (this.vtt) {
      const vtt = this.vtt.filter((x) => {
        return x.start <= offset && offset < x.end;
      })
      overlayData.vtt = vtt;
    }

    if (this.wave.length > end_sec * WAV_FR) {
      const wav = this.wave.slice(start_sec * WAV_FR, end_sec * WAV_FR);
      overlayData.wave = wav;
      overlayData.wave_span = [start_sec, end_sec];
      overlayData.wave_fr = WAV_FR;
    } else {
      overlayData.wave = new Int8Array(0);
      overlayData.wave_span = [0, 0];
      overlayData.wave_fr = WAV_FR;
    }

    if (this.speech_events) {
      const events = this.speech_events.filter((x) => {
        return (x[0] < start_sec && start_sec < x[1]) ||
               (x[0] < end_sec && end_sec < x[1])
      });

      overlayData.speech_events = events;
    }

    return overlayData;
  }

  async getOCR(): Promise<OcrDataType> {
    const resp = await fetch(this.baseURL + `/ocr_blocks/${this.videoName}.ocr.blocks.json`);
    const text = await resp.text();
    const json = JSON.parse(text);

    return json;
  }

  async getPhones(): Promise<PhoneData> {
    const resp = await fetch(this.baseURL + `/phones/${this.videoName}.phones.json`);
    const text = await resp.text();
    let json = JSON.parse(text);
    json = json.map((x: any, i: number) => [i, ...x]);
    return json;
  }

  async getSpeechEvents(): Promise<SpeechEvents> {
    const resp = await fetch(this.baseURL + `/speech_events/${this.videoName}.speakers.json`);
    const text = await resp.text();
    const json = JSON.parse(text);
    return json;
  }

  async getVTT() {
    const resp = await fetch(this.baseURL + `/vtt/${this.videoName}.wav.vtt`)
    const text = await resp.text();
    const vtt = parseVTT(text);
    return vtt;
  }

  getPose() {

  }

  async getWave() {
    const resp = await fetch(this.baseURL + `/pem/${this.videoName}.wav.pem`);
    const blob = await resp.blob();
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    const wave = await new Promise<Int8Array>((resolver, reject) => {
      reader.onload = () => {
        if (reader.result) {
          resolver(new Int8Array(reader.result as ArrayBuffer));
        } else {
          reject("Error reading wave data");
        }
      };
    });
    return wave;
  }
}