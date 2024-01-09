import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';


const CommitTable = ({ data }) => {

    return (
        <>
            <Typography>Total number of commits: {data[0].commits_count}</Typography>
            <br/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Commit</TableCell>
                            <TableCell>Commit Message</TableCell>
                            <TableCell>Status Check Rollup State</TableCell>
                            <TableCell>Total Checks</TableCell>
                            {/*<TableCell>Check Run Count</TableCell>*/}
                            {/*<TableCell>Status Count</TableCell>*/}
                            {/*<TableCell>Context Name (check)</TableCell>*/}
                            {/*<TableCell>Context Name (status)</TableCell>*/}
                            {/*<TableCell>Context Conclusion</TableCell>*/}
                            {/*<TableCell>Context Status</TableCell>*/}
                            {/*<TableCell>Context App</TableCell>*/}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            // row.contexts.map((context_details) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <a href={row.commits_url} target="_blank" rel="noopener noreferrer">
                                        {row.commit_oid}
                                    </a>
                                </TableCell>
                                <TableCell>{row.commit_message}</TableCell>
                                <TableCell>{row.status_check_rollup_state}</TableCell>
                                <TableCell>{row.contexts_total_count}</TableCell>
                                {/*<TableCell>{row.contexts_checkRun_count}</TableCell>*/}
                                {/*<TableCell>{row.contexts_total_count - row.contexts_checkRun_count}</TableCell>*/}
                                {/*<TableCell>{context_details.name}</TableCell>*/}
                                {/*<TableCell>{context_details.context}</TableCell>*/}
                                {/*<TableCell>{context_details.context}</TableCell>*/}
                                {/*<TableCell>{context_details.context}</TableCell>*/}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default CommitTable;
