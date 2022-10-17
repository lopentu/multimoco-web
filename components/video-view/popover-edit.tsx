import { Icon, Popover, TextField } from "@mui/material";
import React, { useState } from "react";
import { AnnotationSpan } from "./annot_types";

interface PopOverEditProps {
  isOpen: boolean
  top: number
  left: number
  annotSpan: AnnotationSpan
  onClose: ()=>void
  onDelete: (span: AnnotationSpan) => void
  onUpdate: (span: AnnotationSpan) => void
}

export default function PopOverEdit(props: PopOverEditProps) {

  function onTextChanged(ev: React.ChangeEvent<HTMLInputElement>) {
    if (props.annotSpan) {
      props.annotSpan.annotation = ev.target.value;      
      props.onUpdate(props.annotSpan);
    }
  }

  function onDeletePressed(){
    if (props.annotSpan){
      props.onDelete(props.annotSpan);
    }
  }
  const annotText = props.annotSpan ? props.annotSpan.annotation : "";

  return (
    <Popover
      open={props.isOpen}
      anchorReference="anchorPosition"
      anchorPosition={{ top: props.top, left: props.left }}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >

      <TextField
        label="Annot"
        variant="outlined"
        size="small"
        value={annotText}
        onChange={onTextChanged} />
      <Icon
        baseClassName="fas"
        className="fa-check icon-hover"
        color="success" fontSize="small"
        onClick={props.onClose} />
      <Icon
        baseClassName="fas"
        className="fa-trash icon-hover"
        color="info" fontSize="small"
        onClick={onDeletePressed}/>
    </Popover>
  )
}