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
  searchType: string
  setQueryText: React.Dispatch<React.SetStateAction<string>>
  setSearchType: React.Dispatch<React.SetStateAction<string>>
  onSelectedSpanChanged: (url: string, offset: number) => void
}

export interface AnnotationSpan {
  _id?: string,
  name: string,
  offset: number,
  span: number,
  text: string,
  videoMeta: Record<string, any>,
  annotation: string,
  ocrBBox?: Point[]
}

export type AnnotationSpans = AnnotationSpan[];
export type GroupedAnnotationSpans = Map<string, AnnotationSpans>;
export type Point = number[];
