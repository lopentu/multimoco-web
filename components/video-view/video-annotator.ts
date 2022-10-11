import { KeyboardEvent, MouseEvent } from "react";
import { PhoneToken } from "./overlay-data-types";
import { Point, RectBox } from "./overlay-painter";
import VideoControl from "./videoControl";

export interface Cursor{
  x: number
  y: number
  isPressed: boolean
}

type PhoneRange = {start: PhoneToken, end: PhoneToken};
export interface AnnotCallbacks {
  
}

export default class VideoAnnotator {
  videoControl: VideoControl = {} as VideoControl;
  cursor: Cursor = {x: 0, y: 0, isPressed: false};
  private _redrawCallback: ()=>void = ()=>{};
  private _annotCallbacks: AnnotCallbacks|null = null;
  private _waveArea: RectBox = {width: 0, height: 0, x:0, y:0};
  private _selected_phone_range: PhoneRange = {} as PhoneRange;

  constructor(videoCtrl: VideoControl){    
    this.videoControl = videoCtrl;
  }

  get isPressed() {
    return this.cursor.isPressed;
  }

  isPhoneSelected(phone: PhoneToken) {
    const range = this._selected_phone_range;
    if (!(range.start || range.end)){
      return false;
    }
    return range.start[0] <= phone[0] && phone[0] <= range.end[0];
  }

  updateWaveArea(waveArea: RectBox){    
    this._waveArea = waveArea;
  }

  onPhoneDetected(phone: PhoneToken) {
    if (this.isPressed) {
      const range = this._selected_phone_range
      if (!(range.start || range.end)){
        range.start = phone;
        range.end = phone;
      } else if (range.start[0] > phone[0]) {
        range.start = phone;
      } else if (range.end[0] < phone[0]){
        range.end = phone;
      }
    }
  }

  setAnnotCallbacks(callbacks: AnnotCallbacks) {
    this._annotCallbacks = callbacks;
  }

  setRedrawCallback(callback: ()=>void){
    this._redrawCallback = callback;
  }

  private _pointInBox(pnt: Point, box: RectBox){    
    if ((pnt.x > box.x && pnt.x < box.x+box.width) && 
        (pnt.y>box.y && pnt.y < box.y+box.height)){
          return true;
        }
    return false;
  }

  cursorInBox(box: RectBox) {
    const pnt = {x: this.cursor.x, y: this.cursor.y};
    return this._pointInBox(pnt, box);
  }

  onMouseMove(ev: MouseEvent){
    this.cursor = {
        x: ev.nativeEvent.offsetX, 
        y: ev.nativeEvent.offsetY, 
        isPressed: this.cursor.isPressed };
    this._redrawCallback();
  }

  onMouseUp(ev: MouseEvent){
    this.cursor.isPressed = false;
    const pnt = {x: ev.nativeEvent.offsetX, 
                 y: ev.nativeEvent.offsetY};
    
    if (!this._pointInBox(pnt, this._waveArea)){
      this.videoControl.playPause();
    } else {
      this._redrawCallback();
    }    
  }

  onMouseDown(ev: MouseEvent) {
    this._selected_phone_range = {} as PhoneRange;
    this.cursor.isPressed = true;
    this._redrawCallback();
  }

  onMouseLeave(ev:MouseEvent) {
    this.cursor = {x: 0, y: 0, isPressed: false};
    this._redrawCallback();
  }

  onKeyUp(ev: KeyboardEvent) {
    console.log(ev);
  }
}