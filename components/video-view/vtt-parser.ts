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

function to_seconds(time_str: string) {
  const parts = time_str.split(".")
  const ms = parseInt(parts[1]) * .001;
  const hms = parts[0].split(":").reverse();
  let seconds = 0;
  for (let i = 0; i < hms.length; i++) {
    seconds += parseInt(hms[i]) * (60**i);
  }
  return seconds + ms;
}