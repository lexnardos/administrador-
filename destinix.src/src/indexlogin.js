import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./login";
import "bootstrap/dist/css/bootstrap.min.css";
import "sweetalert2/dist/sweetalert2.min.css";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
        <Login />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("rootlogin")
);