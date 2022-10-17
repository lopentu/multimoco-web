import { Link } from "@mui/material";

interface WinSizeButtonsProps {
  onWinSizeChanged: (winSize: number) => void;
}

export default function WinSizeButtons(props: WinSizeButtonsProps){
  return (
    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
      <Link href="#" color="#006" onClick={()=>props.onWinSizeChanged(1)}>1s</Link>
      <Link href="#" color="#006" onClick={()=>props.onWinSizeChanged(3)}>3s</Link>
      <Link href="#" color="#006" onClick={()=>props.onWinSizeChanged(5)}>5s</Link>
      <Link href="#" color="#006" onClick={()=>props.onWinSizeChanged(10)}>10s</Link>
    </div>
  )
}