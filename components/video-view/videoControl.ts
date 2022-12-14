import { IVideoState } from "./useVideoState";

type VideoStateSetterType = (video: HTMLVideoElement) => void;
interface VideoStateControlType {
  stateSetter: VideoStateSetterType,
  toggleWaveform: ()=>void,
  togglePosture: ()=> void
}

export default class VideoControl {
  private video: HTMLVideoElement | null = null;
  videoStateSetter: VideoStateSetterType = (_)=>{};
  toggleWaveform: ()=>void = ()=>{};
  togglePosture: ()=>void = ()=> {};

  constructor() {    
  }  
  
  setVideo(elem: HTMLVideoElement|null, 
      stateCtrl: VideoStateControlType) {
    this.video = elem;
    this.videoStateSetter = stateCtrl.stateSetter;    
    this.toggleWaveform = stateCtrl.toggleWaveform;
    this.togglePosture = stateCtrl.togglePosture;
  }

  get videoName() {
    const uri = this.video?.src;
    if(uri){      
      const parts = new URL(uri).pathname.split("/");            
      return parts[parts.length-1].replace(".mp4", "");
    } else {
      return ""
    }
    
  }

  playPause() {
    if (!this.video) return;

    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
    this.videoStateSetter(this.video);
  }

  seek(offset: number) {
    if (!this.video) return;

    this.video.currentTime = offset;    
    // if (this.video.paused || this.video.ended) {
    //   this.video.play().then(() => this.video?.pause())
    // }
    this.videoStateSetter(this.video);
  }

  toggleMute() {
    if (!this.video) return;

    this.video.muted = !this.video.muted;
    this.videoStateSetter(this.video);
  }

  changeVolume(volume: number) {
    if (!this.video) return;

    this.video.volume = volume;
    this.videoStateSetter(this.video);
  }
}