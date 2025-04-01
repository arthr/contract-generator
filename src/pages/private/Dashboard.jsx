import React from 'react';

function Dashboard() {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="mt-2">Acompanhamento em tempo real das informações.</p>
            </div>
            <div
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 min-h-[500px] flex bg-white dark:bg-slate-800"
            >
                <p className="text-slate-500 dark:text-slate-400">Bem vindo ao Contract Generator</p>
            </div>
        </div>
    );
}

export default Dashboard;
