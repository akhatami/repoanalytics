import React, {useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
    TablePagination
} from '@mui/material';

const PullRequestTable = ({ data, handleCommitDetailsClick }) => {
    // Define pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Calculate the starting and ending indices for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Get a slice of the data for the current page
    const pageData = data.slice(startIndex, endIndex);

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateTimeToMerge = (createdAt, mergedAt) => {
        if (createdAt && mergedAt) {
            const createdAtDate = new Date(createdAt);
            const mergedAtDate = new Date(mergedAt);
            const timeDiff = mergedAtDate - createdAtDate;

            const hours = Math.floor(timeDiff / (60 * 60 * 1000));
            const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));

            return `${hours}h & ${minutes}min`;
        }

        return 'N/A';
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Merged At</TableCell>
                            <TableCell>Time to Merge</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Closed/Open</TableCell>
                            <TableCell>Participants</TableCell>
                            <TableCell>Comments</TableCell>
                            <TableCell>Reviews</TableCell>
                            <TableCell>Review Requests</TableCell>
                            <TableCell>Review Threads</TableCell>
                            <TableCell>Total Comments</TableCell>
                            <TableCell>Checks</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Changed Files</TableCell>
                            <TableCell>Additions</TableCell>
                            <TableCell>Deletions</TableCell>
                            <TableCell>Review Decision</TableCell>
                            <TableCell>Assignees</TableCell>
                            <TableCell>Commits</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Link href={row.url} target="_blank" rel="noopener noreferrer">
                                        {row.number}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatDate(row.createdAt)}</TableCell>
                                <TableCell>{row.mergedAt ? (formatDate(row.mergedAt)) : ('NOT MERGED')}</TableCell>
                                <TableCell>
                                    {calculateTimeToMerge(row.createdAt, row.mergedAt)}
                                </TableCell>
                                <TableCell>{row.state}</TableCell>
                                <TableCell>
                                    {row.closed ? 'CLOSED' : 'OPEN'}
                                </TableCell>
                                <TableCell>{row.participants.totalCount}</TableCell>
                                <TableCell>{row.comments.totalCount}</TableCell>
                                <TableCell>{row.reviews.totalCount}</TableCell>
                                <TableCell>{row.reviewRequests.totalCount}</TableCell>
                                <TableCell>{row.reviewThreads.totalCount}</TableCell>
                                <TableCell>{row.totalCommentsCount}</TableCell>
                                <TableCell>
                                    <Link href={row.checksUrl} target="_blank" rel="noopener noreferrer">
                                        URL
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {row.author ? (
                                        <span>
                                        {row.author.hasOwnProperty('name') ? 'User' : 'Bot'} (
                                        <a
                                            href={`https://github.com/${row.author.hasOwnProperty('name') ? '' : 'apps/'}${row.author.login}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                          {row.author.login}
                                        </a>
                                        )
                                        </span>
                                    ) : (
                                     'No Author'
                                    )}
                                </TableCell>
                                <TableCell>{row.changedFiles}</TableCell>
                                <TableCell>{row.additions}</TableCell>
                                <TableCell>{row.deletions}</TableCell>
                                <TableCell>{row.reviewDecision ? (row.reviewDecision) : ('Not Used')}</TableCell>
                                <TableCell>{row.assignees.totalCount}</TableCell>
                                <TableCell>
                                    <Link
                                        href="#"
                                        onClick={() => handleCommitDetailsClick(row.number)}>
                                    {row.commits.totalCount}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default PullRequestTable;
