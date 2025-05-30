import React from 'react';
import ReservaForm from '../components/Reserva/ReservaForm.jsx';

const FormularioReservaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Reservas</h1>
      <ReservaForm />
    </div>
  );
};

export default FormularioReservaPage;
