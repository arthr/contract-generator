import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { Button } from 'flowbite-react';
import LoginModal from '../../components/forms/LoginModal';

function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/admin');
        } else {
            setShowLogin(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Bem-vindo ao Contract Generator
            </h1>
            <p className="text-xl mb-8 text-center max-w-2xl text-slate-600 dark:text-slate-300 font-light">
                Gere documentos contratuais prontos para uso em segundos a partir de modelos pré-configurados.
            </p>
            <Button
                onClick={handleGetStarted}
                size="lg"
                className="px-6 py-3 text-white
                shadow-sm hover:shadow-lg shadow-teal-500/50
                bg-gradient-to-br hover:bg-gradient-to-b
                from-emerald-600 to-blue-500 via-emerald
                focus:ring-blue-300 dark:focus:ring-blue-800
                transition-all duration-300 ease-in-out
                "
            >
                {user ? 'Ir para o Gerador' : 'Começar Agora'}
            </Button>

            <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </div>
    );
}

export default Home;
