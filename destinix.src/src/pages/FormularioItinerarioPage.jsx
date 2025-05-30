import React from 'react';
import ItinerarioForm from '../components/Itinerario/ItinerarioForm.jsx';

const FormularioItinerarioPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Itinerarios</h1>
      <ItinerarioForm />
    </div>
  );
};

export default FormularioItinerarioPage;
