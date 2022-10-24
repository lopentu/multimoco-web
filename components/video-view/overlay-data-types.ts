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

type XYZCoord = [x: number, y: number, z:number];
type XYZVCoord = [x: number, y: number, z: number, visibility: number];
type MeshCoords = XYZCoord[];
type HandCoords = XYZCoord[];
type BodyCoords = XYZVCoord[];

interface FaceData {
  lip_inner: MeshCoords
  left_eye: MeshCoords
  left_eyebrow: MeshCoords
  right_eye: MeshCoords
  right_eyebrow: MeshCoords
}

interface MediapipeData {
  face: FaceData | null
  left_hand: HandCoords | null
  right_hand: HandCoords | null
  posture: BodyCoords | null
}

interface PostureData {
  offset: number
  span: number
  left: MediapipeData
  right: MediapipeData
}

export type PhoneToken = [idx: number, start: number, end: number, token: string];

type SpeechEvent = [start: number, end: number, event: string];

export type SpeechEvents = SpeechEvent[];
export type PhoneData = PhoneToken[];
export type OcrDataType = { payload: OcrPayload } & VideoSpanType;
