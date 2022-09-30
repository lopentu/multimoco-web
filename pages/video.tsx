import { Grid } from "@mui/material";
import VideoView from "../components/video-view";

export interface VideoPageProps {

}

export default function VideoPage(props: VideoPageProps) {
  return <div>
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <VideoView
          video_url="https://storage.googleapis.com/multimoco/selected/h264/c5000-2109071858.mp4"
        />
      </Grid>
    </Grid>
  </div>
}