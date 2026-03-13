import React from "react"
import { VideoJsPlayer } from "video.js"

export interface AlignedUtt {
  _id: string
  name: string
  offset: number
  span: number
  text: string
  phones?: string
  // payload: { text: string, phones?: string }
}

export enum CospeechGesture {
    // ================================================================
    // 舊格式 (legvid)
    // ================================================================
    LOS_DOWN = 1,
    LOS_LEFT,
    LOS_RIGHT,
    LEFT_PALM_IN,
    LEFT_PALM_OUT,
    LEFT_PALM_UP,
    LEFT_PALM_DOWN,
    LEFT_PALM_MEDIAL,
    LEFT_THUMB_UP,
    LEFT_INDEX_UP,
    RIGHT_PALM_IN,
    RIGHT_PALM_OUT,
    RIGHT_PALM_UP,
    RIGHT_PALM_DOWN,
    RIGHT_PALM_MEDIAL,
    RIGHT_THUMB_UP,
    RIGHT_INDEX_UP,

    // ================================================================
    // 新格式 (news / DWPose)
    // ================================================================
    // 視線方向
    GAZE_FORWARD,
    GAZE_LEFT,
    GAZE_RIGHT,
    GAZE_UP,
    GAZE_DOWN,

    // 手的出現
    HANDS_NONE,
    HAND_LEFT,
    HAND_RIGHT,
    HANDS_BOTH,

    // 左手手勢
    HAND_L_OPEN,
    HAND_L_CLOSED,
    HAND_L_POINTING,

    // 右手手勢
    HAND_R_OPEN,
    HAND_R_CLOSED,
    HAND_R_POINTING,

    // 身體動作
    // BODY_STILL,
    // BODY_MOVING,
}

export interface OcrBlock {
  _id: string
  name: string
  offset: number
  span: number
  text: string
  box: {
    type: string
    coordinates: Array<Array<Array<number>>>
    // payload: {
  }
  //   }
}
export interface VideoMeta {
  _id: string
  name: string
  offset: number
  span: number
  payload: {
    video_type: string
    channel: string
    duration: number
    datetime: Date
  }
}
export interface Results {
  results: AlignedUtt[] | OcrBlock[]
}
export interface SearchResults extends Results {
  searchType: "utt" | "ocr" | "blank"
  // results: {
  //   _id: string
  //   groupResults: AlignedUtt[] | OcrBlock[]
  //   video_meta: VideoMeta
  // }[]
}

export interface CorpusResultProps {
  annotationSpans: AnnotationSpans
  setAnnotationSpans: React.Dispatch<React.SetStateAction<AnnotationSpans>>
  queryText: string
  setQueryText: React.Dispatch<React.SetStateAction<string>>
  searchType: string
  setSearchType: React.Dispatch<React.SetStateAction<string>>
  speaker: string
  setSpeaker: React.Dispatch<React.SetStateAction<string>>
  cosp: string[]
  setCosp: React.Dispatch<React.SetStateAction<string[]>>
  searchCollection: string
  setSearchCollection: React.Dispatch<React.SetStateAction<string>>
  onSelectedSpanChanged: (url: string, offset: number) => void
}

export interface AnnotationSpan {
  _id?: string,
  name: string,
  offset: number,
  span: number,
  text: string,
  cosp: string[],
  blankIntervals: number[],
  video_type: string,
  channel: string,
  datetime: string,
  query_text?: string,
  search_type?: string,
  legislator?: string,
  meeting_header?: string
  meeting_date?: Date,
  meeting_name?: string,
  meeting_committee?: string,
  clip_lowres_link?: string,
  clip_highres_link?: string,
  video_id?: string,
  filename?: string,

  // videoMeta: Record<string, any>,
  annotation: string,
  ocrBBox?: Point[]
}

export type AnnotationSpans = AnnotationSpan[];
export type GroupedAnnotationSpans = Map<string, AnnotationSpans>;
export type Point = number[];
