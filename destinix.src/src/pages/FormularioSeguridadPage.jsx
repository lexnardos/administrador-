import React from 'react';
import SeguridadForm from '../components/Seguridad/SeguridadForm.jsx';

const FormularioSeguridadPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Seguridad</h1>
      <SeguridadForm />
    </div>
  );
};

export default FormularioSeguridadPage;
