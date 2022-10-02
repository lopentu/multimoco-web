import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid';
import { fancyTimeFormat } from '../utils/utils';

import { AlignedUtt, OcrBlock, Results } from '../types/corpus'

const columns: GridColDef[] = [
  // { field: '_id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Video',
    width: 200,
  },
  {
    field: 'offset',
    headerName: 'Start',
    type: 'number',
    width: 70,
    valueFormatter: (params) => fancyTimeFormat(params.value)
  },
  {
    field: 'span',
    headerName: 'Duration (s)',
    type: 'number',
    width: 90,
    valueFormatter: (params) => fancyTimeFormat(params.value)
  },
  {
    field: 'text',
    headerName: 'Text',
    width: 500,
    // editable: true,
  },
  // {
  //   field: 'phones',
  //   headerName: 'Phones',
  //   width: 300,
  // },
  {
    field: 'notes',
    headerName: 'Notes',
    width: 300,
    // editable: true,
  },
];

export default function CorpusTable({ searchResults, searchType, player }) {
  const [pageSize, setPageSize] = React.useState<number>(25);
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        getRowId={(row) => row['_id']}
        rows={searchResults}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 25]}
        // checkboxSelection
        disableSelectionOnClick
        autoHeight
        density='compact'
        pagination
        // getRowHeight={() => "auto"}
        onRowClick={(params: GridRowParams) => {
          let url = `https://storage.googleapis.com/multimoco/selected/h264/${params.row.name}.mp4`
          console.log(url)
          if (url !== player.current.src()) {
            player.current.src({ type: 'video/mp4', src: url })
          }
          player.current.currentTime(params.row.offset / 1000)
        }}
      // experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}