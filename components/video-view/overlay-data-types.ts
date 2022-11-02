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

export type XYZCoord = [x: number, y: number, z:number];
export type XYZVCoord = [x: number, y: number, z: number, visibility: number];
export type MeshCoords = XYZCoord[];
export type HandCoords = XYZCoord[];
export type BodyCoords = XYZVCoord[];

export interface FaceData {
  [key: string]: MeshCoords
  lip_inner: MeshCoords
  left_eye: MeshCoords
  left_eyebrow: MeshCoords
  right_eye: MeshCoords
  right_eyebrow: MeshCoords
}

export interface MediapipeData {
  [key: string]: FaceData|HandCoords|BodyCoords|null;
  face: FaceData | null
  left_hand: HandCoords | null
  right_hand: HandCoords | null
  pose: BodyCoords | null
}

export interface PostureData {
  offset: number
  span: number  
  left: MediapipeData
  right: MediapipeData
}

export type PhoneToken = [
  idx: number, 
  start: number, end: number, 
  token: string, 
  cosps: number[]
];

type SpeechEvent = [start: number, end: number, event: string];

export type SpeechEvents = SpeechEvent[];
export type PhoneData = PhoneToken[];
export type OcrDataType = { payload: OcrPayload } & VideoSpanType;
