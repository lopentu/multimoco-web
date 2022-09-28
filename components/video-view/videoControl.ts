import { IVideoState } from "./useVideoState";

type VideoStateSetterType = (video: HTMLVideoElement) => void;

export default class VideoControl {
  private video: HTMLVideoElement | null = null;
  videoStateSetter: VideoStateSetterType;

  constructor(
    video: HTMLVideoElement | null,
    videoStateSetter: VideoStateSetterType) {
    this.video = video;
    this.videoStateSetter = videoStateSetter;
  }

  setVideo(elem: HTMLVideoElement|null) {
    this.video = elem;
    console.log(elem);
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
    if (this.video.paused || this.video.ended) {
      this.video.play().then(() => this.video?.pause())
    }
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