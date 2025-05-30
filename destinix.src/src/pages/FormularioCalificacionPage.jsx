import React from 'react';
import CalificacionForm from '../components/Calificacion/CalificacionForm.jsx';

const FormularioCalificacionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Calificaciones</h1>
      <CalificacionForm />
    </div>
  );
};

export default FormularioCalificacionPage;
