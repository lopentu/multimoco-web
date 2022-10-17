import { Icon, Popover, TextField } from "@mui/material";
import { useState } from "react";

interface PopOverEditProps {
  top: number
  left: number
  annot_text: string
}

export default function PopOverEdit(props: PopOverEditProps) {
  const [isOpen, setIsOpen] = useState(true);

  function onPopoverClose() {
    setIsOpen(!isOpen);
  }

  return (
    <Popover
      open={isOpen}
      anchorPosition={{ top: props.top, left: props.left }}
      onClose={onPopoverClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >

      <TextField label="Annot" variant="outlined" size="small" />
      <Icon
        baseClassName="fas"
        className="fa-check icon-hover" color="success" fontSize="small" />
      <Icon
        baseClassName="fas"
        className="fa-trash icon-hover" color="info" fontSize="small" />
    </Popover>
  )
}