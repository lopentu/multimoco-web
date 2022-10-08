import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input, Dropdown, Spacer } from "@nextui-org/react";
import { TextField, Button, Select, InputLabel, FormControl, MenuItem, Container } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import CorpusResult from '../components/corpus_results';
import clientPromise from '../lib/mongodb'
import SearchIcon from '@mui/icons-material/Search';
import Searchbar from '../components/navbar';
import VideoJS from '../components/videojs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import videojs, { VideoJsPlayer } from 'video.js';
import { AnnotationSpans } from '../types/corpus';
import { FormLabel, FormControlLabel, RadioGroup, Radio } from '@mui/material';




export async function getServerSideProps(context: any) {
  try {
    const client = await clientPromise
    const db = client.db("multimoco")

    const { query } = context
    let searchType = query.searchType
    console.log(query)
    if (searchType === undefined) {
      searchType = "asr"
    }
    // const searchType = "asr"
    let results
    console.log(query.query);
    // const searchResults = await db.collection("aligned_utt").find({ "payload.text": new RegExp(query.query, "i") }).limit(100).toArray();
    // const searchResults: SearchResults = {}
    if (searchType === "asr") {
      results = await db.collection("aligned_utt").aggregate([
        { "$match": { "payload.text": new RegExp(query.query, "i") } },
        {
          "$sort": {
            "name": 1,
            "offset": 1
          }
        },
        // {
        //   "$group": {
        //     "_id": "$name",
        //     "groupResults": {
        //       "$push": "$$ROOT",
        //     },
        //   }
        // },
        // {
        //   "$lookup": {
        //     "from": "videos_meta",
        //     "localField": "_id",
        //     "foreignField": "name",
        //     "as": "video_meta",
        //   }
        // },
      ]).toArray()

    } else if (searchType === "ocr") {
      results = await db.collection("ocr_blocks").aggregate([
        { "$match": { "payload.text": new RegExp(query.query, "i") } },
        {
          "$sort": {
            "offset": 1
          }
        },
        // {
        //   "$group": {
        //     "_id": "$name",
        //     "groupResults": {
        //       "$push": "$$ROOT",
        //     },
        //   }
        // },
        // {
        //   "$lookup": {
        //     "from": "videos_meta",
        //     "localField": "_id",
        //     "foreignField": "name",
        //     "as": "video_meta",
        //   }
        // },
      ]).toArray()
    }
    results?.forEach(function (part, index, theArray) {
      // theArray[index] = { ...theArray[index], ...{ text:theArray[index].payload.text, annotation: "" } };
      theArray[index].text = theArray[index].payload.text;
      if (theArray[index].payload.hasOwnProperty('box')) {
        theArray[index]['ocrBBox'] = theArray[index].payload.box.coordinates[0];
      }
      theArray[index].annotation = "";
      delete theArray[index].phones;
      delete theArray[index].payload;
      delete theArray[index]._id;
    })

    console.log(results?.slice(0));

    const searchResults = {
      searchType: searchType,
      results: results
    }

    // alignedUtt.forEach((elem) => {
    //   // console.log(elem['video_meta'])
    //   searchResults[elem._id] = { aligned_utt: elem['aligned_utt'], video_meta: elem['video_meta'][0] }
    // })
    // ocrBlocks.forEach((elem) => {
    //   if (!(elem._id in searchResults)) {
    //     searchResults[elem._id] = { ocr_blocks: elem["ocr_blocks"], video_meta: elem['video_meta'][0] }
    //   } else {
    //     searchResults[elem._id]["ocr_blocks"] = elem["ocr_blocks"]
    //     searchResults[elem._id]["video_meta"] = elem["video_meta"][0]
    //   }
    // })

    // console.log(JSON.stringify(searchResults))

    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      // props: { searchResults: JSON.stringify(searchResults) },
      props: { searchResults: JSON.stringify(results), searchT: searchType },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

type SearchPageProps = {
  searchResults: string,
  searchT: string,
  isConnected?: boolean
}

const SearchPage: NextPage<SearchPageProps> = ({ searchResults, searchT }) => {
  const [queryText, setQueryText] = useState("");
  const [searchType, setSearchType] = useState(searchT);
  const [handSelect, setHandSelect] = useState("");
  const [soundSelect, setSoundSelect] = useState("");
  const [annotationSpans, setAnnotationSpans] = useState<AnnotationSpans>(JSON.parse(searchResults));

  const playerRef: React.MutableRefObject<VideoJsPlayer> = React.useRef(null);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    preload: 'metadata',
    playbackRates: [0.5, 1, 1.5, 2],
    fluid: true,
    // sources: [{
    //   src: '',
    //   type: 'video/mp4'
    // }]
  };

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  let highlightText
  const router = useRouter();
  const getParams = router.query;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryText(event.target.value);
  }

  useEffect(() => {
    if (Array.isArray(getParams.query)) {
      let q = getParams.query.at(0) || ""
      highlightText = q
      setQueryText(q)
    } else {
      let q = getParams.query || ""
      highlightText = q
      setQueryText(q)
    }
    console.log(getParams)
    if (getParams.searchType) {
      setSearchType(getParams.searchType)
    }
  }, [])


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          MultiMoco NTU&nbsp;|&nbsp;台大多媒體語料庫
        </title>
      </Head>


      <section className="features-1"
        // style={{ overflow: "visible", minHeight: "100vh", overflowY: "scroll" }}>
        style={{ minHeight: "100vh", }}>
        {/* <Container className="mt-5" maxWidth="xl"> */}
        <Container maxWidth="xl">
          <form
            action="search" method="GET"
          >
            <Grid2
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  label="搜尋文字、聲音、手勢"
                  id="search"
                  type="text"
                  name="query"
                  value={queryText}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: <Button type="submit" variant="contained" disableElevation><SearchIcon /></Button> }}
                  required
                />
              </Grid2>
            </Grid2>
            <Grid2
              container
              spacing={1}
              justifyContent="left"
              alignItems="center"
            >
              <Grid2 xs={12} md={3}>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Search Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    name="searchType"
                  >
                    <FormControlLabel value="asr" control={<Radio />} label="ASR" />
                    <FormControlLabel value="ocr" control={<Radio />} label="OCR" />
                    <FormControlLabel value="blank" control={<Radio />} label="Blank" />
                  </RadioGroup>
                </FormControl>
              </Grid2>
              <Grid2 xs={6} sm={2} >
                <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
                  <InputLabel id="hand-select-label">手勢</InputLabel>
                  <Select
                    labelId="hand-select-label"
                    id="hand-select"
                    value={handSelect}
                    label="手勢"
                    onChange={(e) => setHandSelect(e.target.value)}
                    autoWidth
                  >
                    <MenuItem value="hand-moving">手揮動</MenuItem>
                    <MenuItem value="hand-palm-visible">手掌可見</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 xs={6} sm={2} >
                <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
                  <InputLabel id="sound-select-label">語音</InputLabel>
                  <Select
                    labelId="sound-select-label"
                    id="sound-select"
                    value={soundSelect}
                    label="語音"
                    onChange={(e) => setSoundSelect(e.target.value)}
                    autoWidth
                  >
                    <MenuItem value="sound-overlapping">語音重疊</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>
          </form>

          <Grid2
            container
            spacing={5}
          >
            <Grid2 mdOffset={2} xs={12} md={8} display="flex" justifyContent="center" alignContent="center">
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </Grid2>
            <Grid2 xs={12}>
              <CorpusResult
                annotationSpans={annotationSpans}
                setAnnotationSpans={setAnnotationSpans}
                player={playerRef}
                queryText={queryText}
                searchType={searchType}
              />
            </Grid2>
          </Grid2>
        </Container>
      </section>
    </>
  )
}

export default SearchPage;
