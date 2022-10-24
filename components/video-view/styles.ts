import { CSSProperties } from "react";

export const style: {[name: string]: CSSProperties} = {
  canvasContainer:{
      width: '100%'
  },
  canvas:{
      backgroundColor: 'gray',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
  },
  barContainer: {
      display: 'flex',
      backgroundColor: '#F0F0F0',
      justifyContent: "space-between",
      position: 'relative',
      top: '0px',
      width: '100%',
      height: '40px'
  },
  button: {
      height: '40px',
      border: 'none',
      backgroundColor: 'inherit',
      cursor: 'pointer'
  },
  buttonIcon: {
      width: '20px',
      height: '20px',
      margin: '10px 10'
  },
  progress: {
      width: 'calc(100% - 40px)',
      margin: '0 20px',
      height: '40px',
      cursor: 'pointer'
  },
  progressVol: {
      width: 'calc(30% - 40px)'
  },
  progressMuted: {
      backgroundColor: 'rgba(0,0,0,0.5)'
  },
  time: {
      height: '40px',
      lineHeight: '40px',
      fontSize: '1rem',
      fontFamily: 'Arial'
  }
}

export default style;