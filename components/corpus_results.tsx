import * as React from 'react';
// import { Table } from '@nextui-org/react';

export interface AlignedUtt {
    _id: string;
    name: string;
    offset: number;
    span: number;
    payload: { text: string }

}
interface CorpusResultProps {
    searchResults: string
}
export default function CorpusResult({ searchResults }: CorpusResultProps) {
    return (
        <>
            <div className="fs-2 text-muted">Search Result</div>
            {/* <Table
                id="results-table"
                aria-label="Search results table"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
            >
                <Table.Header id="table-header">
                    <Table.Column>Name</Table.Column>
                    <Table.Column>Offset</Table.Column>
                    <Table.Column>Span</Table.Column>
                    <Table.Column align="start">Text</Table.Column>
                </Table.Header>
                <Table.Body id="table-body">
                    {JSON.parse(searchResults).map((res: AlignedUtt) => (
                        <Table.Row key={res._id} id={res._id}>
                            <Table.Cell>{res.name}</Table.Cell>
                            <Table.Cell>{res.offset}</Table.Cell>
                            <Table.Cell>{res.span}</Table.Cell>
                            <Table.Cell>{res.payload.text.trim()}</Table.Cell>
                        </Table.Row>
                    )
                    )}
                </Table.Body>
            </Table> */}
        </>
    )
}