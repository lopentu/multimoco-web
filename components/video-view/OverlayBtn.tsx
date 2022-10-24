import { CSSProperties } from "react"
import { PostureIcon, WaveformIcon } from "./icons"

interface OverlayBtnProps {
  toShowWaveform: boolean
  toShowPosture: boolean
  onWaveformToggled: ()=>void
  onPostureToggled: ()=>void
  styles: { [name: string]: CSSProperties }
}

export default function OverlayBtn(props: OverlayBtnProps) {
  return (
    <>
      <WaveformIcon
        isEnable={props.toShowWaveform}
        onClick={props.onWaveformToggled}
        style={props.styles.buttonIcon} />
      <PostureIcon
        isEnable={props.toShowPosture}
        onClick={props.onPostureToggled}
        style={props.styles.buttonIcon} />
    </>
  )


}