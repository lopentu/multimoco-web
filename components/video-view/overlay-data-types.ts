interface VideoSpanType {
  name: string
  offset: number
  span: number
}

type Point = [number, number];

interface PolygonBox {
  type: "Polygon",
  coordinates: Point[][]
}

interface OcrPayload {
  text: string,
  box: PolygonBox
}

type PhoneToken = [idx: number, start: number, end: number, token: string];

type SpeechEvent = [start: number, end: number, event: string];

export type SpeechEvents = SpeechEvent[];
export type PhoneData = PhoneToken[];
export type OcrDataType = { payload: OcrPayload } & VideoSpanType;
