import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import VideoView from "../components/video-view";

export interface VideoPageProps {

}

export default function VideoPage(props: VideoPageProps) {

  const {query} = useRouter();

  // another testing clip: c5011-2204062000 / clgvd-210315091356
  const videoName = (query.name? query.name: "clgvd-210315091356") + ".mp4";
  const offset = parseInt(query.offset? query.offset.toString(): "0");

  return <div>
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <VideoView          
          video_url={`https://storage.googleapis.com/multimoco/selected/h264/${videoName}`}
          annotSpans={[]}
          onAnnotSpansUpdated={(spans)=>{}}
          seekToSec={offset}
        />
      </Grid>
    </Grid>
  </div>
}