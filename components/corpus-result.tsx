import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { AnnotationSpans, CorpusResultProps } from '../types/corpus';
import { flattenObject } from '../utils/utils';
import CorpusTable from './corpus-table';


export default function CorpusResult(props: CorpusResultProps) {
  const { annotationSpans, setAnnotationSpans,
    queryText, searchType, setQueryText, setSearchType,
    onSelectedSpanChanged, speaker, setSpeaker, cosp, setCosp, searchCollection, setSearchCollection } = props;

  // downloads search results to user's computer
  function downloadBlob(content: string, filename: string, contentType: string) {
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
      .concat(['query_text', 'search_type'])
      // .concat(['query_text', 'search_type', 'gesture_speaker', 'collection', 'gesture_select'])
    console.log("H", h)

    let header: string[] = h.filter(item => !leaveOut.includes(item));
    console.log(header)

    let rows = flattenedData.map(d => {
      let row: any[] = []
      d['query_text'] = queryText;
      d['search_type'] = searchType;
      d['collection'] = searchCollection;
      d['gesture_speaker'] = speaker;
      d['gesture_select'] = cosp
      // header.forEach((head) => d[head] ? row.push(String(d[head]).replace(/(.*)/, '"$1"')) : row.push("na"))
      header.forEach((head) => d[head] ? row.push(String(d[head]).replace(/,/g, '||')) : row.push("na"))


      return row.join(',')
    });

    console.log("To be saved:")
    console.log(rows.slice(0, 5))

    let csv = '\ufeff' + header.join(',') + "\n" + rows.join('\n')  // informs programs that the file is UTF-8 encoded
    return csv

  }

  // converts uploaded CSV file into an array to display in table
  function csvToArray(str: string, delimiter = ","): AnnotationSpans {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter).map(v => v.trim());
    const rows = str.slice(str.indexOf("\n") + 1).split(/\r?\n|\r|\n/);
    const numericFields = ['offset', 'span', 'duration', 'start', 'end']
    const arrayFields = ['gesture_select', 'cosp']

    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, header, index) => {
        let value = values[index]
        if (value !== 'na') {
          if (numericFields.includes(header)) value = Number(value);
          if (arrayFields.includes(header)) value = value.split(',')
        } else {
          value = "";
        }
        object[header] = value;
        return object;
      }, {});
      return el;
    });
    setQueryText(arr[0].query_text);
    setSearchType(arr[0].search_type);
    // setSearchCollection(arr[0].collection);
    // setCosp(arr[0].gesture_select);
    // setSpeaker(arr[0].gesture_speaker)
    console.log(arr)
    return arr;
  }

  return (
    <>
      <div className="fs-2 text-muted">Search Results</div>
      <Stack direction="row"
        spacing={2}
        justifyContent="flex-end"
      >
        <Button
          onClick={() => downloadBlob(buildCsv(annotationSpans), `multimoco-${queryText}-${searchType}.csv`, 'text/csv;charset=UTF-8;')}
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
                const text = e.target?.result as string;
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
        onSelectedSpanChanged={onSelectedSpanChanged}
      />
    </>

  )
}