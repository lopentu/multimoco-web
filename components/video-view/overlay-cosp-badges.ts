
function get_color(
  prefix: string,
  side: "" | "left" | "right",
  badge: "eye" | "hand" | "finger",
  cosp_list: string[]) {

  const ONCOLOR = { eye: "#66c2a5", hand: "#fc8d62", finger: "#fb8072" };
  let flag = false;
  if (badge == "eye") {
    flag = cosp_list.some((x) => x.indexOf(prefix + "LOS") >= 0);
  } else if (badge == "hand") {
    flag = cosp_list.some((x) => x.indexOf(prefix + side.toUpperCase() + "_PALM") >= 0);
  } else if (badge == "finger") {
    const thumb = cosp_list.some((x) => x.indexOf(prefix + side.toUpperCase() + "_THUMB") >= 0);
    const index = cosp_list.some((x) => x.indexOf(prefix + side.toUpperCase() + "_INDEX") >= 0);
    flag = thumb || index;
  }

  return flag ? ONCOLOR[badge] : "#AAA";
}

export function draw_cosp_badges(
  ctx: CanvasRenderingContext2D,
  vw: number,
  vh: number,
  cosp_set: Set<string>) {
  // drawing badge

  ctx.fillStyle = "#AAA";
  const eye_svg = "M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM432 256c0 79.5-64.5 144-144 144s-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144zM288 192c0 35.3-28.7 64-64 64c-11.5 0-22.3-3-31.6-8.4c-.2 2.8-.4 5.5-.4 8.4c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-2.8 0-5.6 .1-8.4 .4c5.3 9.3 8.4 20.1 8.4 31.6z";
  const hand_svg = "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V336c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V32z";
  const finger_svg = "M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 25.3-19.5 46-44.3 47.9c7.7 8.5 12.3 19.8 12.3 32.1c0 23.4-16.8 42.9-38.9 47.1c4.4 7.2 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z";
  const rounded_rect = "M0,0 h200 a30,30 0 0 1 30,30 v100 a30,30 0 0 1 -30,30 h-200 a30,30 0 0 1 -30,-30 v-100 a30,30 0 0 1 30,-30 z";
  const scale = Math.max((vw / 1000) * 0.05, 0.02);

  const prefixes = ["SP1_", "SP2_"];
  const YOFFSET = 0.05;
  const cosp_list = Array.from(cosp_set);

  for (let idx = 0; idx < prefixes.length; idx++) {
    const prefix = prefixes[idx];
    ctx.translate((idx * 0.93 + 0.02) * vw, YOFFSET * vh);
    ctx.scale(scale, scale);
    const eye_path = new Path2D(eye_svg);
    ctx.fillStyle = get_color(prefix, "", "eye", cosp_list);
    ctx.fill(eye_path);
    ctx.resetTransform();

    // Hand
    const OFFSET = 0.9;
    ctx.translate((idx * OFFSET + 0.045) * vw, (YOFFSET + .08) * vh);
    ctx.scale(-scale, scale);
    ctx.fillStyle = "#AAA";
    const hand_path = new Path2D(hand_svg);
    ctx.fillStyle = get_color(prefix, "right", "hand", cosp_list);
    ctx.fill(hand_path);
    ctx.resetTransform();

    ctx.translate((idx * OFFSET + 0.05) * vw, (YOFFSET + .08) * vh);
    ctx.scale(scale, scale);
    ctx.fillStyle = get_color(prefix, "left", "hand", cosp_list);
    ctx.fill(hand_path);
    ctx.resetTransform();

    // Finger
    ctx.translate((idx * OFFSET + 0.02) * vw, (YOFFSET + .16) * vh);
    ctx.scale(scale, scale);    
    const finger_path = new Path2D(finger_svg);
    ctx.fillStyle = get_color(prefix, "right", "finger", cosp_list);
    ctx.fill(finger_path);
    ctx.resetTransform();

    ctx.translate((idx * OFFSET + 0.078) * vw, (YOFFSET + .16) * vh);
    ctx.scale(-scale, scale);
    ctx.fillStyle = get_color(prefix, "left", "finger", cosp_list);
    ctx.fill(finger_path);
    ctx.resetTransform();
  }

}