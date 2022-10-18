import { AnnotationSpans, CorpusResultProps, SearchResults } from '../types/corpus';
import CorpusTable from './corpus_table';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import { useState } from 'react';
import { flattenObject } from '../utils/utils';


export default function CorpusResult(props: CorpusResultProps) {
  const { annotationSpans, setAnnotationSpans,
    player, queryText, searchType,
    onSelectedSpanChanged } = props;

  function downloadBlob(content, filename, contentType) {
    let blob = new Blob([content], { type: contentType });
    let url = URL.createObjectURL(blob);

    let pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }

  function buildCsv(data: AnnotationSpans) {
    let flattenedData = data.map(flattenObject);
    let leaveOut = ['clip_lowres_link', 'clip_highres_link', 'video_id', 'filename']
    let h = Array.from(new Set(flattenedData.map(d => Object.keys(d)).flat()))
    console.log(h)

    let header: string[] = h.filter(item => !leaveOut.includes(item));
    console.log(header)

    let rows = flattenedData.map(d => {
      let row: any[] = []
      header.forEach((head) => d[head] ?
        row.push(d[head])
        : row.push("na"))

      return row.join(',')
    });

    console.log(rows.slice(0, 5))

    let csv = '\ufeff' + header.join(',') + "\n" + rows.join('\n')
    return csv

  }

  function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter).map(v => v.trim());
    const rows = str.slice(str.indexOf("\n") + 1).split(/\r?\n|\r|\n/);
    const numericFields = ['offset', 'span', 'duration', 'start', 'end']

    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, header, index) => {
        let value = values[index]
        if (value !== 'na') {
          if (numericFields.includes(header)) {
            value = Number(value);
          }
        } else {
          value = "";
        }
        object[header] = value;
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
          onClick={() => downloadBlob(buildCsv(annotationSpans), `multimoco-${queryText}-${searchType}.csv`, 'text/csv;charset=utf8-8;')}
          startIcon={<FileDownloadRoundedIcon
            color="primary"
            fontSize='large'
          ></FileDownloadRoundedIcon>}>Download</Button>
        <Button startIcon={<FileUploadRoundedIcon color="primary" fontSize='large' />} component="label">
          Upload
          <input
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = function (e) {
                const text = e.target?.result;
                const data = csvToArray(text)
                console.log(data)
                setAnnotationSpans(data);
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
        annotationSpans={annotationSpans}
        searchType={searchType}
        player={player}
        onSelectedSpanChanged={onSelectedSpanChanged}
      />
    </>

  )
}