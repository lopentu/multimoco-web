import React, { useEffect } from 'react'

import { PauseIcon, PlayIcon } from './icons'
export interface PlayPauseBtnProps {
  isPlaying: boolean,
  styles: {[name:string]: any}
  onPlayPause: ()=>void,
}

export function PlayPauseBtn(props: PlayPauseBtnProps) {
  


  return (
    <div
      onClick={props.onPlayPause}
      style={props.styles.button}
    >
      {
        props.isPlaying ?
          <PlayIcon style={props.styles.buttonIcon} />
          :
          <PauseIcon style={props.styles.buttonIcon} />
      }
    </div>
  )
}

export default PlayPauseBtn
