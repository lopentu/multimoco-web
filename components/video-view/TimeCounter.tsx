import React from 'react'

interface TimeCounterProps {
  currentTime: number,
  duration: number,
  styles: {[name: string]: any}
}

// where should I put this??
// this.props.video.addEventListener('timeupdate', this.timeUpdateListener, false)
function TimeCounter(props: TimeCounterProps) {

  function secondsToHms(seconds: number) {    
    if (!seconds) return '00:00:00'

    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);

    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  }
  
  return (
    <div style={props.styles.time}>
      {secondsToHms(props.currentTime)}
      /
      {secondsToHms(props.duration)}
    </div>
  )
}

export default TimeCounter