import { spawn } from "child_process";
import { useState } from "react";
import { AnnotationSpan } from "./annot_types";

export interface AnnotEditState {
  isOpen: boolean
  loc: { x: number, y: number }
  annotSpan: AnnotationSpan
  openWidget: (span: AnnotationSpan) => void
  closeWidget: () => void
  setLocation: (x: number, y: number) => void  
  setAnnotSpan: (span: AnnotationSpan) => void
}

export default function useAnnotEdit() {
  const [isOpen, setIsOpen] = useState(false);
  const [loc, setLoc] = useState({ x: 0, y: 0 });
  const [annotSpan, setAnnotSpan] = useState<AnnotationSpan | null>(null);

  function openWidget(span: AnnotationSpan) {
    setIsOpen(true);
    setAnnotSpan(span);
  }

  function closeWidget() {
    setIsOpen(false);
  }

  function setLocation(x: number, y: number) {
    setLoc({ x, y });
  }

  return {
    isOpen, loc, annotSpan,
    openWidget, closeWidget,
    setLocation, setAnnotSpan
  } as AnnotEditState

}