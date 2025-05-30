// src/App.jsx
import React from "react";
import Sidebar from "./components/sidebar";
import Header from "./components/Header";
import Slider from "./components/Slider";
import "./Dashboard.css";

const App = () => {
    return (
        <div className="container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <Slider />
            </div>
        </div>
    );
};

export default App;
