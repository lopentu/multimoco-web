import React, { Component, CSSProperties } from 'react'

interface ProgressBarProps{
  currentTime: number
  duration: number
  onSeek: (offset: number)=>void
  styles: {[name: string]: CSSProperties}
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
      style={{
        marginLeft: "20px", alignSelf: 'center'}}
    ></progress>
  )

}
