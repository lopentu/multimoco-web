import * as React from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css'

function VideoJS(props) {
  const videoRef = React.useRef(null);
  const playerRef: React.MutableRefObject<VideoJsPlayer | null> = React.useRef(null);
  const { options, onReady } = props;

  React.useEffect(() => {

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      // const player = playerRef.current;

      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <>
      <div data-vjs-player>
        <video ref={videoRef} className='video-js vjs-big-play-centered' />
      </div>
      {/* <video
        id="video-player"
        className="video-js"
        controls
        preload="auto"
        data-setup='{}'>
        <source src="https://storage.googleapis.com/multimoco/selected/h264/c5000-2109071858.mp4" type="video/mp4"></source>
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="http://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video> */}
    </>
  )
}

export default VideoJS