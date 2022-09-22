import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Highlighter from "react-highlight-words";
import { VideoJsPlayer } from 'video.js';

export interface AlignedUtt {
  _id: string
  name: string
  offset: number
  span: number
  payload: { text: string, speaker?: string }
}

export interface OcrBlock {
  _id: string
  name: string
  offset: number
  span: number
  payload: {
    text: string
    box: {
      type: string
      coordinates: Array<Array<Array<number>>>
    }

  }
}
export interface SearchResults {
  [key: string]: {
    aligned_utt?: AlignedUtt[]
    ocr_blocks?: OcrBlock[]
  }
}
interface CorpusResultProps {
  highlightText: string
  searchResults: string
  player: React.MutableRefObject<VideoJsPlayer>
}

function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function Row(props: { row: { aligned_utt?: AlignedUtt[], ocr_blocks?: OcrBlock[] }, name: string, player: React.MutableRefObject<VideoJsPlayer>, index: number }) {
  const { name, row, player, index } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        onClick={() => setOpen(!open)}
        sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{index}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {row.aligned_utt &&
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  ASR
                </Typography>
                <Table size="small" aria-label="asr">
                  <TableHead>
                    <TableRow
                    >
                      <TableCell align="right">Start Time</TableCell>
                      <TableCell align="right">Duration</TableCell>
                      <TableCell align="left">Text</TableCell>
                      <TableCell align="left">Speaker</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.aligned_utt.map((uttRow: AlignedUtt) => (
                      <TableRow key={uttRow._id}
                        onClick={() => {
                          let url = `https://storage.googleapis.com/multimoco/selected/h264/${uttRow.name}.mp4`
                          console.log(url)
                          if (url !== player.current.src()) {
                            player.current.src({ type: 'video/mp4', src: url })
                          }
                          player.current.currentTime(uttRow.offset / 1000)
                        }}
                      >
                        <TableCell component="th" scope="row" align="right" sx={{ width: 1 / 10 }}>
                          {fancyTimeFormat(uttRow.offset / 1000)}
                        </TableCell>
                        <TableCell align="right" sx={{ width: 1 / 10 }}>{fancyTimeFormat(uttRow.span / 1000)}</TableCell>
                        <TableCell align="left" sx={{ width: 7 / 10 }}>{uttRow.payload.text}</TableCell>
                        <TableCell align="left" sx={{ width: 1 / 10 }}>{uttRow.payload.speaker}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            }
            {row.ocr_blocks &&
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  OCR
                </Typography>
                <Table size="small" aria-label="ocr">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right" sx={{ width: 1 / 10 }}>Start Time</TableCell>
                      <TableCell align="right" sx={{ width: 1 / 10 }}>Duration</TableCell>
                      <TableCell align="left" sx={{ width: 8 / 10 }}>Text</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.ocr_blocks.map((ocrRow) => (
                      <TableRow key={ocrRow._id}
                        onClick={() => {
                          let url = `https://storage.googleapis.com/multimoco/selected/h264/${ocrRow.name}.mp4`
                          console.log(url)
                          if (url !== player.current.src()) {
                            player.current.src({ type: 'video/mp4', src: url })
                          }
                          player.current.currentTime(ocrRow.offset / 1000)
                        }}
                      >
                        <TableCell component="th" scope="row" align="right">
                          {fancyTimeFormat(ocrRow.offset / 1000)}
                        </TableCell>
                        <TableCell align="right">{fancyTimeFormat(ocrRow.span / 1000)}</TableCell>
                        <TableCell align="left">{ocrRow.payload.text}</TableCell>
                        <TableCell />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            }
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CorpusResult({ highlightText, searchResults, player }: CorpusResultProps) {
  const rows: SearchResults = JSON.parse(searchResults);
  console.log(`Hightlight: ${highlightText}`);

  return (
    <>
      <div className="fs-2 text-muted">Search Results</div>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell colSpan={4}>Name</TableCell>
              {/* <TableCell align="right">Offset</TableCell>
              <TableCell align="right">Span</TableCell>
              <TableCell align="left">Text</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(rows).map(([key, row], index) => (
              <Row
                key={key}
                index={index + 1}
                name={key}
                row={row}
                player={player}
              // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>

    // <>
    //   <div className="fs-2 text-muted">Search Results</div>
    //   <TableContainer>
    //     <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    //       <TableHead>
    //         <TableRow>
    //           <TableCell>Name</TableCell>
    //           <TableCell align="right">Offset</TableCell>
    //           <TableCell align="right">Span</TableCell>
    //           <TableCell align="left">Text</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {Object.entries(rows).map(([key, row]) => (
    //           <TableRow
    //             key={row._id}
    //             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    //             onClick={() => {
    //               let url = `https://storage.googleapis.com/multimoco/selected/h264/${row.name}.mp4`
    //               console.log(url)
    //               if (url !== player.current.src()) {
    //                 player.current.src({ type: 'video/mp4', src: url })
    //               }
    //               player.current.currentTime(row.offset / 1000)
    //             }}
    //           >
    //             <TableCell component="th" scope="row">
    //               {row.name}
    //             </TableCell>
    //             <TableCell align="right">{row.offset}</TableCell>
    //             <TableCell align="right">{row.span}</TableCell>
    //             <TableCell align="left" className="context">
    //               {row.payload.text}
    //               {/* <Highlighter
    //                                     highlightClassName="highlighted"
    //                                     searchWords={[highlightText]}
    //                                     autoEscape={true}
    //                                     textToHighlight={row.payload.text}
    //                                 /> */}
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </>
  )
}