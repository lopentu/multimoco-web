import {
  MediapipeData, OcrDataType,
  PhoneData, PostureData, SpeechEvents
} from "./overlay-data-types";
import { intrapolateMediapipeData, post_process_pose } from "./utils";
import parseVTT, { VTTData } from "./vtt-parser";

const WAV_FR = 1000;
let wave_window = 2;
export interface OverlayData {
  ocr_blocks: OcrDataType[]
  phones: PhoneData
  wave: Int8Array
  wave_span: [number, number]
  wave_fr: number
  vtt: VTTData
  speech_events: SpeechEvents
  poses: MediapipeData[]
}

export default class OverlayDataProvider {
  videoName: string = ""
  ocr_blocks: OcrDataType[] = [];
  phones: PhoneData = [];
  wave: Int8Array = new Int8Array(0);
  vtt: VTTData = [];
  speech_events: SpeechEvents = [];
  poses: PostureData[] = [];
  posesTimestamps: number[] = [];
  isLoadingPosture = false;

  baseURL: string = "https://storage.googleapis.com/multimoco/selected"
  constructor() {

  }

  setWaveWindow(win_sec: number) {
    wave_window = win_sec;
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
    this.poses = [];
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
    });

  }

  getData(offset: number, toLoadPosture=false) {
    let overlayData = {} as OverlayData;

    const start_sec = offset - wave_window / 2;
    const end_sec = offset + wave_window / 2;

    if (this.ocr_blocks.length>0) {
      const offset_ms = offset * 1000;
      const ocr_blocks = this.ocr_blocks.filter((x) => {
        return x.offset <= offset_ms && offset_ms < x.offset + x.span;
      });
      overlayData.ocr_blocks = ocr_blocks;
    } else {
      overlayData.ocr_blocks = [];
    }

    if (this.phones.length>0) {
      const phones = this.phones.filter((x) => {
        return start_sec <= x[0] && x[1] < end_sec;
      });
      overlayData.phones = phones;
    } else {
      overlayData.phones = [];
    }

    if (this.vtt.length>0) {
      const vtt = this.vtt.filter((x) => {
        return x.start <= offset && offset < x.end;
      })
      overlayData.vtt = vtt;
    } else {
      overlayData.vtt = [];
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

    if (this.speech_events.length>0) {
      const events = this.speech_events.filter((x) => {
        return (x[0] < start_sec && start_sec < x[1]) ||
          (x[0] < end_sec && end_sec < x[1])
      });

      overlayData.speech_events = events;
    } else {
      overlayData.speech_events = [];
    }


    // only load posture data when needed
    if (toLoadPosture && !this.isLoadingPosture && this.poses.length == 0) {
      this.isLoadingPosture = true
      this.getPose().then((result: PostureData[]) => {
        this.poses = result;
        this.posesTimestamps = this.poses.map((x) => x.offset);
        this.isLoadingPosture = false;
      });
    }

    if (this.poses.length > 0) {
      const offset_ms = offset * 1000;
      const t2 = this.posesTimestamps.findIndex((t) => t > offset_ms) || 1;
      const t1 = Math.max(t2 - 1, 0);
      const pose_t1 = this.poses[t1];
      const pose_t2 = this.poses[t2];
      let t = 0;
      if (pose_t1 && pose_t2) {
        t = (offset_ms - pose_t1.offset) / (pose_t2.offset - pose_t1.offset);
      }

      let poseData = [
        intrapolateMediapipeData(t,
          pose_t1 && pose_t1.left,
          pose_t2 && pose_t2.left),
        intrapolateMediapipeData(t,
          pose_t1 && pose_t1.right,
          pose_t2 && pose_t2.right),
      ];

      overlayData.poses = poseData.filter((x) => x) as MediapipeData[];
    } else {
      overlayData.poses = [];
    }

    return overlayData;
  }

  async getOCR(): Promise<OcrDataType[]> {
    const resp = await fetch(this.baseURL + `/ocr_blocks/${this.videoName}.ocr.blocks.json`);
    if (resp.status == 200) {
      const text = await resp.text();
      const json = JSON.parse(text);
      return json;
    } else {
      return [];
    }
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

  async getPose() {
    const resp = await fetch(this.baseURL + `/mp/${this.videoName}.mp.json`);
    if (resp.status == 200) {
      const text = await resp.text();
      let mp = JSON.parse(text);
      mp = post_process_pose(mp, this.videoName);
      return mp;
    } else {
      return [];
    }

  }

  async getWave() {
    const resp = await fetch(this.baseURL + `/pem/${this.videoName}.wav.pem`);
    const blob = await resp.blob();
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    const wave = await new Promise<Int8Array>((resolver, reject) => {
      reader.onload = () => {
        if (reader.result) {
          const raw = new Int8Array(reader.result as ArrayBuffer);
          const minVal = raw.reduce((v, x)=> Math.min(v, x), 96);
          const maxVal = raw.reduce((v, x)=> Math.max(v, x), -96);
          raw.forEach((v,i)=>raw[i] = (v-minVal)/(maxVal-minVal)*96-48);
          resolver(raw);
        } else {
          reject("Error reading wave data");
        }
      };
    });
    return wave;
  }
}