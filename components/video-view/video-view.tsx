// Basing on: https://github.com/chomamateusz/react-canvas-video/blob/master/src

import { TurnedIn } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { CSSProperties, useEffect, useRef, useState } from "react"
import Bar from './Bar'
import OverlayDataProvider from "./overlay-data-provider";
import OverlayPainter from "./overlay-painter";
import styles from './styles';
import useVideoState from "./useVideoState";
import { to_seconds } from "./utils";
import VideoControl from "./videoControl";

interface VideoViewProp {
  video_url: string
  seekToSec?: number
  seekToTimeStr?: string
  toShowWave?: boolean
  toShowOcr?: boolean
}

interface OverlayOptions{
  toShowOcr: boolean
  toShowWave: boolean
}

const ASPECT_RATIO = 640 / 360;
const dataProvider = new OverlayDataProvider();
const overlayPainter = new OverlayPainter();

function undefined_or_true(x: undefined|boolean){
  return x===undefined? true: x;
}

export default function VideoView(props: VideoViewProp) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);  
  const lastRenderEpoch = useRef(0);    // for fps
  const [videoState, setVideoState] = useVideoState(videoRef.current);
  const videoControl = new VideoControl(videoRef.current, setVideoState);    
  const overlayOptions = useRef<OverlayOptions>({} as OverlayOptions);
  
  useEffect(() => {
    const callbacks = startPlayingInCanvas({ ratio: ASPECT_RATIO, autoplay: false });
    const video = videoRef.current;

    if (!callbacks || !video) return;

    video.addEventListener('play', callbacks.onPlayHandler, false);
    video.addEventListener('timeupdate', callbacks.onTimeUpdateHandler, false);    
    return () => {
      video.removeEventListener('play', callbacks.onPlayHandler, false);
      video.removeEventListener('timeupdate', callbacks.onTimeUpdateHandler, false);      
    }

  }, [props.video_url]);

  useEffect(()=>{
    overlayOptions.current.toShowOcr = undefined_or_true(props.toShowOcr);
    overlayOptions.current.toShowWave = undefined_or_true(props.toShowWave);
  }, [props.toShowOcr, props.toShowWave]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = props.seekToSec || 0;
  }, [props.seekToSec]);

  useEffect(() => {
    if (!props.seekToSec) {
      // only used when seekToSec is undefined
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = to_seconds(props.seekToTimeStr);
    }
  }, [props.seekToTimeStr]);

  function startPlayingInCanvas(
    { ratio, autoplay }: { ratio: number, autoplay: boolean }) {
    const cvs = canvasRef.current;
    if (!cvs) return null;
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const context = cvs.getContext('2d');
    if (!context) return null;
    cvs.width = cvs.clientWidth;
    cvs.height = cvs.clientWidth / ratio;
    overlayPainter.setContext(context, cvs.width, cvs.height);

    videoControl.setVideo(videoRef.current);
    const pathTokens = new URL(props.video_url).pathname.split("/")
    if (pathTokens.length > 1) {
      const videoName = pathTokens.at(pathTokens.length - 1);
      dataProvider.setVideoName(videoName as string);
      dataProvider.loadData();
    }
    
    let onPlayHandler = () => draw(video);
    const onTimeUpdateHandler = () => {
      if (videoRef.current) {
        setVideoState(videoRef.current);
      }
    }
    const onResizeHandler = () => {
      const cvs = canvasRef.current;
      if (!cvs) return null;
      const context = cvs.getContext('2d');
      if (!context) return null;
      const width = cvs.clientWidth;
      const height = cvs.clientWidth / ratio;
      // console.log(width, height);
      overlayPainter.setContext(context, width, height);
    }

    if (autoplay) video.play();
    return { onPlayHandler, onTimeUpdateHandler, onResizeHandler };
  }

  function draw(video: HTMLVideoElement) {    
    const overlayData = dataProvider.getData(video.currentTime);

    const cvs = canvasRef.current;
    if (!cvs) return null;
    const canvasWidth = cvs.clientWidth;
    const canvasHeight = cvs.clientWidth / ASPECT_RATIO;
    cvs.width = canvasWidth;
    cvs.height = canvasHeight;
    const context = cvs.getContext('2d');
    const toShowWave = overlayOptions.current.toShowWave;
    const toShowOcr = overlayOptions.current.toShowOcr;
    if (!context) return null;
    // console.log("clientWidth, width: ", cvs.clientWidth, cvs.width);

    const currentEpoch = Date.now();
    const delta = currentEpoch - lastRenderEpoch.current;
    const delta_s = Math.max(delta / 1000, .001)
    const fps = ~~(1 / delta_s * 100) / 100;
    lastRenderEpoch.current = currentEpoch;

    // drawing routines and options
    context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
    overlayPainter.setContext(context, canvasWidth, canvasHeight);
    overlayPainter.setOptions({ toShowOcr, toShowWave });        
    overlayPainter.paint(overlayData, fps);
    // console.log("w, h: ", canvasWidth, canvasHeight);

    if (!video.paused && !video.ended)
      requestAnimationFrame(() => draw(video));
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
    <>
      <video
        ref={videoRef}
        src={props.video_url}
        style={{ display: 'none' }}></video>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          ...combinedStyles.canvas
        }}
        onClick={onPlayPauseHandler}
      ></canvas>
      <Bar
        styles={combinedStyles}
        videoState={videoState}
        videoCtrl={videoControl}
      />
    </>
  )
}