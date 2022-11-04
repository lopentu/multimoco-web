import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import VideoView from "../components/video-view";

export interface VideoPageProps {

}

export default function VideoPage(props: VideoPageProps) {

  const {query} = useRouter();

  // another testing clip: c5011-2204062000 / clgvd-210315091356
  let videoName = "";
  let videoUrl = "";
  if (query.name == "debug") {
    videoName = "clgvd-210315091356.mp4";
    videoUrl = `https://storage.googleapis.com/multimoco/selected/h264/${videoName}`;
  } else if (query.name){
    videoName = query.name + ".mp4";    
    videoUrl = `https://storage.googleapis.com/multimoco/selected/h264/${videoName}`;
  } else {    
    videoUrl = "";
  }

  const offset = parseInt(query.offset? query.offset.toString(): "1");

  return <div>
    <Grid container>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <VideoView          
          video_url={videoUrl}
          annotSpans={[]}
          onAnnotSpansUpdated={(spans)=>{}}
          seekToSec={offset}
        />
      </Grid>
    </Grid>
  </div>
}