import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input, Dropdown, Button, Spacer } from "@nextui-org/react";
import CorpusResult from '../components/corpus_results';
import clientPromise from '../lib/mongodb'

export async function getServerSideProps(context: any) {
  try {
    const client = await clientPromise
    const db = client.db("multimoco")

    const { query } = context
    console.log(query.query);
    const one = await db.collection("videos_meta").findOne();
    console.log(one);
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

const SearchPage: NextPage = () => {
  const [queryText, setQueryText] = useState("");
  const router = useRouter();
  const getParams = router.query;

  useEffect(() => {
    if (Array.isArray(getParams.query)) {
      setQueryText(getParams.query.at(0) || "")
    } else {
      setQueryText(getParams.query || "")
    }
  })


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
                  <Input
                    clearable underlined
                    className="mx-4"
                    size="lg"
                    initialValue={queryText}
                    placeholder="搜尋文字、聲音、手勢"
                    aria-label="search"
                    id="search"
                  />
                  <Spacer x={2} />
                  <Button id="searchButton"
                    css={{
                      fontSize: "1rem",
                      minWidth: "100px"
                    }}>搜尋</Button>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-8 d-flex justify-content-center" style={{ gap: "2rem" }}>
                  <Dropdown aria-label='hand-dropdown'>
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
                  </Dropdown>
                </div>
              </div>
            </div>

            <div className="row mt-4 justify-content-center">
              <div className="col-lg-8 justify-content-center">
                <CorpusResult />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default SearchPage;
