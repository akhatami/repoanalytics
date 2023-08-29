import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Repository from "./components/Repository";

ReactDOM.render(
            <div className='container'>
                <Routes>
                    <Route exact path="/" element= {<Home/>} />
                    <Route path="/repo/:id" element= {<Repository/>} />
                </Routes>
            </div>
    , document.getElementById('root'));