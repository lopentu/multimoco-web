import { BodyCoords, FaceData, HandCoords, MediapipeData, MeshCoords } from "./overlay-data-types";

function coord_conversion(coord: number[], offset: number, w: number, h: number) {
  if (coord.length < 2) return coord;
  return [(coord[0] / 2 + offset) * w, coord[1] * h]
}



export default function draw_mediapipe(
  ctx: CanvasRenderingContext2D,
  pose: MediapipeData, w: number, h: number, offset = 0) {


  function to_coord(x: number[]) {
    return coord_conversion(x, offset, w, h);
  }

  function draw_body_landmarks(coords: BodyCoords,
    left_hand: HandCoords | null, right_hand: HandCoords | null) {
    ctx.strokeStyle = "#EEE";
    ctx.fillStyle = "#FD0";
    ctx.lineWidth = 2;
    const uppers = [15, 13, 11, 12, 14, 16].map((i) => {
      return [coords[i][0], coords[i][1]]
    });

    if (left_hand) {
      uppers[0] = [left_hand[0][0], left_hand[0][1]];
    }

    if (right_hand) {
      uppers[5] = [right_hand[0][0], right_hand[0][1]];
    }

    ctx.beginPath();
    for (let i = 0; i < uppers.length - 1; i++) {
      const p1 = to_coord(uppers[i]);
      const p2 = to_coord(uppers[i + 1]);
      if (i == 0) {
        ctx.moveTo(p1[0], p1[1]);
        // ctx.arc(p1[0], p1[1], 3, 0, 360);
      }

      ctx.lineTo(p2[0], p2[1]);
    }
    ctx.stroke();

    for (const coord_x of uppers) {
      ctx.beginPath();
      const p = to_coord(coord_x);
      // ctx.moveTo(p[0], p[1]);
      ctx.arc(p[0], p[1], 3, 0, 360);
      ctx.fill();
    }
  }

  function draw_hand_landmarks(coords: HandCoords) {
    ctx.strokeStyle = "#EEE";
    ctx.fillStyle = "#DA0";
    ctx.lineWidth = 1;

    const hands = [
      [0, 1, 2, 3, 4],
      [0, 5, 6, 7, 8],
      [0, 17, 18, 19, 20],
      [5, 9, 13, 17],
      [9, 10, 11, 12],
      [13, 14, 15, 19]
    ]

    console.log("hand coords: ", coords);
    for (let path_x of hands) {
      ctx.beginPath();

      for (let i = 0; i < path_x.length - 1; i++) {
        
        const p1 = to_coord(coords[path_x[i]]);
        const p2 = to_coord(coords[path_x[i+1]]);
        if (i == 0) {
          ctx.moveTo(p1[0], p1[1]);
        }
        ctx.lineTo(p2[0], p2[1]);
      }
      ctx.stroke();
    }

    for (const coord_x of coords) {
      ctx.beginPath();
      const p = to_coord(coord_x);
      ctx.moveTo(p[0], p[1]);
      ctx.arc(p[0], p[1], 2, 0, 360);
      ctx.fill();
    }    
  }

  function draw_face_landmarks(coords: MeshCoords, loop = false) {
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 1;
    // console.log(pose.face.left_eye);
    // console.log("left_eye[0]: ", pose.face.left_eye[0][0] * w, pose.face.left_eye[0][1] * h);      
    ctx.beginPath();
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = to_coord(coords[i]);
      const p2 = to_coord(coords[i + 1]);
      if (i == 0) {
        ctx.moveTo(p1[0], p1[1]);
      }
      ctx.lineTo(p2[0], p2[1]);
    }

    if (loop) {
      const p0 = to_coord(coords[0]);
      ctx.lineTo(p0[0], p0[1]);
    }

    ctx.stroke();

  }
  if (pose && pose.face) {
    draw_face_landmarks(pose.face.left_eye, true);
    draw_face_landmarks(pose.face.right_eye, true);
    draw_face_landmarks(pose.face.left_eyebrow_lower);
    draw_face_landmarks(pose.face.right_eyebrow_lower);
    draw_face_landmarks(pose.face.lip_inner, true);
  }

  if (pose && pose.pose) {
    draw_body_landmarks(pose.pose, pose.left_hand, pose.right_hand);
  }

  if (pose && pose.left_hand) {
    draw_hand_landmarks(pose.left_hand);
  }

  if (pose && pose.right_hand) {
    draw_hand_landmarks(pose.right_hand);
  }
}