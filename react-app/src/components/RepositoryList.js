import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

import Pagination from "./Pagination";

function RepositoryList() {

    const [repositories, setRepositories] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [page, setPage] = useState(1);
    const perPage = 10;

    const getRepositories = useCallback(async () => {
        return axios.get('/api/repositories', {
            params: {page, perPage}
        }).then(response => {
            console.log(response.data);
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

    const handlePageChange = (page) => {
        setPage(page);
    }

    return (
        <>
            <ul>
                {repositories.map(repo => (
                    <li key={repo._id}>
                        <a href={"/"+repo.name}>{repo.name}</a>
                    </li>
                ))}
            </ul>
            <Pagination
                total={totalCount}
                page={page}
                perPage={perPage}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default RepositoryList;