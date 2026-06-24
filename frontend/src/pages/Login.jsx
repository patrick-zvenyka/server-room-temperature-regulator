import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layers, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(username, password);
        setIsLoading(false);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#111827]">
            {/* Logo and Headline */}
            <div className="w-full max-w-md flex flex-col items-center mb-8">
                <div className="text-indigo-500 mb-6">
                    <Layers className="w-12 h-12" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Sign in to your account
                </h1>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-[#1f2937] p-8 md:p-10 rounded-xl border border-gray-800 shadow-xl">

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-gray-400 transition-colors"
                            placeholder=""
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#374151] border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-gray-400 transition-colors pr-12"
                                placeholder=""
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/25 flex justify-center items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>


        </div>
    );
};

export default Login;
