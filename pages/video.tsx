import Checkbox from "@mui/material/Checkbox";
import { FormLabel, Grid } from "@mui/material";
import { ChangeEvent, useState } from "react";
import VideoView from "../components/video-view";
import { Label } from "@mui/icons-material";

export interface VideoPageProps {

}

export default function VideoPage(props: VideoPageProps) {
  const [showOCR, setShowOCR] = useState(true);
  const [showWave, setShowWave] = useState(true);
  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.id);
    if (ev.target.id=="ocr_check"){
      setShowOCR(ev.target.checked);      
    } else if (ev.target.id=="wave_check") {
      setShowWave(ev.target.checked);
    }
  }
  return <div>
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <VideoView
          video_url="https://storage.googleapis.com/multimoco/selected/h264/c5000-2109071858.mp4"
          annotSpans={[]}
          onAnnotSpansUpdated={(spans)=>{}}
          seekToSec={456}
          toShowOcr={showOCR}
          toShowWave = {showWave}
        />
        <Grid container>
          <Grid item xs={4}>
          <Checkbox id="ocr_check" checked={showOCR} onChange={onChange} /><FormLabel>Show OCR</FormLabel>          
          </Grid>
          <Grid item xs={4}>
          <Checkbox id="wave_check" checked={showWave} onChange={onChange}/><FormLabel>Show Wave</FormLabel>
          </Grid>
        </Grid>
        
      </Grid>
    </Grid>
  </div>
}