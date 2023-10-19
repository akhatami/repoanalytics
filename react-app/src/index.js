import React from 'react';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import 'admin-lte/dist/css/adminlte.css';
import 'admin-lte/dist/js/adminlte.js';
import {createRoot} from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
);
