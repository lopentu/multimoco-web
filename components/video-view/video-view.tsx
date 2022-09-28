// Basing on: https://github.com/chomamateusz/react-canvas-video/blob/master/src

import { CSSProperties, useEffect, useRef } from "react"
import Bar from './Bar'
import styles from './styles';
import useVideoState from "./useVideoState";
import VideoControl from "./videoControl";

interface VideoViewProp {
  video_url: string
}

export default function VideoView(props: VideoViewProp) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onPlayRef = useRef<(() => void) | null>(null);
  const [videoState, setVideoState] = useVideoState(videoRef.current);  
  const videoControl = new VideoControl(videoRef.current, setVideoState);

  useEffect(() => {
    startPlayingInCanvas({ ratio: 640 / 360, autoplay: false });
    videoControl.setVideo(videoRef.current);

  }, [props.video_url]);

  function startPlayingInCanvas(
    { ratio, autoplay }: { ratio: number, autoplay: boolean }) {
    const cvs = canvasRef.current;
    if (!cvs) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const context = cvs.getContext('2d');
    if (!context) return;
    cvs.width = cvs.clientWidth;
    cvs.height = cvs.clientWidth / ratio;
    onPlayRef.current = () => {
      draw(video, context, cvs.width, cvs.height);
    }

    const onTimeUpdate = ()=>{
      if (videoRef.current){
        setVideoState(videoRef.current);
      }
    }

    video.addEventListener('play', onPlayRef.current, false);
    video.addEventListener('timeupdate', onTimeUpdate, false);
    if (autoplay) video.play();
  }

  function draw(video: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    canvasWidth: number, canvasHeight: number) {
    context.drawImage(video, 0, 0, canvasWidth, canvasHeight)
    drawText(context, video, canvasWidth, canvasHeight)
    if (!video.paused && !video.ended)
      setTimeout(draw, 1000 / 24, video, context, canvasWidth, canvasHeight);
  }

  function drawText(context: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    canvasWidth: number, canvasHeight: number) {

  }

  function onPlayPauseHandler(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const combinedStyles: any = {}
  Object.keys(styles).forEach(key => {
    combinedStyles[key] = { ...styles[key] }
  })
  return (
    <div>
      <video
        ref={videoRef}
        src={props.video_url}
        style={{ display: 'none' }}></video>
      <canvas
        ref={canvasRef}
        style={{
          width: '50%',
          ...combinedStyles.canvas
        }}
        onClick={onPlayPauseHandler}
      ></canvas>
      <Bar
        styles={combinedStyles}
        videoState={videoState}
        videoCtrl={videoControl}
      />      
    </div>)
}