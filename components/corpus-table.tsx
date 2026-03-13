import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { AnnotationSpan, AnnotationSpans } from '../types/corpus';
import { fancyTimeFormat } from '../utils/utils';
import Chip from '@mui/material/Chip';

function highlightText(text: string, query: string) {
  if (!query) return <>{text}</>
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return <>
    {parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ backgroundColor: '#fff176', padding: 0 }}>{part}</mark>
        : part
    )}
  </>
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function formatVideoMeta(meta: AnnotationSpan) {
  let mapping: Partial<Record<keyof AnnotationSpan, string>>

  if (meta.video_type === 'news') {
    mapping = {
      channel: 'Channel',
      datetime: 'Date',
    }
  } else if (meta.video_type === 'legvid') {
    mapping = {
      channel: 'Channel',
      datetime: 'Date',
      legislator: 'Legislator',
      meeting_committee: 'Meeting Committee',
      // meeting_header: 'Meeting Header',
      // meeting_name: 'Meeting Name',
    }
  }
  if (!mapping!) {
    mapping = {
      channel: 'Channel',
      datetime: 'Date',
    }
  }
  return <>
    {Object.entries(mapping!).map(([k, v]) => {
      return <React.Fragment key={`${(Math.random() + 1).toString(36).substring(8)}`}>
        <Typography variant="overline" display="block">
          {v}
        </Typography>
        <Typography variant="button" display="block">
          <strong>{(meta[(k as keyof AnnotationSpan)] as string)}</strong>
        </Typography>
      </React.Fragment>
    })}
    {meta.name.includes('news-') &&
  <>
    <Typography variant="overline" display="block">
      Language
    </Typography>
    <Typography variant="button" display="block">
      <strong>{meta.name.match(/news-([^-]+)-/)?.[1]}</strong>
    </Typography>
  </>
}
    <Typography variant="overline" display="block">
      Name
    </Typography>
    <Typography variant="button" display="block">
      {meta.name}
    </Typography>
  </>
}

interface ICorpusTable {
  annotationSpans: AnnotationSpans
  searchType: string
  onSelectedSpanChanged(arg0: string, arg1: number): void
  cosp: string[]
  setCosp: React.Dispatch<React.SetStateAction<string[]>>
  queryText: string
}

export default function CorpusTable({ annotationSpans, searchType, onSelectedSpanChanged, cosp, setCosp, queryText }: ICorpusTable) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortByDate, setSortByDate] = React.useState<'asc' | 'desc' | null>(null);
  let groupedAnnotationSpans = Array.from(annotationSpans.reduce(
    (entryMap, e) => entryMap.set(e.name, [...entryMap.get(e.name) || [], e]),
    new Map()
  ).values());

  if (sortByDate) {
    groupedAnnotationSpans = groupedAnnotationSpans.sort((a, b) => {
      const dateA = new Date(a[0].datetime).getTime();
      const dateB = new Date(b[0].datetime).getTime();
      return sortByDate === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groupedAnnotationSpans.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size="small">
        <TableHead>
          <TableRow>
           <TableCell align="left">
              Info
              <IconButton size="small" onClick={() => {
                setSortByDate(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
              }}>
                {sortByDate === 'asc' ? '↑' : sortByDate === 'desc' ? '↓' : '↕'}
              </IconButton>
            </TableCell>
            <TableCell align="left">
              Text
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? groupedAnnotationSpans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : groupedAnnotationSpans
          )
            .map(function (group: AnnotationSpans, groupIndex, groupArray) {
              return group.map(function (row, rowIndex, rowArray) {
                return (
                  <TableRow key={`${(Math.random() + 1).toString(36).substring(8)}`}>
                    {(rowIndex === 0) &&

                      <TableCell sx={{ width: 200 }} component="th" scope="row" rowSpan={group.length} >
                        {formatVideoMeta(row)}
                      </TableCell>
                    }
                    <TableCell align="left" >
                      <Link
                        color="primary"
                        onClick={() => {
                          let url = `https://storage.googleapis.com/multimoco/selected/h264/${row.name}.mp4`
                          onSelectedSpanChanged(url, row.offset / 1000);
                        }}
                      >[{fancyTimeFormat(row.offset)}]</Link>&nbsp;
                      {
                        row.annotation ?
  highlightText(`<${row.annotation}>${row.text}`, queryText) :
  highlightText(row.text, queryText)
                      }
                      {row.cosp && row.cosp.length > 0 &&
                      <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(row.cosp as string[]).slice(0, 8).map((g) => (
                        <Chip
                          key={g}
                          label={g}
                          size="small"
                          variant={cosp.includes(g.replace(/^SP[12]_/, '')) ? 'filled' : 'outlined'}
                          color={g.startsWith('SP1') ? 'primary' : 'secondary'}
                          onClick={() => {
                          const label = g.replace(/^SP[12]_/, '');
                          if (cosp.includes(label)) {
                            setCosp(cosp.filter(c => c !== label));
                          } else {
                            setCosp([...cosp, label]);
                          }
                        }}
                          sx={{ cursor: 'pointer' }}
                        />
                        ))}
                        {row.cosp.length > 8 &&
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`+${row.cosp.length - 8}`}
                          />
                        }
                      </Box>
                    }
                    </TableCell>
                  </TableRow>
                )
              })
            })
          }
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={groupedAnnotationSpans.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}