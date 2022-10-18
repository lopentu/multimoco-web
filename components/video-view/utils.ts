import { AnnotationSpans } from "./annot_types";

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

export function convertSpansToSecs(annotSpans: AnnotationSpans) {
  const converted: AnnotationSpans = []
  for(const span_x of annotSpans) {
    const span_new = Object.assign({}, span_x);
    span_new.offset /= 1000;
    span_new.span /= 1000;
    converted.push(span_new);
  }
  return converted;
}

export function convertSpansToMsecs(annotSpans: AnnotationSpans) {
  const converted: AnnotationSpans = []
  for(const span_x of annotSpans) {
    const span_new = Object.assign({}, span_x);
    span_new.offset *= 1000;
    span_new.span *= 1000;
    converted.push(span_new);
  }
  return converted;
}