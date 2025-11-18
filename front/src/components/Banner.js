import React, { useState, useEffect } from "react";
import "./Banner.css";

const banners = [
  {
    title: "Salud emocional",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Asesoría financiera",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Orientación académica",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80",
  },
];

const Banner = () => {
  const [index, setIndex] = useState(0);

  // Cambia cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="banner">
      <div className="banner-overlay">
        <h1 className="banner-title">Bienvenido a BOOST</h1>
      </div>

      <div className="carousel">
        <img
          src={banners[index].image}
          alt={banners[index].title}
          className="carousel-image"
        />
        <div className="carousel-text">
          <h2>{banners[index].title}</h2>
        </div>
      </div>
    </section>
  );
};

export default Banner;

