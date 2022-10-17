import React from 'react'

import PlayPauseBtn from './PlayPauseBtn'
import TimeCounter from './TimeCounter'
import ProgressBar from './ProgressBar'
import MuteUnMuteBtn from './MuteUnMuteBtn'
import VolumeBar from './VolumeBar'
import { IVideoState } from './useVideoState'
import VideoControl from './videoControl'
import { AnnotationSpans } from './annot_types'

interface BarProps {
  styles: { [name: string]: any },
  videoState: IVideoState
  videoCtrl: VideoControl
  annotSpans: AnnotationSpans
}

function Bar(props: BarProps) {

  const videoState = props.videoState;
  const ctrl = props.videoCtrl;

  return (
    <div>
      <ProgressBar
        currentTime={videoState.currentTime}
        duration={videoState.duration}
        onSeek={(offset) => ctrl.seek(offset)}
        annotSpans={props.annotSpans}
      />
      <div style={props.styles.barContainer}>
        <PlayPauseBtn
          isPlaying={videoState.isPlaying}
          styles={props.styles}
          onPlayPause={() => ctrl.playPause()}
        />
        <TimeCounter
          currentTime={videoState.currentTime}
          duration={videoState.duration}
          styles={props.styles}
        />
        <div style={{ flexGrow: 1 }} />
        <MuteUnMuteBtn
          isMuted={videoState.isMuted}
          styles={props.styles}
          onToggleMute={() => ctrl.toggleMute()}
        />
        <VolumeBar
          volume={videoState.volume}
          onVolumeChange={(vol) => ctrl.changeVolume(vol)}
          styles={props.styles}
        />
        
      </div>
    </div>
  );
}

export default Bar