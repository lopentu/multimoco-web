import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input, Dropdown, Spacer } from "@nextui-org/react";
import { TextField, Button, Grid, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import CorpusResult, { AlignedUtt } from '../components/corpus_results';
import clientPromise from '../lib/mongodb'

export async function getServerSideProps(context: any) {
  try {
    const client = await clientPromise
    const db = client.db("multimoco")

    const { query } = context
    console.log(query.query);
    // const searchResults = await db.collection("aligned_utt").find({ "payload.text": { $regex: `${query}`, $options: "i"} }).limit(2).toArray();
    const searchResults = await db.collection("aligned_utt").find({"payload.text": new RegExp(query.query, "i")}).limit(2).toArray();
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
  const router = useRouter();
  const getParams = router.query;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryText(event.target.value);
  }

  useEffect(() => {
    if (Array.isArray(getParams.query)) {
      setQueryText(getParams.query.at(0) || "")
    } else {
      setQueryText(getParams.query || "")
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
        style={{ overflow: "visible", minHeight: "100vh" }}>

        <div className="container">
          <div className="row mb-2 align-items-center justify-content-center">
            <div className="col-lg-6">
              <h2 className="font-weight-bold text-primary heading">
                MultiMoco
              </h2>
            </div>
          </div>

          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-8">
                <div className="d-flex justify-content-center mb-3">
                  <form
                    action="search" method="GET"
                  >
                    <Grid
                      container
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          label="搜尋文字、聲音、手勢"
                          id="search"
                          type="text"
                          name="query"
                          value={queryText}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Button size="large" variant="contained">搜尋</Button>
                      </Grid>
                      {/* <Spacer x={2} /> */}
                      {/* <Button id="searchButton"
                      css={{
                        fontSize: "1rem",
                        minWidth: "100px"
                      }}>搜尋</Button> */}
                    </Grid>
                  </form>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-8 d-flex justify-content-center" style={{ gap: "2rem" }}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={5}>
                      <FormControl fullWidth>
                        <InputLabel id="hand-select-label">手勢</InputLabel>
                        <Select
                          labelId="hand-select-label"
                          id="hand-select"
                          value={handSelect}
                          label="手勢"
                          onChange={(e) => setHandSelect(e.target.value)}
                        >
                          <MenuItem value="hand-moving">手揮動</MenuItem>
                          <MenuItem value="hand-palm-visible">手掌可見</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={5}>

                      <FormControl fullWidth>
                        <InputLabel id="sound-select-label">語音</InputLabel>
                        <Select
                          labelId="sound-select-label"
                          id="sound-select"
                          value={soundSelect}
                          label="語音"
                          onChange={(e) => setSoundSelect(e.target.value)}
                        >
                          <MenuItem value="sound-overlapping">語音重疊</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
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
                  </Grid>
                </div>
              </div>
            </div>

            <div className="row mt-4 justify-content-center">
              <div className="col-lg-8 justify-content-center">
                <CorpusResult searchResults={searchResults} />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default SearchPage;
