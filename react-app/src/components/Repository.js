import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom'

function Repository() {
    const { user, repo_name } = useParams();
    const [repo, setRepo] = useState(null);

    useEffect(() => {
        async function fetchRepoDetails() {
            try {
                return await axios.get(`/api/repo/${user}/${repo_name}`);
            } catch (error) {
                console.error('Error fetching repo details:', error);
                return null;
            }
        }

        fetchRepoDetails()
            .then(response => {
                console.log('data ' + JSON.stringify(response.data));
                if(!response){
                    setRepo(null);
                }
                setRepo(response.data);
        })
            .catch(error => {
                console.error(error);
                setRepo([]); // set empty state on error
            });

    }, [user, repo_name]);

    return (
        <>
            <Link to='/'>Repositories</Link>
            <h1>Repository name is: {user+'/'+repo_name}</h1>
            {repo ? (
                Object.keys(repo).length !== 0 ? (
                    <div>
                        <h3>Name: {repo.name}</h3>
                        <p>Language: {repo.language}</p>
                        <p>Default Branch: {repo.default_branch}</p>
                        <p>Has Codecov: {repo.has_codecov ? 'Yes' : 'No'}</p>
                        <p>Has Coveralls: {repo.has_coveralls ? 'Yes' : 'No'}</p>
                        <p>Has Codeclimate: {repo.has_codeclimate ? 'Yes' : 'No'}</p>
                        <p>Created At: {new Date(repo.created_at * 1000).toLocaleString()}</p>
                        <p>Updated At: {new Date(repo.updated_at * 1000).toLocaleString()}</p>
                    </div>
                ) : (
                    <p>Repo not found.</p>
                )
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default Repository;