import { KeyboardEvent, MouseEvent } from "react";
import { OcrBlock } from "../../types/corpus";
import { AnnotationSpan, AnnotationSpans } from "./annot_types";
import { OcrDataType, PhoneToken } from "./overlay-data-types";
import { Point, RectBox } from "./overlay-painter";
import { to_timestr } from "./utils";
import VideoControl from "./videoControl";

export interface Cursor {
  x: number
  y: number
  isPressed: boolean
}

interface VideoAnnotSpanInfo {
  start: number
  end: number  
  isActive: boolean
}

export type VideoAnnotSpan = AnnotationSpan & VideoAnnotSpanInfo;

type PhoneRange = { start: PhoneToken, end: PhoneToken };
type AnnotSpansUpdated = (spans: VideoAnnotSpan[]) => void;
type ActiveSpanChanged = (span: VideoAnnotSpan, cursor_loc: [number, number]) => void;
export default class VideoAnnotator {
  videoControl: VideoControl = {} as VideoControl;
  cursor: Cursor = { x: 0, y: 0, isPressed: false };
  private _redrawCallback: () => void = () => { };
  private _onAnnotSpansUpdated: AnnotSpansUpdated | null = null;
  private _onActiveSpanChanged: ActiveSpanChanged | null = null;
  private _waveArea: RectBox = { width: 0, height: 0, x: 0, y: 0 };
  private _spanAreas: RectBox[] = [];
  private _ocrAreas: RectBox[] = [];
  private _selected_phone_range: PhoneRange = {} as PhoneRange;
  private _press_phone: PhoneToken | null = null;
  private _span_data: AnnotationSpans = [];
  private _annot_spans: VideoAnnotSpan[] = [];


  constructor(videoCtrl: VideoControl) {
    this.videoControl = videoCtrl;
  }

  get isPressed() {
    return this.cursor.isPressed;
  }

  get annotSpans() {
    return this._annot_spans;
  }

  setAnnotationSpans(spans: AnnotationSpans){
    this._span_data = spans;
    this._annot_spans = spans.map((x) => {
      return {...x,     
        start: x.offset,
        end: x.offset + x.span,
        annotation: x.annotation,
        isActive: false
      }
    });
  }
  
  isPhoneSelected(phone: PhoneToken) {
    const range = this._selected_phone_range;
    if (!(range.start || range.end)) {
      return false;
    }
    return range.start[0] <= phone[0] && phone[0] <= range.end[0];
  }

  updateWaveArea(waveArea: RectBox) {
    this._waveArea = waveArea;
  }

  updateSpanAreas(spanAreas: RectBox[]){
    this._spanAreas = spanAreas;
  }

  updateOcrAreas(ocrAreas: RectBox[]){
    this._ocrAreas = ocrAreas;
  }

  clearSpanAreas() {
    this._spanAreas = [];
  }

  setActiveSpan(span: VideoAnnotSpan){
    // if it is already active, there is nothing to do.
    const numActive = this._annot_spans.reduce((n,x)=>n + ~~(x.isActive), 0);
    if (numActive==1 && span.isActive) return;

    this._annot_spans.forEach((x)=>x.isActive=false);
    span.isActive = true;
    this._redrawCallback();
  }

  onPhoneDetected(phone: PhoneToken) {
    if (this.isPressed) {
      const range = this._selected_phone_range
      const press_phone = this._press_phone;
      if (!(range.start || range.end)) {
        range.start = phone;
        range.end = phone;
        this._press_phone = phone;
      } else if (press_phone && phone[0] > press_phone[0]) {
        // detected phone is on the right
        range.end = phone;
      } else if (press_phone && phone[0] < press_phone[0]) {
        // detected phone is on the left
        range.start = phone;
      }
    }
  }

  onOcrDetected(span: OcrDataType) {
    if (this.isPressed){
      const timestamp = to_timestr(span.offset/1000)
      const ocr_info = `[${span.name}] ${timestamp} ${span.payload.text}`;
      if (navigator?.clipboard){
        navigator.clipboard.writeText(ocr_info);
        console.log("Text copied: ", ocr_info);
      }
      
    }
  }

  setRedrawCallback(callback: () => void) {
    this._redrawCallback = callback;
  }

  setActiveSpanChangedCallback(callback: ActiveSpanChanged) {
    this._onActiveSpanChanged = callback;
  }

  setAnnotSpansUpdatedCallback(callback: AnnotSpansUpdated) {
    this._onAnnotSpansUpdated = callback;
  }

  private _pointInBox(pnt: Point, box: RectBox) {
    if ((pnt.x > box.x && pnt.x < box.x + box.width) &&
      (pnt.y > box.y && pnt.y < box.y + box.height)) {
      return true;
    }
    return false;
  }

  cursorInBoxes(pnt: Point, boxes: RectBox[]) {
    return boxes.some((box_x)=>{      
      return this._pointInBox(pnt, box_x);
    });
  }

  cursorInBox(box: RectBox) {
    const pnt = { x: this.cursor.x, y: this.cursor.y };
    return this._pointInBox(pnt, box);
  }

  onMouseMove(ev: MouseEvent) {
    this.cursor = {
      x: ev.nativeEvent.offsetX,
      y: ev.nativeEvent.offsetY,
      isPressed: this.cursor.isPressed
    };
    this._redrawCallback();
  }

  onMouseUp(ev: MouseEvent) {
    // handle this._annot_spans
    this.cursor.isPressed = false;
    this._press_phone = null;
    const range = this._selected_phone_range;
    if (range.start && range.end) {
      const { start: start_phone,
        end: end_phone } = range;
      const span = {
        name: this.videoControl.videoName,           
        offset: start_phone[1],
        span: end_phone[2] - start_phone[1], // this span indicates time duration
        start: start_phone[1],
        end: end_phone[2],
        videoMeta: {},
        text: "",
        annotation: "",        
        isActive: true
      }
      this._annot_spans.push(span)
    }

    if(this._onAnnotSpansUpdated) {
      this._onAnnotSpansUpdated(this._annot_spans);
    }

    // handle playback
    const pnt = {
      x: ev.nativeEvent.offsetX,
      y: ev.nativeEvent.offsetY
    };

    const pntInOcrs = this._ocrAreas
      .some((box_x)=>{
        return this._pointInBox(pnt, box_x)
      });

    if (!this._pointInBox(pnt, this._waveArea)
        && !pntInOcrs) {
      this.videoControl.playPause();
    } else {
      this._redrawCallback();
    }
  }

  onMouseDown(ev: MouseEvent) {
    const pnt = {
      x: ev.nativeEvent.offsetX,
      y: ev.nativeEvent.offsetY
    };

    const isInSpans = this.cursorInBoxes(pnt, this._spanAreas);
    if (isInSpans) {
      if (this._onActiveSpanChanged){
        const spans = this._annot_spans.filter((x)=>x.isActive);
        if (spans.length == 1){
          const mouseX = ev.nativeEvent.clientX;
          const mouseY = ev.nativeEvent.clientY;
          this._onActiveSpanChanged(spans[0], [mouseX, mouseY]);
        }
      }
    } else {
      this._selected_phone_range = {} as PhoneRange;
      this.cursor.isPressed = true;
      this._redrawCallback();
    }
  }

  onMouseLeave(ev: MouseEvent) {
    this.cursor = { x: 0, y: 0, isPressed: false };
    this._redrawCallback();
  }

  onKeyUp(ev: KeyboardEvent) {
    console.log(ev);
  }
}