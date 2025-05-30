// src/pages/Dashboard.jsx
import React from 'react';
import Sidebar from '../components/sidebar'; // Asegúrate de que la ruta sea correcta
import Header from '../components/Header'; // Asegúrate de que la ruta sea correcta
import Slider from '../components/Slider'; // Asegúrate de que la ruta sea correcta
import Card from '../components/card'; // Asegúrate de que la ruta sea correcta

const Dashboard = () => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: "20px" }}>
                <Header />
                <Slider />
                <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                    <Card title="Card 1" description="Content for card 1" link="#" />
                    <Card title="Card 2" description="Content for card 2" link="#" />
                    <Card title="Card 3" description="Content for card 3" link="#" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;