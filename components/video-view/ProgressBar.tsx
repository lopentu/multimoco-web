import React, { CSSProperties, useRef } from 'react'
import { AnnotationSpans } from './annot_types'

const INNER_LENGTH_PX = 600;
interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (offset: number) => void
  styles?: { [name: string]: CSSProperties }
  annotSpans: AnnotationSpans
}

export default function ProgressBar(props: ProgressBarProps) {

  const duration = props.duration;
  const divRef = useRef<HTMLDivElement | null>(null);
  const currentTimeNorm = props.currentTime ? (props.currentTime / duration) : 0;

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!divRef.current) return;
    const offsetX = e.nativeEvent.offsetX;
    const divWidth = divRef.current.offsetWidth;
    const curPos = 620 * (offsetX / divWidth) - 10;
    const percent = curPos / INNER_LENGTH_PX;
    const offset = percent * props.duration;
    props.onSeek(offset);
  }

  const span_rects = props.annotSpans.map((span_x) => {
    const start_x = (span_x.offset / duration) * INNER_LENGTH_PX;
    const end_x = (span_x.offset + span_x.span) / duration * INNER_LENGTH_PX;
    const width = Math.max(end_x - start_x, 5);
    const rect_elem = (
      <rect
        key={`${start_x}-${end_x}`}
        x={start_x} y="0"
        rx="1" ry="1"
        width={width} height="10"
        style={{ fill: 'url(#span-gradient)' }}
      >
        <title>{span_x.annotation}</title>
      </rect>)
    return rect_elem;
  })

  return (
    <div ref={divRef}
      onClick={seek}
      style={{
        display: "block",
        width: "100%",
        height: "3vh",
        textAlign: "center",
        background: "linear-gradient(0deg, #333333 0%, #c2c2c2 100%)"
      }}>
      <svg
        width="100%"
        height="100%"
        viewBox="-10 -5 620 20"
        preserveAspectRatio="none"
        fill="none"
        style={{ marginTop: "-7px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <linearGradient id="timeline-gradient"
          x1="0" y1="0" x2="0" y2="10"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#333333" />
          <stop offset="1" stopColor="#c2c2c2" />
        </linearGradient>
        <linearGradient id="span-gradient"
          x1="0" y1="0" x2="0" y2="10"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EECC33FF" />
          <stop offset="1" stopColor="#FFDD33FF" />
        </linearGradient>
        <rect
          x="0" y="0" width={INNER_LENGTH_PX} height="10"
          rx="5" ry="5"
          style={{
            strokeWidth: "0px",
            fill: 'url(#timeline-gradient)'
          }}
        />

        {/* Span indicators */}
        {span_rects}

        {/* cursor */}
        <rect
          x={currentTimeNorm * INNER_LENGTH_PX}
          y="0" width="1" height="10"
          style={{ fill: '#EE0000' }}
        />
      </svg>
    </div>
    // <progress
    //   onClick={seek}      
    //   max='100'
    //   value={currentTime}
    //   style={{
    //     marginLeft: "20px", alignSelf: 'center'}}
    // ></progress>
  )

}
