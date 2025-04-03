import React from 'react';

function FormHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

export default FormHeader; 