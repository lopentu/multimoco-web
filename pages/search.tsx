import { Container, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CorpusResult from '../components/corpus-result';
import { getVideoName } from '../components/span-data-utils';
import VideoView from '../components/video-view';
import clientPromise from '../lib/mongodb';
import { AnnotationSpans } from '../types/corpus';

import SearchForm from '../components/search-form';

export async function getServerSideProps(context: any) {
  try {
    const client = await clientPromise
    const db = client.db("multimoco")

    let results;
    const { query } = context;
    let searchType = query.searchType;
    let searchCollection = query.searchCollection;
    let gestures = query.gestureSelect;
    let speaker = query.gestureSpeaker;

    console.log(query)

    if (searchType === undefined) searchType = "asr"
    if (searchCollection === undefined) searchCollection = "legvid"
    if (gestures === undefined) gestures = ""
    if (speaker === undefined) speaker = "any"

    if (((query.query === "") || (query.query === undefined))) {
      return {
        props: {
          searchResults: JSON.stringify(null),
          searchType: null,
          searchCollection: null,
          gestureSelect: null,
          gestureSpeaker: null,
        }
      }
    }

    const aggregationPipeline = [
      { "$match": { "payload.text": new RegExp(query.query, "i") } },
      {
        "$sort": {
          "name": 1,
          "offset": 1
        }
      },
      // group results by video name
      // {
      //   "$group": {
      //     "_id": "$name",
      //     "groupResults": {
      //       "$push": "$$ROOT",
      //     },
      //   }
      // },
      {
        "$lookup": {
          "from": "videos_meta",
          "localField": "name",
          "foreignField": "name",
          "as": "video_meta",
        }
      },
    ]

    if ((gestures !== "")) {
      console.log("Gestures")
      console.log(gestures)
      let gestureSearch: string[] = []
      if (speaker === 'any') {
        gestures.split(',').forEach((ges) => {
          gestureSearch.push(`SP1_${ges}`);
          gestureSearch.push(`SP2_${ges}`);
        })
      } else if (speaker === 'SP1') {
        gestures.split(',').forEach((ges) => {
          gestureSearch.push(`SP1_${ges}`);
        })
      } else if (speaker === 'SP2') {
        gestures.split(',').forEach((ges) => {
          gestureSearch.push(`SP2_${ges}`);
        })
      }
      console.log(gestureSearch)
      aggregationPipeline.splice(1, 0, { "$match": { "payload.cosp": { $in: gestureSearch } } })
    }

    console.log(aggregationPipeline);

    if (searchType === "asr") {
      results = await db.collection("aligned_utt").aggregate(aggregationPipeline).toArray()

    } else if (searchType === "ocr") {
      results = await db.collection("ocr_blocks").aggregate(aggregationPipeline).toArray()
    }

    // filter results by collection
    if (searchCollection !== 'all') {
      results = results?.filter((doc) => doc.video_meta[0].payload.video_type === searchCollection);
    }

    console.log(results?.slice(0, 3))

    results?.forEach(function (part, index, theArray) {
      theArray[index].text = theArray[index].payload.text;
      theArray[index].cosp = theArray[index].payload.cosp
      theArray[index].blankIntervals = theArray[index].payload.blank_intervals

      // move payload to first level
      for (const [key, value] of Object.entries(theArray[index].video_meta[0].payload)) {
        theArray[index][key] = value;
      }

      if (theArray[index].hasOwnProperty("meeting_date")) {
        theArray[index].datetime = theArray[index].meeting_date
      }

      theArray[index].datetime = theArray[index].datetime.toDateString();
      if (theArray[index].payload.hasOwnProperty('box')) {
        theArray[index]['ocrBBox'] = theArray[index].payload.box.coordinates[0];
      }

      // include field for user annotations
      theArray[index].annotation = "";
      delete theArray[index].phones;
      delete theArray[index].payload;
      delete theArray[index]._id;
      delete theArray[index].video_meta;
    })

    console.log(results?.slice(-5));

    return {
      props: {
        searchResults: JSON.stringify(results),
        searchType,
        searchCollection,
        gestureSpeaker: speaker,
        gestureSelect: gestures,
      },
    }
  } catch (e) {
    console.error(e)
    return {
        props: {
          searchResults: JSON.stringify(null),
          searchType: null,
          searchCollection: null,
          gestureSelect: null,
          gestureSpeaker: null,
        }
    }
  }
}

type SearchPageProps = {
  searchResults: string
  searchType: string
  searchCollection: string
  gestureSpeaker: string
  gestureSelect: string
}

const SearchPage: NextPage<SearchPageProps> = (props) => {
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
