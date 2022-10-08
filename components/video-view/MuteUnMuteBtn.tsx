import { MuteIcon, UnMuteIcon } from './icons'

interface MuteProps {
  onToggleMute: () => void
  isMuted: boolean
  styles: {[name: string]: any}
}

function MuteUnMuteBtn(props: MuteProps) {
  
  return (
    <div
      onClick={props.onToggleMute}
      style={props.styles.button}
    >
      {
        props.isMuted ?
          <UnMuteIcon style={props.styles.buttonIcon} />
          :
          <MuteIcon style={props.styles.buttonIcon} />
      }
    </div>
  )

}

export default MuteUnMuteBtn