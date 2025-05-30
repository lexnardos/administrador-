import React, { useState, useEffect } from "react";
import { getHoteles, addComentario } from "../services/api";
import CardHotel from '../components/CardHotel';
import Swal from 'sweetalert2';

const Hoteles = () => {
    const [hoteles, setHoteles] = useState([]);
    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        getHoteles()
            .then(data => {
                setHoteles(data);
            })
            .catch(err => {
                console.error("Error al cargar hoteles:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un problema al cargar los hoteles.',
                });
            });
    }, []);

    const enviarComentario = async (e, comentario, calificacion, usuario, id_hoteles) => {
        e.preventDefault();

        if (!usuario) {
            Swal.fire({
                icon: 'error',
                title: 'Debes iniciar sesión para comentar.',
            });
            return;
        }

        const nuevoComentario = {
            persona_id_persona: usuario,
            id_hoteles,
            contenido: comentario,
            id_calificacion: calificacion,
        };

        try {
            const response = await addComentario(nuevoComentario);
            if (response.success) {
                setComentarios(prev => [
                    ...prev,
                    { comentario, calificacion, id_hoteles }
                ]);
                Swal.fire({
                    icon: 'success',
                    title: 'Comentario enviado correctamente.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar comentario.',
                    text: response.message || 'Hubo un problema al procesar tu comentario.',
                });
            }
        } catch (error) {
            console.error("Error enviando comentario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error al enviar tu comentario.',
            });
        }
    };

    return (
        <div className="sitio-turistico-container">
            {hoteles.length > 0 ? (
                hoteles.map(hotel => (
                    <CardHotel
                        key={hotel.id_hoteles}
                        hotel={hotel}
                        comentarios={comentarios}
                        setComentarios={setComentarios}
                        enviarComentario={enviarComentario}
                    />
                ))
            ) : (
                <p>No se encontraron hoteles.</p>
            )}
        </div>
    );
};

export default Hoteles;
