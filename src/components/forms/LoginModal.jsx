import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { Button, Label, TextInput, Alert, Modal, ModalHeader, ModalBody, Spinner } from 'flowbite-react';

function LoginModal({ isOpen, onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login({ username, password });
            onClose();
            navigate('/admin');
        } catch (err) {
            setError('Credenciais inválidas. Tente novamente.', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} size="md" onClose={onClose} popup>
            <ModalHeader />
            <ModalBody>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="username" value="Usuário" />
                                </div>
                                <TextInput
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password" value="Senha" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <Alert color="failure">
                                    {error}
                                </Alert>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    color="gray"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    color="blue"
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" className="me-3" light />
                                            Entrando...
                                        </>
                                    ) : 'Entrar'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </ModalBody>
        </Modal>
    );
}

export default LoginModal;
