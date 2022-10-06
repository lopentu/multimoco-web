import { KeyboardEvent, MouseEvent } from "react";
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

  constructor(videoCtrl: VideoControl){    
    this.videoControl = videoCtrl;
  }

  setAnnotCallbacks(callbacks: AnnotCallbacks) {
    this._annotCallbacks = callbacks;
  }

  setRedrawCallback(callback: ()=>void){
    this._redrawCallback = callback;
  }

  onMouseMove(ev: MouseEvent){
    this.cursor = {
        x: ev.clientX, 
        y: ev.clientY, 
        isPressed: this.cursor.isPressed };
    this._redrawCallback();
  }

  onMouseUp(ev: MouseEvent){
    this.cursor.isPressed = false;
    console.log(this.videoControl);
    this.videoControl.playPause();
  }

  onMouseDown(ev: MouseEvent) {
    this.cursor.isPressed = true;
  }

  onKeyUp(ev: KeyboardEvent) {
    console.log(ev);
  }
}