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
import { fancyTimeFormat } from '../utils/utils';

import { AlignedUtt, OcrBlock, VideoMeta } from '../types/corpus';

export default function Row(props: { row: { aligned_utt?: AlignedUtt[], ocr_blocks?: OcrBlock[], video_meta: VideoMeta }, name: string, player: React.MutableRefObject<VideoJsPlayer>, index: number }) {
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
        {/* <TableCell></TableCell> */}
        <TableCell component="th" scope="row" align="center">
          {row.video_meta.name}
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
                      <TableCell align="right" sx={{ width: 2 / 10 }}>Duration</TableCell>
                      <TableCell align="left" sx={{ width: 7 / 10 }}>Text</TableCell>
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