
import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnnotationSpans, AnnotationSpan } from '../types/corpus';
import CorpusResult from './corpus-result';
import { getVideoName } from './span-data-utils';
import VideoView from './video-view';
import SearchForm from './search-form';

export type SearchPageProps = {
  searchResults: string
  searchType: string
  searchCollection: string
  gestureSpeaker: string
  gestureSelect: string
}

const SearchPage = (props: SearchPageProps) => {
  const [queryText, setQueryText] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchCollection, setSearchCollection] = useState("legvid");
  const [cosp, setCosp] = React.useState<string[]>([]);
  const [speaker, setSpeaker] = React.useState<string>("any");
  const [videoUrl, setVideoUrl] = useState("");
  const [seekToSec, setSeekToSec] = useState(0);
  const [annotationSpans, setAnnotationSpans] = useState<AnnotationSpans>(JSON.parse(props.searchResults));

  const selectedSpans = annotationSpans !== null ?
    annotationSpans.filter((x) => x.name == getVideoName(videoUrl)) : null;

  const router = useRouter();
  const getParams = router.query;

  useEffect(() => {
    if (Array.isArray(getParams.query)) {
      let q = getParams.query.at(0) || ""
      setQueryText(q)
    } else {
      let q = getParams.query || ""
      setQueryText(q)
    }
    (getParams.searchType !== undefined) ? setSearchType(getParams.searchType as string) : setSearchType('asr');
    (getParams.searchCollection !== undefined) ? setSearchCollection(getParams.searchCollection as string) : setSearchCollection('legvid');
    (getParams.gestureSelect !== undefined) ? setCosp((getParams.gestureSelect as string).split(',')) : setCosp([]);
    (getParams.gestureSpeaker !== undefined) ? setSpeaker((getParams.gestureSpeaker as string)) : setSpeaker("any");
  }, []);

  // *
  // * Handle VideoView Seeking and spans
  // *  
  function onSelectedSpanChanged(videoUrl: string,
    seekToSec: number
  ) {
    setVideoUrl(videoUrl);
    setSeekToSec(seekToSec);
  }

  function onSelectedSpansUpdated(selSpans: AnnotationSpans) {
    const videoName = getVideoName(videoUrl);
    const baseIndex = annotationSpans.findIndex((x) => x.name == videoName);
    let newSpans = annotationSpans;
    if (baseIndex >= 0) {
      newSpans = annotationSpans.filter((x) => x.name != videoName);
      console.log("selected Spans: ", newSpans);
      newSpans.splice(baseIndex, 0, ...selSpans);
    }

    console.log("newSpans: ", newSpans);
    setAnnotationSpans(newSpans);
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          MultiMoco NTU&nbsp;|&nbsp;台大多媒體語料庫
        </title>
      </Head>

      <section className="features-1"
        style={{ minHeight: "100vh", }}>
        <Container maxWidth="xl">
          <Grid2
            display="flex"
            container
            spacing={2}
            sx={{ flexDirection: "row" }}
          >
            <SearchForm
              queryText={queryText}
              setQueryText={setQueryText}
              searchType={searchType}
              setSearchType={setSearchType}
              searchCollection={searchCollection}
              setSearchCollection={setSearchCollection}
              cosp={cosp}
              setCosp={setCosp}
              speaker={speaker}
              setSpeaker={setSpeaker}
            />

            {annotationSpans ?
              <Grid2 xs={6} md={6} lg={5} display="flex"
                justifyContent="center"
                alignContent="center"
                sx={{
                  position: "fixed",
                  right: "10px"
                }}>
                {videoUrl && selectedSpans &&
                  <VideoView
                    video_url={videoUrl}
                    seekToSec={seekToSec}
                    annotSpans={selectedSpans}
                    onAnnotSpansUpdated={onSelectedSpansUpdated} />
                }
              </Grid2>
              :
              <div />
            }
          </Grid2>
          <Grid2
            container
            spacing={5}
          >
            {annotationSpans ?

              <Grid2 xs={12}>
                <CorpusResult
                  annotationSpans={annotationSpans}
                  setAnnotationSpans={setAnnotationSpans}
                  queryText={queryText}
                  searchType={searchType}
                  searchCollection={searchCollection}
                  speaker={speaker}
                  cosp={cosp}
                  setQueryText={setQueryText}
                  setSearchType={setSearchType}
                  setCosp={setCosp}
                  setSearchCollection={setSearchCollection}
                  onSelectedSpanChanged={onSelectedSpanChanged}
                  setSpeaker={setSpeaker}
                />
              </Grid2>

              :
              <Grid2 xs={12} display="flex" justifyContent="center">
                <Typography variant="h5">Query cannot be empty</Typography>
              </Grid2>
            }
          </Grid2>
        </Container>
      </section>
    </>
  )
}

export default SearchPage;
