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
  highlightText: string
  searchResults: string
  player: React.MutableRefObject<VideoJsPlayer>
}
