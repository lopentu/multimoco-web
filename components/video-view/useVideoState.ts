import { Dispatch, SetStateAction, useState } from "react";

export interface IVideoState {
  isPlaying: boolean
  isMuted: boolean  
  currentTime: number
  duration: number
  volume: number
  toShowWaveform: boolean
  toShowPosture: boolean
}



export default function useVideoState(video: HTMLVideoElement|null) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [toShowWaveform, setShowWaveform] = useState(true);
  const [toShowPosture, setShowPosture] = useState(false);

  let videoState: IVideoState = {
    isPlaying, isMuted,
    currentTime, duration,
    volume,
    toShowWaveform, toShowPosture
  };

  function stateSetter(video: HTMLVideoElement) {        
      setIsPlaying(!video.paused);
      setIsMuted(video.muted);
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setVolume(video.volume);
  }

  function toggleWaveform() {
    setShowWaveform((x)=>!x)
  }

  function togglePosture() {
    setShowPosture((x)=>!x)
  }

  return {videoState, 
          stateSetter, 
          toggleWaveform, togglePosture}
}