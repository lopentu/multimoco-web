import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input, Dropdown, Button, Spacer } from "@nextui-org/react";
import CorpusResult from '../components/corpus_results';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const get_params = router.query || {};  
  let query_text = get_params.query || ""
  if (Array.isArray(query_text)){
    query_text = query_text.at(0) || "";
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
        style={{overflow: "visible", minHeight: "100vh"}}>
          
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
                    initialValue={query_text}
                    placeholder="搜尋文字、聲音、手勢"
                  />
                  <Spacer x={2}/>
                  <Button                              
                    css={{                      
                      fontSize: "1rem",
                      minWidth: "100px"
                    }}>搜尋</Button>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-8 d-flex justify-content-center" style={{gap: "2rem"}}>
                  <Dropdown>
                    <Dropdown.Button flat>手勢</Dropdown.Button>
                    <Dropdown.Menu aria-label="Static Actions">
                      <Dropdown.Item key="hands-moving">手揮動</Dropdown.Item>
                      <Dropdown.Item key="hands-moving">手掌可見</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown>
                    <Dropdown.Button flat>語音</Dropdown.Button>
                    <Dropdown.Menu aria-label="Static Actions">
                      <Dropdown.Item key="hands-moving">語音重疊</Dropdown.Item>                      
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            
            <div className="row mt-4 justify-content-center">
              <div className="col-lg-8 justify-content-center">
                <CorpusResult/>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default SearchPage;
