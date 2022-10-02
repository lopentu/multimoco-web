import { VideoJsPlayer } from 'video.js';
import { CorpusResultProps, SearchResults } from '../types/corpus';
import CorpusTable from './corpus_table';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider';

export default function CorpusResult({ highlightText, searchResults, player }: CorpusResultProps) {
  const sr: SearchResults = JSON.parse(searchResults);
  console.log("Inside corpus result")
  console.log(sr)
  // console.log(`Hightlight: ${highlightText}`);

  return (
    <>
      <div className="fs-2 text-muted">Search Results</div>
      <Stack direction="row"
        spacing={2}
        justifyContent="flex-end"
        // divider={<Divider orientation="vertical" flexItem />}
      >
        <Button startIcon={<FileDownloadRoundedIcon color="primary" fontSize='large' />}>Download</Button>
        <Divider light />
        <Button startIcon={<FileUploadRoundedIcon color="primary" fontSize='large' />}>Upload</Button>
      </Stack>
      <CorpusTable
        searchResults={sr.results}
        searchType={sr.searchType}
        player={player}
      />
    </>

  )
}