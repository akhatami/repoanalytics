import React from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';

import Home from './components/Home';
import Repository from "./components/Repository";
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById("root"));

root.render(
    <div className='container'>
        <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element= {<Home/>} />
                <Route path="/:user/:repo_name" element= {<Repository/>} />
            </Routes>
        </BrowserRouter>
        </React.StrictMode>
    </div>
);
