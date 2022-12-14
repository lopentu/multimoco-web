// Basing on: https://github.com/chomamateusz/react-canvas-video/blob/master/src

import { TurnedIn } from "@mui/icons-material";
import { Grid, Popover } from "@mui/material";
import React, { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from "react"
import Bar from './Bar'
import OverlayDataProvider from "./overlay-data-provider";
import OverlayPainter from "./overlay-painter";
import PopOverEdit from "./popover-edit";
import styles from './styles';
import useVideoState from "./useVideoState";
import useAnnotEdit from "./useAnnotEdit";
import { convertSpansToMsecs, convertSpansToSecs, to_seconds } from "./utils";
import VideoAnnotator, { VideoAnnotSpan } from "./video-annotator";
import VideoControl from "./videoControl";
import { AnnotationSpans, AnnotationSpan } from "./annot_types";

interface VideoViewProp {
  video_url: string
  annotSpans: AnnotationSpans
  onAnnotSpansUpdated: (spans: AnnotationSpans) => void;
  seekToSec?: number
  seekToTimeStr?: string
}

interface OverlayOptions {
  toShowOcr: boolean
  toShowWave: boolean
  toShowPosture: boolean
}

const ASPECT_RATIO = 640 / 360;
const TO_AUTOPLAY = false;
const videoControl = new VideoControl();
const videoAnnot = new VideoAnnotator(videoControl);
const overlayPainter = new OverlayPainter(videoAnnot);
let dataProvider = new OverlayDataProvider();

function undefined_or_true(x: undefined | boolean) {
  return x === undefined ? true : x;
}

export default function VideoView(props: VideoViewProp) {
  // For individual component testing
  // const [dummySpans, setDummySpans] = useState<AnnotationSpans>([]);
  // const annotSpans = dummySpans;  
  const annotSpans = convertSpansToSecs(props.annotSpans);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastRenderTime = useRef(0);    // for fps
  const { videoState, ...videoStateCtrl } = useVideoState(videoRef.current);
  videoControl.setVideo(videoRef.current, videoStateCtrl);
  const overlayOptions = useRef<OverlayOptions>({} as OverlayOptions);
  overlayOptions.current.toShowOcr = true;
  overlayOptions.current.toShowPosture = videoState.toShowPosture;
  overlayOptions.current.toShowWave = videoState.toShowWaveform;

  const annotEditState = useAnnotEdit();
  // videoAnnot.setAnnotationSpans(props.annotSpans);
  videoAnnot.setAnnotationSpans(annotSpans);
  videoAnnot.setAnnotSpansUpdatedCallback(onAnnotSpansUpdated);

  useEffect(() => {
    if (props.video_url === "") return;
    const callbacks = initialize_video();
    const video = videoRef.current;

    if (!callbacks || !video) return;

    video.addEventListener('play', callbacks.onPlayHandler, false);
    video.addEventListener('canplay', callbacks.onPlayHandler, false);
    video.addEventListener('timeupdate', callbacks.onTimeUpdateHandler, false);
    window.addEventListener('resize', callbacks.onResizeHandler, false);
    window.addEventListener('keydown', onKeyDown, true);
    videoAnnot.setRedrawCallback(() => requestAnimationFrame(render_frame));
    videoAnnot.setActiveSpanChangedCallback(onActiveSpanChanged);

    if (TO_AUTOPLAY) {
      video.play();
    }
    return () => {
      video.removeEventListener('play', callbacks.onPlayHandler, false);
      video.removeEventListener('canplay', callbacks.onPlayHandler, false);
      video.removeEventListener('timeupdate', callbacks.onTimeUpdateHandler, false);
      window.removeEventListener('resize', callbacks.onResizeHandler, false);
      window.removeEventListener('keydown', onKeyDown, true);
    }

  }, [props.video_url]);

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

  function initialize_video() {
    const cvs = canvasRef.current;
    if (!cvs) return null;
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const context = cvs.getContext('2d');
    if (!context) return null;

    // initialize overlayPainter
    cvs.width = cvs.clientWidth;
    cvs.height = cvs.clientWidth / ASPECT_RATIO;
    overlayPainter.setContext(context, cvs.width, cvs.height);

    // initialize videoControl
    videoControl.setVideo(videoRef.current, videoStateCtrl);

    // initialize dataProvider
    const pathTokens = new URL(props.video_url).pathname.split("/")
    if (pathTokens.length > 1) {
      const videoName = pathTokens.at(pathTokens.length - 1);
      dataProvider = new OverlayDataProvider();
      dataProvider.setVideoName(videoName as string);
      dataProvider.loadData();
    }

    // prepare callbacks
    function onPlayHandler() {
      requestAnimationFrame(render_frame);
    }

    const onTimeUpdateHandler = () => {
      if (videoRef.current) {
        videoStateCtrl.stateSetter(videoRef.current);
      }
    }

    const onResizeHandler = () => {
      const cvs = canvasRef.current;
      if (!cvs) return null;
      const context = cvs.getContext('2d');
      if (!context) return null;
      const width = cvs.clientWidth;
      const height = cvs.clientWidth / ASPECT_RATIO;
      // console.log(width, height);
      overlayPainter.setContext(context, width, height);
      requestAnimationFrame(render_frame);
    }

    return { onPlayHandler, onTimeUpdateHandler, onResizeHandler };
  }

  // *
  // * Other Control Bar Callbacks
  // *
  function onWinSizeChanged(winSize: number) {
    dataProvider.setWaveWindow(winSize);
    requestAnimationFrame(render_frame);
  }

  function onKeyDown(ev: globalThis.KeyboardEvent) {    
    if (ev.key == "ArrowRight") {      
      if (videoRef.current) {
        const delta = 1 * (10 ** (Number(ev.ctrlKey) - Number(ev.altKey))); 
        videoControl.seek(videoRef.current.currentTime + delta);
        ev.stopPropagation();
        ev.preventDefault();
      }
    } else if (ev.key == " ") {      
      videoControl.playPause();
      ev.stopPropagation();
      ev.preventDefault();
    } else if (ev.key == "ArrowLeft") {
      if (videoRef.current) {
        const delta = 1 * (10 ** (Number(ev.ctrlKey) - Number(ev.altKey)));        
        videoControl.seek(videoRef.current.currentTime - delta);
        ev.stopPropagation();
        ev.preventDefault();
      }
    }
  }
  // *
  // * Annotation Popover widget: States and Handlers
  // *
  function onActiveSpanChanged(span: VideoAnnotSpan, cursor: [number, number]) {
    annotEditState.setLocation(cursor[0], cursor[1]);
    annotEditState.openWidget(span);
  }

  function onPopOverEditClosed() {
    annotEditState.closeWidget();
  }

  function onAnnotSpanEdited(edit_span: AnnotationSpan) {
    let new_spans: AnnotationSpans = [];
    for (const span_x of annotSpans) {
      if (span_x.name == edit_span.name && span_x.offset == edit_span.offset) {
        new_spans.push(edit_span);
      } else {
        new_spans.push(span_x);
      }
    }
    annotEditState.setAnnotSpan(edit_span);
    onAnnotSpansUpdated(new_spans);
  }

  function onAnnotSpanDeleted(del_span: AnnotationSpan) {
    let new_spans: AnnotationSpans = [];

    for (const span_x of annotSpans) {
      if (span_x.name == del_span.name && span_x.offset == del_span.offset) {
        // pass
      } else {
        new_spans.push(span_x);
      }
    }
    annotEditState.closeWidget();
    onAnnotSpansUpdated(new_spans);
  }

  // *
  // * Annotation span event handler
  // *

  function onAnnotSpansUpdated(annotSpans: AnnotationSpans) {
    // setDummySpans(annotSpans);
    const msec_spans = convertSpansToMsecs(annotSpans);
    props.onAnnotSpansUpdated(msec_spans);
    requestAnimationFrame(render_frame);
  }

  // *
  // * Rendering routine
  // *

  function render_frame(timestamp: number) {
    const video = videoRef.current;
    if (!video) return;

    const delta_ms = timestamp - lastRenderTime.current;
    const delta_s = Math.max(delta_ms / 1000, .001);
    const fps = ~~(1 / delta_s * 100) / 100;
    lastRenderTime.current = timestamp;
        
    const toShowWave = overlayOptions.current.toShowWave;
    const toShowOcr = true;
    const toShowPosture = overlayOptions.current.toShowPosture;

    // skip rendering tighter than 16ms interval
    if (delta_ms > 15) {      
      const overlayData = dataProvider.getData(video.currentTime, videoState.toShowPosture);
      const cvs = canvasRef.current;
      if (!cvs) return null;

      // drawing routines and options
      const canvasWidth = cvs.clientWidth;
      const canvasHeight = cvs.clientWidth / ASPECT_RATIO;
      cvs.width = canvasWidth;
      cvs.height = canvasHeight;
      const context = cvs.getContext('2d');
      if (!context) return null;
      context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
      overlayPainter.setContext(context, canvasWidth, canvasHeight);
      overlayPainter.setOptions({ toShowOcr, toShowWave, toShowPosture });
      overlayPainter.paint(overlayData, fps);
    }

    if (!video.paused && !video.ended)
      requestAnimationFrame(render_frame);
  }

  const combinedStyles: any = {}
  Object.keys(styles).forEach(key => {
    combinedStyles[key] = { ...styles[key] }
  })

  let pop_over_edit;
  if (annotEditState.annotSpan) {
    pop_over_edit = <PopOverEdit
      isOpen={annotEditState.isOpen}
      left={annotEditState.loc.x}
      top={annotEditState.loc.y}
      annotSpan={annotEditState.annotSpan}
      onDelete={onAnnotSpanDeleted}
      onUpdate={onAnnotSpanEdited}
      onClose={onPopOverEditClosed} />
  } else {
    pop_over_edit = <div />
  }

  if (videoRef.current) {
    requestAnimationFrame(render_frame);
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      {pop_over_edit}
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
        onMouseMove={videoAnnot.onMouseMove.bind(videoAnnot)}
        onMouseUp={videoAnnot.onMouseUp.bind(videoAnnot)}
        onMouseDown={videoAnnot.onMouseDown.bind(videoAnnot)}
        onMouseLeave={videoAnnot.onMouseLeave.bind(videoAnnot)}
      ></canvas>
      <Bar
        styles={combinedStyles}
        videoState={videoState}
        videoCtrl={videoControl}
        annotSpans={annotSpans}
        onWinSizeChanged={onWinSizeChanged}
      />
    </div>
  )
}
