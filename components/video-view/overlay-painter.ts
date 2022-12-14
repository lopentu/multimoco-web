import { CospFeatureEnum } from "./cosp_enum";
import { draw_cosp_badges } from "./overlay-cosp-badges";
import { OverlayData } from "./overlay-data-provider";
import { MediapipeData, OcrDataType, PhoneData, SpeechEvents } from "./overlay-data-types";
import draw_mediapipe from "./overlay-poses";
import VideoAnnotator, { VideoAnnotSpan } from "./video-annotator";

export type Point = { x: number, y: number }
export type RectBox = { x: number, y: number, width: number, height: number };


const SPEAKER_EV_COLOR: { [name: string]: string } = {
  "SPEAKER_00": "#8dd3c7",
  "SPEAKER_01": "#bebada",
  "SPEAKER_02": "#fdcdac",
  "OVERLAP": "#fb8072"
}
const EV_LABELS: { [name: string]: number } = {
  "OVERLAP": 0,
  "SPEAKER_00": 1,
  "SPEAKER_01": 2,
  "SPEAKER_02": 3
};

const FILL_SELECTED_PHONE = "#FD9A";
const FILL_HOVER_PHONE = "#DD9A";
const FILL_SELECTED_SPAN = "#F93F";
const FILL_UNSELECTED_SPAN = "#FD3F";

export default class OverlayPainter {
  ctx: CanvasRenderingContext2D | null = null;
  annot: VideoAnnotator = {} as VideoAnnotator;
  cvsWidth: number = 640;
  cvsHeight: number = 360;
  wave_vh: number = 50;
  toShowWave: boolean = true;
  toShowOcr: boolean = false;
  toShowPosture: boolean = false;

  constructor(annot: VideoAnnotator) {
    this.annot = annot;
  }

  setContext(ctx: CanvasRenderingContext2D,
    width: number, height: number) {
    this.ctx = ctx;
    this.cvsWidth = width;
    this.cvsHeight = height;
    this.wave_vh = 50;
  }

  setOptions(options: { [key: string]: any }) {
    this.toShowWave = options.toShowWave === undefined ? true : options.toShowWave;
    this.toShowOcr = options.toShowOcr === undefined ? true : options.toShowOcr;
    this.toShowPosture = options.toShowPosture === undefined ? true : options.toShowPosture
  }

  notifyWaveArea(waveBox: RectBox) {
    this.annot.updateWaveArea(waveBox);
  }

  notifySpanAreas(spanBoxes: RectBox[]) {
    this.annot.updateSpanAreas(spanBoxes);
  }

  paint(overlayData: OverlayData, fps: number) {
    // this.overlay_text(`fps: ${fps}`);

    this.toShowOcr = this.toShowOcr &&
      overlayData.ocr_blocks.length > 0;
    this.toShowWave = this.toShowWave &&
      overlayData.wave.length > 0;

    if (this.toShowOcr) {
      this.overlay_ocr(overlayData.ocr_blocks);
    }

    if (this.toShowWave &&
      overlayData.phones.length > 0) {
      this.overlay_phones(overlayData.phones,
        overlayData.wave_fr,
        overlayData.wave.length,
        overlayData.wave_span);
    }

    if (this.toShowWave) {
      this.overlay_wave(overlayData.wave,
        overlayData.wave_fr,
        overlayData.wave_span,
        overlayData.speech_events);
    }

    const annot_spans = this.annot.annotSpans;
    if (this.toShowWave && annot_spans) {
      this.overlay_spans(annot_spans,
        overlayData.wave_fr,
        overlayData.wave.length,
        overlayData.wave_span);
    }

    if (overlayData.vtt.length > 0) {
      this.overlay_vtt(overlayData.vtt[0].text);
    }

    if (this.toShowPosture && overlayData.poses.length > 0) {
      this.overlay_pose(overlayData.poses[0], 0);
      this.overlay_pose(overlayData.poses[1], 0.5);
    }

    this.overlay_cosp(overlayData.phones, overlayData.wave_span);
  }

  overlay_text(text: string) {
    if (!this.ctx) return;
    this.ctx.fillStyle = "white";
    this.ctx.font = "50px serif";
    this.ctx.fillText(text, 100, 100)
  }

  overlay_ocr(ocr_blocks: OcrDataType[]) {
    if (!this.ctx) return;

    const ctx = this.ctx;
    type OcrTuple = [ocr_box: RectBox, ocr: OcrDataType];
    const ocr_boxes: OcrTuple[] = [];
    for (let ocr of ocr_blocks) {
      const [tl, tr, br, bl] = ocr.payload.box.coordinates[0];

      const tl_norm = [tl[0] * this.cvsWidth / 1280, tr[1] * this.cvsHeight / 720]
      const w_norm = (tr[0] - tl[0]) * this.cvsWidth / 1280;
      const h_norm = (bl[1] - tl[1]) * this.cvsHeight / 720;
      const ocr_box = {
        x: tl_norm[0],
        y: tl_norm[1],
        width: w_norm,
        height: h_norm
      }

      ocr_boxes.push([ocr_box, ocr]);
    }

    this.annot.updateOcrAreas(ocr_boxes.map((x)=>x[0]));

    for (let [box_x, ocr] of ocr_boxes) {
      if (this.annot.cursorInBox(box_x)) {
        this.annot.onOcrDetected(ocr);
        ctx.strokeStyle = this.annot.isPressed? "#F2B183": "#fd8d3c";
        ctx.lineWidth = 2;
        ctx.strokeRect(box_x.x, box_x.y, box_x.width, box_x.height);
      }
    }
  }

  overlay_vtt(text: string) {
    if (!this.ctx) return;
    this.ctx.font = "20px serif";
    this.ctx.textAlign = 'center';
    const vw = this.cvsWidth;
    let bl_y = 0;
    if (this.toShowWave) {
      bl_y = this.cvsHeight - this.wave_vh - 5;
    } else {
      bl_y = this.cvsHeight - 5;
      this.notifyWaveArea({ x: 0, y: 0, width: vw, height: 0 });
    }

    // const extent = this.ctx.measureText(text);
    this.ctx.fillStyle = "#333333AA";
    this.ctx.fillRect(0, bl_y - 20, vw, 25);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, vw / 2, bl_y)
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
    const to_y = (v: number) => ~~(v / 196 * vh) + (this.cvsHeight - vh / 2);
    const ctx = this.ctx;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(to_x(0), to_y(0));
    let last_color = "";

    const sorted_events = events
      .sort((a, b) => (EV_LABELS[b[2]] || 9) - (EV_LABELS[a[2]] || 9));

    for (let i = 0; i < wave.length; i++) {
      let ev = sorted_events
        .filter(([s, e, ev]) => {
          const wav_t = wav_start + i / wave_fr;
          return s < wav_t && wav_t < e;
        });

      const ev_type = ev.length > 0 ? ev[0][2] : "other";
      const ev_color = SPEAKER_EV_COLOR[ev_type] || "#FFFFFF";
      const x = to_x(i);
      const y = to_y(wave[i]);

      if (last_color != ev_color) {
        last_color = ev_color;
        ctx.stroke();
        ctx.lineWidth = 1;
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
    const phone_modulo = Math.max(~~(n_sample / 1500), 1);
    const [wav_start, wav_end] = wave_span;
    const vw = this.cvsWidth;
    const vh = this.wave_vh;
    const to_x = (d: number) => ~~(d / n_sample * vw);
    const to_y = (v: number) => ~~(-v / 128 * vh / 2) + (this.cvsHeight - vh / 2);
    const ctx = this.ctx;

    this.notifyWaveArea({
      x: 0, y: this.cvsHeight - vh,
      width: vw, height: vh
    });

    // draw background
    ctx.fillStyle = "#333A";
    ctx.fillRect(0, this.cvsHeight - vh, vw, vh);

    for (let phone_idx = 0; phone_idx < phones.length; phone_idx++) {
      let phone = phones[phone_idx];
      const [phone_serial, start, end, label] = phone;
      const start_d = (start - wav_start) * wave_fr;
      const end_d = (end - wav_start) * wave_fr;
      const start_x = to_x(start_d);
      const end_x = to_x(end_d);
      if (phone_idx > 0) {

        const phone_box = {
          x: start_x,
          y: to_y(128),
          width: end_x - start_x,
          height: vh
        }

        // determine if phone is under the cursor
        if (this.annot.cursorInBox(phone_box)) {
          this.annot.onPhoneDetected(phone);
          ctx.fillStyle = this.annot.isPressed ? FILL_SELECTED_PHONE : FILL_HOVER_PHONE;
          ctx.fillRect(phone_box.x, phone_box.y,
            phone_box.width, phone_box.height);
        }

        // determine if phone is already selected
        if (this.annot.isPhoneSelected(phone)) {
          ctx.fillStyle = FILL_SELECTED_PHONE;
          ctx.fillRect(phone_box.x, phone_box.y,
            phone_box.width, phone_box.height);
        }

        // draw phone boundaries
        if (n_sample < 6 * wave_fr) {
          ctx.beginPath();
          ctx.strokeStyle = "#FFF";
          ctx.lineWidth = 1;
          ctx.moveTo(start_x, to_y(128));
          ctx.lineTo(start_x, to_y(-128));
          ctx.stroke()
        }
      }

      if (~~phone_serial % phone_modulo == 0) {
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

  overlay_cosp(
    phones: PhoneData,
    wave_span: [number, number]) {

    if (!this.ctx) return;

    const ctx = this.ctx;
    const vw = this.cvsWidth;
    const vh = this.cvsHeight;

    const center = (wave_span[0] + wave_span[1]) / 2;
    const cosp_set = new Set<string>();
    phones.filter((x) => (center - 1 < x[1]) && (center > x[1] + 0.05))
      .forEach((tok) => {
        tok[4]
          .map((x) => {
            if (x > 17) {
              return "SP2_" + CospFeatureEnum[x - 17 - 1]
            } else {
              return "SP1_" + CospFeatureEnum[x - 1]
            }
          })
          .forEach((xx) => cosp_set.add(xx));
      });

    draw_cosp_badges(ctx, vw, vh, cosp_set);


  }

  overlay_spans(spans: VideoAnnotSpan[],
    wave_fr: number,
    wave_nsamples: number,
    wave_span: [number, number]) {
    const n_sample = wave_nsamples;
    const vw = this.cvsWidth;
    const vh = this.wave_vh;
    const [wav_start, wav_end] = wave_span;

    const to_x = (d: number) => ~~(d / n_sample * vw);
    const to_y = (v: number) => ~~(-v / 128 * vh / 2) + (this.cvsHeight - vh / 2);

    const ctx = this.ctx;
    if (!ctx) return;

    this.annot.clearSpanAreas();
    const spanBoxes: RectBox[] = [];
    for (const span_x of spans) {
      if (span_x.end < wav_start || span_x.start > wav_end) continue;
      const start_d = (span_x.start - wav_start) * wave_fr;
      const end_d = (span_x.end - wav_start) * wave_fr;
      const span_box = {
        x: to_x(start_d), y: to_y(128),
        width: to_x(end_d) - to_x(start_d),
        height: vh
      };
      spanBoxes.push(span_box);

      if (this.annot.cursorInBox(span_box)) {
        this.annot.setActiveSpan(span_x);
        ctx.strokeStyle = FILL_SELECTED_SPAN;
      } else {
        ctx.strokeStyle = FILL_UNSELECTED_SPAN;
      }

      ctx.lineWidth = 3;
      ctx.strokeRect(span_box.x, span_box.y,
        span_box.width, span_box.height);
    }

    this.notifySpanAreas(spanBoxes);
  }

  overlay_pose(pose: MediapipeData, offset: number = 0) {
    if (!this.ctx) return;
    draw_mediapipe(this.ctx, pose, this.cvsWidth, this.cvsHeight);
  }
}