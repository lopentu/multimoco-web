export function to_seconds(time_str: string | null | undefined) {
  if (!time_str) {
    return 0;
  }

  const parts = time_str.split(".")
  const ms = parseInt(parts[1]) * .001 || 0;
  const hms = parts[0].split(":").reverse();
  let seconds = 0;
  for (let i = 0; i < hms.length; i++) {
    seconds += parseInt(hms[i]) * (60**i);
  }
  return seconds + ms;
}