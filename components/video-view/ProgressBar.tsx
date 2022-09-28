import React, { Component } from 'react'

interface ProgressBarProps{
  currentTime: number
  duration: number
  onSeek: (offset: number)=>void
  styles: {[name: string]: any}
}

export default function ProgressBar(props: ProgressBarProps) {

  function seek(e: React.MouseEvent<HTMLProgressElement>) {
    const percent = e.nativeEvent.offsetX / (e.target as HTMLProgressElement).offsetWidth;
    const offset = percent * props.duration;
    props.onSeek(offset);
  }
  

  return (
    <progress
      onClick={seek}      
      max='100'
      value={props.currentTime ? (props.currentTime / props.duration) * 100 : 0}
      style={props.styles}
    ></progress>
  )

}
