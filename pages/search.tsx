import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input, Dropdown, Spacer } from "@nextui-org/react";
import { TextField, Button, Select, InputLabel, FormControl, MenuItem, Container } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import CorpusResult, { AlignedUtt } from '../components/corpus_results';
import clientPromise from '../lib/mongodb'
import SearchIcon from '@mui/icons-material/Search';
import Searchbar from '../components/navbar';

export async function getServerSideProps(context: any) {
  try {
    const client = await clientPromise
    const db = client.db("multimoco")

    const { query } = context
    console.log(query.query);
    // const searchResults = await db.collection("aligned_utt").find({ "payload.text": { $regex: `${query}`, $options: "i"} }).limit(2).toArray();
    const searchResults = await db.collection("aligned_utt").find({ "payload.text": new RegExp(query.query, "i") }).limit(50).toArray();
    console.log(searchResults);

    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { searchResults: JSON.stringify(searchResults) },
      // props: { searchResults: searchResults },
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
  isConnected?: boolean
}

const SearchPage: NextPage<SearchPageProps> = ({ searchResults }) => {
  const [queryText, setQueryText] = useState("");
  const [handSelect, setHandSelect] = useState("");
  const [soundSelect, setSoundSelect] = useState("");
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
  }, [])


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          MultiMoco NTU&nbsp;|&nbsp;台大多媒體語料庫
        </title>
      </Head>


      <Searchbar />
      <section className="features-1"
        // style={{ overflow: "visible", minHeight: "100vh", overflowY: "scroll" }}>
        style={{ minHeight: "100vh", }}>
        <Container className="mt-5" maxWidth="xl">
          {/* <div className="container"> */}
          {/* <div className="row mb-2 align-items-center justify-content-center">
            <div className="col-lg-6"> */}

          {/* </div>
          </div> */}

          {/* <div className="container"> */}
          {/* <div className="row justify-content-center align-items-center"> */}
          {/* <div className="col-8">
                <div className="d-flex justify-content-center mb-3"> */}
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
                  InputProps={{endAdornment: <Button variant="contained" disableElevation><SearchIcon/></Button>}}
                  required
                />
              </Grid2>
              {/* <Grid2 xs={4}>
                <Button size="large" variant="outlined">搜尋</Button>
              </Grid2> */}
            </Grid2>
          </form>
          <Grid2
            container
            spacing={0.5}
            justifyContent="left"
            alignItems="center"
          >
            <Grid2 lg={1}>
              <FormControl sx={{ minWidth: 120 }} size="small">
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
            <Grid2 lg={1}>

              <FormControl sx={{m: 1, minWidth: 120 }} size="small">
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
            {/* <Dropdown aria-label='hand-dropdown'>
                      <Dropdown.Button id='hand-label' flat>手勢</Dropdown.Button>
                      <Dropdown.Menu aria-label="Static Actions">
                        <Dropdown.Item aria-label='hands-moving' key="hands-moving">手揮動</Dropdown.Item>
                        <Dropdown.Item aria-label='hands-palm-visible' key="hands-palm-visible">手掌可見</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown aria-label='sound-dropdown'>
                      <Dropdown.Button id='sound-label' flat>語音</Dropdown.Button>
                      <Dropdown.Menu aria-label="Sound">
                        <Dropdown.Item key="sound-overlapping">語音重疊</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
          </Grid2>
          {/* </div>
              </div> */}
          {/* </div> */}

          <div className="row mt-4 justify-content-center">
            <div className="col-lg-8 justify-content-center">
              <CorpusResult highlightText={highlightText} searchResults={searchResults} />
            </div>
          </div>
          {/* </div> */}

          {/* </div> */}

        </Container>

      </section>
    </>
  )
}

export default SearchPage;
