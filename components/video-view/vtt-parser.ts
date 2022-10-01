import { to_seconds } from "./utils";

interface VTTEntry {
  start: number
  end: number
  text: string
}
export type VTTData = VTTEntry[]

export default function parseVTT(vtt: string): VTTData {
  let vtt_list: VTTEntry[] = [];
  let blocks = vtt.split("\n\n");
  for (let block_x of blocks) {
    let lines = block_x.split("\n");
    let timestamps = lines[0].match(/(\d+:)?\d+:\d+\.\d+/g);
    let start = NaN;
    let end = NaN;

    if (timestamps?.length == 2) {
      start = to_seconds(timestamps[0]);
      end = to_seconds(timestamps[1]);
      let text = lines.slice(1).join("\n");
      vtt_list.push({ start, end, text });
    }

  }
  
  return vtt_list;
}
