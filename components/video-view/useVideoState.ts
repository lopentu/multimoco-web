import { Dispatch, SetStateAction, useState } from "react";

export interface IVideoState {
  isPlaying: boolean
  isMuted: boolean  
  currentTime: number
  duration: number
  volume: number
}

export default function useVideoState(video: HTMLVideoElement|null): 
  [IVideoState, (video: HTMLVideoElement)=>void]{
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);

  let videoState: IVideoState = {
    isPlaying, isMuted,
    currentTime, duration,
    volume
  };

  function stateSetter(video: HTMLVideoElement) {        
      setIsPlaying(!video.paused);
      setIsMuted(video.muted);
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setVolume(video.volume);
  }

  return [videoState, stateSetter]
}