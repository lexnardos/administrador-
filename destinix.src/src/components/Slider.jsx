import React from "react";
import "../styles/Dashboard.css";

const images = [
    "/imagenes/buscando.jpg",
    "/imagenes/img2.jpg",
    "/imagenes/playita.jpg",
    "/imagenes/nochebogota.png",
    "/imagenes/paisaje3.jpg",
    "/imagenes/paisaje1.jpg",
    "/imagenes/maloka.jpg",
];

const Slider = () => {
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider-container">
            <div
                className="slider-track"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {images.map((img, i) => (
                    <img key={i} src={img} alt={`Slide ${i + 1}`} className="slider-img" />
                ))}
            </div>
        </div>
    );
};

export default Slider;
