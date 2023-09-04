import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

// import Pagination from "./Pagination";
import {List, ListItemButton, ListItemText, Pagination} from "@mui/material";

function RepositoryList() {

    const [repositories, setRepositories] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const getRepositories = useCallback(async () => {
        return axios.get('/api/repositories', {
            params: {page, perPage}
        }).then(response => {
            console.log(page, perPage);
            return response;
        })
            .catch(error => {
                console.error(error);
                return []; // return empty array on error
            });
    }, [page, perPage]);


    useEffect(() => {
        getRepositories()
            .then(response => {
                setRepositories(response.data.repositories);
                setTotalCount(response.data.repositoriesTotal);
            })
            .catch(error => {
                console.error(error);
                setRepositories([]); // set empty state on error
                setTotalCount(null);
            });
    }, [getRepositories]);

    const handlePageChange = (event, page) => {
        setPage(page);
    }

    return (
        <>
            <List>
                {repositories.map(repo => (
                    <ListItemButton key={repo._id} button component="a" href={`/${repo.name}`}>
                        <ListItemText primary={repo.name} />
                    </ListItemButton>
                ))}
            </List>
            <Pagination
                count={Math.ceil(totalCount / perPage)}
                page={page}
                perPage={perPage}
                variant="outlined"
                color="primary"
                onChange={handlePageChange}
            />
        </>
    );
}

export default RepositoryList;