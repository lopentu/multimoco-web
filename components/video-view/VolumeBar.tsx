import { CSSProperties } from "react";

interface VolumeBarProps {
  volume: number
  onVolumeChange: (volume: number) => void
  styles: {[name: string]: any}  
}

export default function VolumeBar(props: VolumeBarProps) {


  function volumeChangeHandler(e: React.MouseEvent<HTMLProgressElement>) {
    const percent = e.nativeEvent.offsetX / (e.target as HTMLProgressElement).offsetWidth;
    props.onVolumeChange(percent);
  }
  
  let combinedStyles: CSSProperties = Object.assign({}, 
        props.styles.progress, 
        props.styles.progressVol);
        
  return (
    <progress
      onClick={volumeChangeHandler}      
      max='1'
      value={props.volume}
      style={combinedStyles}
    ></progress>
  )

}