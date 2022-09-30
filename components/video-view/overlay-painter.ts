import { OcrBlock } from "../corpus_results";
import { OverlayData } from "./overlay-data-provider";
import { OcrDataType, PhoneData, SpeechEvents } from "./overlay-data-types";

const SPEAKER_EV_COLOR: {[name: string]: string}= {
  "SPEAKER_00": "#AAFFFF",
  "SPEAKER_01": "#AAAAFF",
  "SPEAKER_02": "#AACCCC",  
  "OVERLAP": "#FFAAAA"
}
export default class OverlayPainter {
  ctx: CanvasRenderingContext2D | null = null;
  cvsWidth: number = 640;
  cvsHeight: number = 360;
  wave_vh: number = 60;
  constructor() {

  }

  setContext(ctx: CanvasRenderingContext2D,
    width: number, height: number) {
    this.ctx = ctx;
    this.cvsWidth = width;
    this.cvsHeight = height;
    this.wave_vh = 50;
  }

  paint(overlayData: OverlayData, fps: number) {
    // this.overlay_text(`fps: ${fps}`);    
    if (overlayData.ocr_blocks.length > 0){
      this.overlay_ocr(overlayData.ocr_blocks);
    }
    if (overlayData.phones.length > 0) {
      this.overlay_phones(overlayData.phones,
        overlayData.wave_fr,
        overlayData.wave.length,
        overlayData.wave_span);
    }

    this.overlay_wave(overlayData.wave, 
      overlayData.wave_fr,
      overlayData.wave_span,
      overlayData.speech_events);
    if (overlayData.vtt.length > 0) {
      this.overlay_vtt(overlayData.vtt[0].text);
    }

  }

  overlay_text(text: string) {
    if (!this.ctx) return;
    this.ctx.fillStyle = "white";
    this.ctx.font = "50px serif";
    this.ctx.fillText(text, 100, 100)
  }

  overlay_ocr(ocr_blocks: OcrDataType[]){
    if (!this.ctx) return;

    const ctx = this.ctx;
    for(let ocr of ocr_blocks) {
      const [tl, tr, br, bl] = ocr.payload.box.coordinates[0];
      const tl_norm = [tl[0]*this.cvsWidth/1280, tr[1]*this.cvsHeight/720]
      const w_norm = (tr[0]-tl[0]) * this.cvsWidth/1280;
      const h_norm = (bl[1]-tl[1]) * this.cvsHeight/720;
      const text = ocr.payload.text;
      ctx.fillStyle="#3333FF99";      
      ctx.fillRect(tl_norm[0], tl_norm[1], w_norm, h_norm);
    }
  }

  overlay_vtt(text: string) {
    if (!this.ctx) return;
    this.ctx.font = "20px serif";
    this.ctx.textAlign = 'center';
    const vw = this.cvsWidth;
    const tl_y = this.cvsHeight - this.wave_vh - 5;
    // const extent = this.ctx.measureText(text);
    this.ctx.fillStyle = "#333333AA";
    this.ctx.fillRect(0, tl_y - 20, vw, 25);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, vw / 2, tl_y)
  }

  overlay_wave(
    wave: Int8Array, 
    wave_fr: number,
    wave_span: [number, number],
    events: SpeechEvents) {
    if (!this.ctx) return;

    const n_sample = wave.length;
    const vw = this.cvsWidth;
    const vh = this.wave_vh;
    const [wav_start, wav_end] = wave_span;
    
    const to_x = (d: number) => ~~(d / n_sample * vw);
    const to_y = (v: number) => ~~(v / 128 * vh) + (this.cvsHeight - vh / 2);
    const ctx = this.ctx;
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();    
    ctx.moveTo(to_x(0), to_y(0));    
    let last_color = "";
    
    for (let i = 0; i < wave.length; i++) {
      let ev = events.filter(([s, e, ev])=> {
        const wav_t = wav_start + i/wave_fr;
        return s < wav_t && wav_t < e;
      });

      const ev_type = ev.length > 0? ev[0][2]: "other";
      const ev_color = SPEAKER_EV_COLOR[ev_type] || "#FFFFFF";      
      const x = to_x(i);
      const y = to_y(wave[i]);      
      
      if (last_color != ev_color){
        last_color = ev_color;        
        ctx.stroke();
        ctx.strokeStyle = ev_color;
        ctx.beginPath();
        ctx.moveTo(x, y);                
      }
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  overlay_phones(phones: PhoneData,
    wave_fr: number,
    wave_nsamples: number,
    wave_span: [number, number]) {
    if (!this.ctx) return;
    const n_sample = wave_nsamples;
    const [wav_start, wav_end] = wave_span;
    const vw = this.cvsWidth;
    const vh = this.wave_vh;
    const to_x = (d: number) => ~~(d / n_sample * vw);
    const to_y = (v: number) => ~~(-v / 128 * vh / 2) + (this.cvsHeight - vh / 2);
    const ctx = this.ctx;

    ctx.fillStyle = "#333333AA";
    ctx.fillRect(0, this.cvsHeight - vh, vw, vh);

    for (let phone_idx = 0; phone_idx < phones.length; phone_idx++) {
      let phone = phones[phone_idx];
      const [phone_serial, start, end, label] = phone;
      const start_d = (start - wav_start) * wave_fr;
      const end_d = (end - wav_start) * wave_fr;
      const start_x = to_x(start_d);
      const end_x = to_x(end_d);
      if (phone_idx > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#AAA";
        ctx.moveTo(start_x, to_y(128));
        ctx.lineTo(start_x, to_y(-128));
        ctx.stroke()
      }

      if (~~phone_serial % 2 == 0) {
        this.ctx.font = "14px serif";
        this.ctx.textAlign = 'center';
        ctx.fillStyle = "#EEE";
        let render_label = label;
        if (render_label.startsWith("<")) {
          render_label = "_";
        }
        ctx.fillText(render_label, (start_x + end_x) / 2, to_y(80));
      }
    }
  }

}