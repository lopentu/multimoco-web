import { AnnotationSpans, GroupedAnnotationSpans } from "../types/corpus";

export function getVideoName(url: string) {
  try {
    const parts = (new URL(url)).pathname.split("/");
    return parts[parts.length - 1].replace(".mp4", "");
  } catch (e) {
    return "";
  }
}

export function groupAnnotationSpans(
  spans: AnnotationSpans
): GroupedAnnotationSpans {

  const spanMap = spans.reduce(
    (entryMap, e) => entryMap.set(e.name, [...entryMap.get(e.name) || [], e]),
    new Map<string, AnnotationSpans>()
  );

  spanMap.forEach((x) => x.sort((a, b) => a.offset - b.offset));

  return spanMap;
}

export function flattenAnnotationSpanGroups(
  spanGroups: GroupedAnnotationSpans
): AnnotationSpans {

  return Array.from(spanGroups.values()).flat();

}