import { VideoJsPlayer } from 'video.js';
import { CorpusResultProps, SearchResults } from '../types/corpus';
import CorpusTable from './corpus_table';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider';
import { useState } from 'react';

export default function CorpusResult({ highlightText, results, setResults, player, queryText }: CorpusResultProps) {
  // setResults(JSON.parse(searchResults));
  console.log("Inside corpus result")
  // console.log(results)
  // console.log(`Hightlight: ${highlightText}`);

  function buildCsv(data) {
    // console.log(data);
    let header = [...Object.keys(data[0]), "notes"].join(',') + "\n";
    let rows = data.map(d => [...Object.values(d), ""]
      .map(String)
      .map(v => v.replaceAll('"', '""'))
      .map(v => `"${v}"`)
      .join(',')
    ).join('\n')
    // let rows = data.map(row => 
    //   row
    //   .map(Object.values)

    let csv = header + rows
    return csv

  }

  function downloadBlob(content, filename, contentType) {
    let blob = new Blob([content], { type: contentType });
    let url = URL.createObjectURL(blob);

    let pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }

  function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter).map(v => v.trim());
    const rows = str.slice(str.indexOf("\n") + 1).split(/\r?\n|\r|\n/);

    const arr =  rows.map((row) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
    return arr;
  }

  return (
    <>
      <div className="fs-2 text-muted">Search Results</div>
      <Stack direction="row"
        spacing={2}
        justifyContent="flex-end"
      // divider={<Divider orientation="vertical" flexItem />}
      >
        <Button
          onClick={() => downloadBlob(buildCsv(results.results), `multimoco-${queryText}-${results.searchType}.csv`, 'text/csv;charset=utf8-8;')}
          startIcon={<FileDownloadRoundedIcon
            color="primary"
            fontSize='large'
          ></FileDownloadRoundedIcon>}>Download</Button>
        <Button startIcon={<FileUploadRoundedIcon color="primary" fontSize='large' />} component="label">
          Upload
          {/* <form id="csvUpload"> */}
            <input 
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = function (e) {
                const text = e.target?.result;
                const data = csvToArray(text)
                console.log("Uploaded!")
                console.log(data)
                setResults({
                  ...results,
                  results: data
                });
                // console.log(data)
              }
              // console.log(e.target.files[0])
              reader.readAsText(e.target.files![0])
              e.target.value = "";
            }} 
            hidden 
            type="file" 
            id="csvFile" 
            accept=".csv" />
          {/* </form> */}
        </Button>
      </Stack>
      <CorpusTable
        searchResults={results.results}
        searchType={results.searchType}
        player={player}
      />
    </>

  )
}