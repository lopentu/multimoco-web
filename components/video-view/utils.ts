import { AnnotationSpans } from "./annot_types";
import { BodyCoords, FaceData, HandCoords, MediapipeData, MeshCoords, PostureData, XYZCoord, XYZVCoord } from "./overlay-data-types";

export function to_seconds(time_str: string | null | undefined) {
  if (!time_str) {
    return 0;
  }

  const parts = time_str.split(".")
  const ms = parseInt(parts[1]) * .001 || 0;
  const hms = parts[0].split(":").reverse();
  let seconds = 0;
  for (let i = 0; i < hms.length; i++) {
    seconds += parseInt(hms[i]) * (60 ** i);
  }
  return seconds + ms;
}

export function to_timestr(seconds: number){
  const min = ~~(seconds / 60)
  const hour = ~~(min / 60)
  const sec_mod = (~~seconds) % 60
  const hour_str = hour.toString().padStart(2, "0");
  const min_str = min.toString().padStart(2, "0");
  const sec_str = sec_mod.toString().padStart(2, "0");
  return `${hour_str}:${min_str}:${sec_str}`
}

export function convertSpansToSecs(annotSpans: AnnotationSpans) {
  const converted: AnnotationSpans = []
  for (const span_x of annotSpans) {
    const span_new = Object.assign({}, span_x);
    span_new.offset /= 1000;
    span_new.span /= 1000;
    converted.push(span_new);
  }
  return converted;
}

export function convertSpansToMsecs(annotSpans: AnnotationSpans) {
  const converted: AnnotationSpans = []
  for (const span_x of annotSpans) {
    const span_new = Object.assign({}, span_x);
    span_new.offset *= 1000;
    span_new.span *= 1000;
    converted.push(span_new);
  }
  return converted;
}

function intrapolateCoords(t: number,
  c1: XYZCoord | XYZVCoord,
  c2: XYZCoord | XYZVCoord): XYZCoord | XYZVCoord {
  let intCoords: number[] = [];

  c1.forEach((_, idx) => {
    const a = c1[idx];
    const b = c2[idx];
    let v = a;
    if (a != b) {
      v = a + (b - a) * t;
    }
    intCoords.push(v);
  });

  return intCoords as (XYZCoord | XYZVCoord);
}

function intrapolateFace(t: number,
  face1: FaceData | null, face2: FaceData | null) {

  if (face1 && !face2) return face1;
  if (!face1 && face2) return face2;
  if (face1 && face2) {
    let face_x = {} as FaceData;
    Object.keys(face1).forEach((key) => {
      face_x[key] = Object.keys(face1[key])
        .map((_, coord_i) => {
          return intrapolateCoords(
            t,
            face1[key][coord_i],
            face2[key][coord_i]);
        }) as MeshCoords;
    });

    return face_x;
  }

  return null;
}

function intrapolateBody(t: number,
  coords1: XYZCoord[] | XYZVCoord[] | null,
  coords2: XYZCoord[] | XYZVCoord[] | null) {

  if (coords1 && !coords2) return coords1;
  if (!coords1 && coords2) return coords2;
  if (coords1 && coords2) {
    let coords_x = coords1
      .map((_, idx) => {
        return intrapolateCoords(
          t,
          coords1[idx],
          coords2[idx]);
      });


    return coords_x;
  }

  return null;
}

export function intrapolateMediapipeData(t: number,
  mp1: MediapipeData, mp2: MediapipeData): MediapipeData | null {
  let mp_x = {
    face: null, pose: null,
    left_hand: null, right_hand: null
  } as MediapipeData;

  if (!mp1 && !mp2) return null;
  if (mp1 && !mp2) return mp1;
  if (!mp1 && mp2) return mp2;

  mp_x.face = intrapolateFace(t, mp1.face, mp2.face);
  mp_x.left_hand = intrapolateBody(t, mp1.left_hand, mp2.left_hand) as HandCoords;
  mp_x.right_hand = intrapolateBody(t, mp1.right_hand, mp2.right_hand) as HandCoords;
  mp_x.pose = intrapolateBody(t, mp1.pose, mp2.pose) as BodyCoords;

  return mp_x
}

export function post_process_pose(mp: PostureData[], videoName: string) {
  // only post processing the left/right split occurred in clgvd poses
  if (videoName.indexOf("clgvd") < 0) return mp;

  mp.forEach((x)=>renormalize_half(x.left, 0.));
  mp.forEach((x)=>renormalize_half(x.right, 0.5));

  return mp
}

function renormalize_half(mp_data: MediapipeData, offset: number) {  
  if (!mp_data) {
    return mp_data;
  }

  // handle face data  
  if (mp_data.face) {
    for (const [k, v] of Object.entries(mp_data.face)) {
      v.forEach((coord) => coord[0]=coord[0]/2+offset)
    }
  }

  // handle coordinate data
  if (mp_data.pose) {
    mp_data.pose.forEach((coord) => coord[0]=coord[0]/2+offset);
  }


  if (mp_data.left_hand) {
    mp_data.left_hand.forEach((coord)=>coord[0]=coord[0]/2+offset)
  }

  if (mp_data.right_hand) {
    mp_data.right_hand.forEach((coord)=>coord[0]=coord[0]/2+offset)
  }

  return mp_data
}