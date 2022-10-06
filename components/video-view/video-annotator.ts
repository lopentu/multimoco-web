import { KeyboardEvent, MouseEvent } from "react";
import { Point, RectBox } from "./overlay-painter";
import VideoControl from "./videoControl";

export interface Cursor{
  x: number
  y: number
  isPressed: boolean
}

export interface AnnotCallbacks {
  
}

export default class VideoAnnotator {
  videoControl: VideoControl = {} as VideoControl;
  cursor: Cursor = {x: 0, y: 0, isPressed: false};
  private _redrawCallback: ()=>void = ()=>{};
  private _annotCallbacks: AnnotCallbacks|null = null;
  private _waveArea: RectBox = {width: 0, height: 0, x:0, y:0};

  constructor(videoCtrl: VideoControl){    
    this.videoControl = videoCtrl;
  }

  updateWaveArea(waveArea: RectBox){    
    this._waveArea = waveArea;
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
    }    
  }

  onMouseDown(ev: MouseEvent) {
    this.cursor.isPressed = true;
  }

  onKeyUp(ev: KeyboardEvent) {
    console.log(ev);
  }
}