import React from 'react'

import PlayPauseBtn from './PlayPauseBtn'
import TimeCounter from './TimeCounter'
import ProgressBar from './ProgressBar'
import MuteUnMuteBtn from './MuteUnMuteBtn'
import VolumeBar from './VolumeBar'
import useVideoState from './useVideoState'

interface BarProps {
  styles: { [name: string]: any },
  video: HTMLVideoElement
}

function Bar(props: BarProps) {
  const [videoState, setVideoState] = useVideoState(props.video);  

  function playPauseListener() {
    props.video && setVideoState(props.video);
  }

  function seekListener(offset: number) {

  }

  function toggleMuteListener() {

  }

  function volumeChangeListener(volume: number) {

  }

  return (
    <div style={props.styles.barContainer}>
      <PlayPauseBtn
        isPlaying={videoState.isPlaying}
        styles={props.styles}
        onPlayPause={playPauseListener}
      />
      <TimeCounter
        currentTime={videoState.currentTime}
        duration={videoState.duration}
        styles={props.styles}
      />
      <ProgressBar
        currentTime={videoState.currentTime}
        duration={videoState.duration}
        onSeek={seekListener}
        styles={props.styles}
      />
      <MuteUnMuteBtn
        isMuted={videoState.isMuted}
        styles={props.styles}
        onToggleMute={toggleMuteListener}
      />
      <VolumeBar
        volume={videoState.volume}
        onVolumeChange={volumeChangeListener}
        styles={props.styles}
      />
    </div>
  );
}

export default Bar