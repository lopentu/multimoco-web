import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Highlighter from "react-highlight-words";
export interface AlignedUtt {
    _id: string;
    name: string;
    offset: number;
    span: number;
    payload: { text: string }

}
interface CorpusResultProps {
    highlightText: string
    searchResults: string
}

export default function CorpusResult({ highlightText, searchResults }: CorpusResultProps) {
    const rows = JSON.parse(searchResults);
    console.log(`Hightlight: ${highlightText}`);

    return (
        <>
            <div className="fs-2 text-muted">Search Results</div>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Offset</TableCell>
                            <TableCell align="right">Span</TableCell>
                            <TableCell align="left">Text</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: AlignedUtt) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.offset}</TableCell>
                                <TableCell align="right">{row.span}</TableCell>
                                <TableCell align="left" className="context">
                                    <Highlighter
                                    highlightClassName="highlighted"
                                    searchWords={[highlightText]}
                                    autoEscape={true}
                                    textToHighlight={row.payload.text}
                                    />
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}