import VideoView from "../components/video-view";

export interface VideoPageProps{

}

export default function VideoPage(props: VideoPageProps){
  return <div>    
    <VideoView 
      video_url="https://storage.googleapis.com/multimoco/selected/h264/c5000-2109071858.mp4"
    />
  </div>
}