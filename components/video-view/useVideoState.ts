import { useState } from "react";

interface IVideoState {
  isPlaying: boolean
  isMuted: boolean  
  currentTime: number
  duration: number
  volume: number
}

export default function useVideoState(video: HTMLVideoElement): 
  [IVideoState, (video: HTMLVideoElement)=>IVideoState]{
      
  let videoState: IVideoState = stateSetter(video);

  function stateSetter(video: HTMLVideoElement) {

    return {
      isPlaying: !video.paused,
      isMuted: video.muted,
      currentTime: video.currentTime,
      duration: video.duration,
      volume: video.volume
    }
  }

  return [videoState, stateSetter]
}