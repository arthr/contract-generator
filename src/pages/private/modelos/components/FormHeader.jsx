import React from 'react';

function FormHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">
        {description}
      </p>
    </div>
  );
}

export default FormHeader; 