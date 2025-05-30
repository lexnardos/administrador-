import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Comentarios = ({ idHoteles }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [idEditar, setIdEditar] = useState(null);

    // Cargar comentarios al inicio
    useEffect(() => {
        fetch(`http://localhost/destinix/comentariosadmin.php?id_hoteles=${idHoteles}`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setComentarios(data.data);
            });
    }, [idHoteles]);

    const agregarComentario = () => {
        if (!nuevoComentario.trim()) return;

        fetch('http://localhost/destinix/comentariosadmin.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contenido: nuevoComentario,
                id_calificacion: 1, // Puedes cambiar esto según tu lógica
                id_hoteles: idHoteles
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setNuevoComentario('');
                    Swal.fire('¡Comentario agregado!', '', 'success');
                    // Recargar comentarios
                    return fetch(`http://localhost/destinix/comentariosadmin.php?id_hoteles=${idHoteles}`, {
                        credentials: 'include',
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .then(res => res && res.json())
            .then(data => data && data.success && setComentarios(data.data));
    };

    const eliminarComentario = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esto eliminará el comentario.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://localhost/destinix/comentariosadmin.php', {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id_comentario=${id}`,
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Eliminado', '', 'success');
                            setComentarios(comentarios.filter(c => c.id_comentario !== id));
                        } else {
                            Swal.fire('Error', data.message, 'error');
                        }
                    });
            }
        });
    };

    const editarComentario = () => {
        fetch('http://localhost/destinix/comentariosadmin.php', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_comentario: idEditar,
                contenido: nuevoComentario
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Comentario actualizado', '', 'success');
                    setNuevoComentario('');
                    setIdEditar(null);
                    return fetch(`http://localhost/destinix/comentariosadmin.php?id_hoteles=${idHoteles}`, {
                        credentials: 'include',
                    });
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            })
            .then(res => res && res.json())
            .then(data => data && data.success && setComentarios(data.data));
    };

    const seleccionarParaEditar = (comentario) => {
        setIdEditar(comentario.id_comentario);
        setNuevoComentario(comentario.contenido);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Comentarios del hotel</h2>

            <div className="flex mb-4 gap-2">
                <input
                    type="text"
                    className="border p-2 flex-1 rounded"
                    placeholder="Escribe un comentario..."
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                />
                {idEditar ? (
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={editarComentario}>
                        Actualizar
                    </button>
                ) : (
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={agregarComentario}>
                        Comentar
                    </button>
                )}
            </div>

            <ul className="space-y-3">
                {comentarios.map((comentario) => (
                    <li key={comentario.id_comentario} className="border p-3 rounded shadow-sm flex justify-between items-start">
                        <div>
                            <p className="text-gray-800">{comentario.contenido}</p>
                            <p className="text-xs text-gray-500">ID Persona: {comentario.persona_id_persona}</p>
                        </div>
                        <div className="space-x-2">
                            <button className="text-blue-600" onClick={() => seleccionarParaEditar(comentario)}>Editar</button>
                            <button className="text-red-600" onClick={() => eliminarComentario(comentario.id_comentario)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Comentarios;
