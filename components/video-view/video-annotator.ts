import { KeyboardEvent, MouseEvent } from "react";
import { PhoneToken } from "./overlay-data-types";
import { Point, RectBox } from "./overlay-painter";
import VideoControl from "./videoControl";

export interface Cursor {
  x: number
  y: number
  isPressed: boolean
}

export interface VideoAnnotSpan {
  start_phone: PhoneToken
  end_phone: PhoneToken
  start: number
  end: number
  annotation: string
  isActive: boolean
}

type PhoneRange = { start: PhoneToken, end: PhoneToken };
type AnnotSpansUpdated = (spans: VideoAnnotSpan[]) => void;
type ActiveSpanChanged = (span: VideoAnnotSpan) => void;
export default class VideoAnnotator {
  videoControl: VideoControl = {} as VideoControl;
  cursor: Cursor = { x: 0, y: 0, isPressed: false };
  private _redrawCallback: () => void = () => { };
  private _onAnnotSpansUpdated: AnnotSpansUpdated | null = null;
  private _onActiveSpanChanged: ActiveSpanChanged | null = null;
  private _waveArea: RectBox = { width: 0, height: 0, x: 0, y: 0 };
  private _spanAreas: RectBox[] = [];
  private _selected_phone_range: PhoneRange = {} as PhoneRange;
  private _press_phone: PhoneToken | null = null;
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

  clearSpanAreas() {
    this._spanAreas = [];
  }

  setActiveSpan(span: VideoAnnotSpan){
    this._annot_spans.forEach((x)=>x.isActive=false);
    span.isActive = true;
    if (this._onActiveSpanChanged){
      this._onActiveSpanChanged(span);
    }
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
        start_phone: start_phone,
        end_phone: end_phone,
        start: start_phone[1],
        end: end_phone[2],
        annotation: "",
        isActive: true
      }
      this._annot_spans.push(span)
    }

    // handle playback
    const pnt = {
      x: ev.nativeEvent.offsetX,
      y: ev.nativeEvent.offsetY
    };

    if (!this._pointInBox(pnt, this._waveArea)) {
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
      // pass
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