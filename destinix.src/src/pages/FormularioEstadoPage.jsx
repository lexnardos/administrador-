import React from 'react';
import EstadoForm from '../components/Estado/EstadoForm.jsx';

const FormularioEstadoPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Estados</h1>
      <EstadoForm />
    </div>
  );
};

export default FormularioEstadoPage;
