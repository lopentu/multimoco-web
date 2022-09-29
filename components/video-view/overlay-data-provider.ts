import { OcrDataType, PhoneData, SpeechEvents } from "./overlay-data-types";
import parseVTT, { VTTData } from "./vtt-parser";

export interface OverlayData {
  ocr_blocks: OcrDataType[]
  phones: PhoneData
  wave: number[]
  vtt: VTTData
  speaker: SpeechEvents
}

export default class OverlayDataProvider {
  videoName: string = ""
  ocr_blocks: OcrDataType[] = [];
  phones: PhoneData = [];
  wave: number[] = [];
  vtt: VTTData = [];

  baseURL: string = "https://storage.googleapis.com/multimoco/selected"
  constructor() {

  }

  setVideoName(videoName: string) {
    this.videoName = videoName.replace(".mp4", "");

  }

  private _reset_data() {    
    this.ocr_blocks = [];
    this.phones = [];
    this.wave = [];
    this.vtt = [];
  }

  loadData() {
    this._reset_data();
    const load_promises: Promise<any>[] = [
      this.getOCR(), this.getPhones(), this.getVTT(), this.getWave()
    ];
    Promise.allSettled(load_promises).then((results: PromiseSettledResult<any>[])=>{
      const ocr_result = results[0];
      if (ocr_result.status=="fulfilled"){
        this.ocr_blocks = ocr_result.value;
      }

      const phone_result = results[1];
      if (phone_result.status == "fulfilled"){
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
    })
  }

  getData(offset: number){

    if (this.ocr_blocks) {

    }
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
    const json = JSON.parse(text);    
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
    const wave = await new Promise<Int8Array>((resolver, reject)=>{
      reader.onload = () => {        
        if (reader.result){
          resolver(new Int8Array(reader.result as ArrayBuffer));
        } else {
          reject("Error reading wave data");          
        }
      };
    });    
    return wave;
  }
}