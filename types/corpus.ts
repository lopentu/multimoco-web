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
    LOS_DOWN = 1,           // 視線往下
    LOS_LEFT,           // 視線往左
    LOS_RIGHT,          // 視線往右
    LEFT_PALM_IN,       // 左掌心朝裡
    LEFT_PALM_OUT,      // 左掌心朝外
    LEFT_PALM_UP,       // 左掌心向上
    LEFT_PALM_DOWN,     // 左掌心向下
    LEFT_PALM_MEDIAL,   // 左掌心向中間
    LEFT_THUMB_UP,      // 左拇指豎起
    LEFT_INDEX_UP,     // 左食指伸直
    RIGHT_PALM_IN,     // 右掌心朝內 
    RIGHT_PALM_OUT,    // 右掌心朝外
    RIGHT_PALM_UP,     // 右掌心向上 
    RIGHT_PALM_DOWN,   // 右掌心向下 
    RIGHT_PALM_MEDIAL, // 右掌心向中間    
    RIGHT_THUMB_UP,    // 右拇指豎起
    RIGHT_INDEX_UP    // 右食指伸直    
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
