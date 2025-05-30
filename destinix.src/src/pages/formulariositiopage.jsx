import React from 'react';
import Sitiocrear from '../components/SitiosTuristicos/SitiosForm.jsx'; // nombre con mayúscula (buena práctica para componentes)

const formulariositiopage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Sitios Turísticos para gregar
        
      </h1>
      <Sitiocrear /> {/* nombre del componente con mayúscula */}
    </div>
  );
};

export default formulariositiopage;
