import React from 'react';

function Editor() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Editor de Modelos 3D
            </h1>
            <div
                className="border border-slate-300 dark:border-slate-600 rounded-lg p-4 min-h-[500px] flex items-center justify-center bg-white dark:bg-slate-800"
            >
                <p className="text-slate-500 dark:text-slate-400">Área do Editor 3D</p>
            </div>
        </div>
    );
}

export default Editor;
