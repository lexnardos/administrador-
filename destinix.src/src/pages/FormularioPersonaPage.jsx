import React from 'react';
import PersonaForm from '../components/Persona/PersonaForm.jsx';

const FormularioPersonaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Personas</h1>
      <PersonaForm />
    </div>
  );
};

export default FormularioPersonaPage;
