export interface VideoViewProps{

}

export function VideoView(props: VideoViewProps){
  return <div>
    <video src="https://storage.googleapis.com/multimoco/selected/h264/c5000-2109071858.mp4">
    <track id="zh-sub" label="Chinese" kind="captions" 
                 src="https://storage.googleapis.com/multimoco/selected/vtt/c5000-2109071858.wav.vtt" default/>
    </video>
  </div>
}