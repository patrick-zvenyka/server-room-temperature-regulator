import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import { Users, UserPlus } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // New User Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/');
            setUsers(response.data.results || response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/users/', {
                username,
                password,
                email
            });
            setSuccess('Superuser created successfully.');
            setUsername('');
            setPassword('');
            setEmail('');
            fetchUsers();
        } catch (err) {
            setError('Failed to create user. Ensure username is unique.');
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-400" />
                    System Users
                </h1>
                <p className="text-slate-400 text-sm mt-1">Manage administrators and view their access level</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User List */}
                <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-slate-700/50 bg-slate-800/80">
                        <h2 className="text-lg font-semibold text-white">Registered Users</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-slate-800/40 text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                                        <td className="px-6 py-4">{user.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            {user.is_superuser ? (
                                                <span className="bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-500/30">
                                                    Superuser
                                                </span>
                                            ) : (
                                                <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create User Form */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl h-fit">
                    <div className="p-5 border-b border-slate-700/50 bg-slate-800/80">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <UserPlus className="w-5 h-5" /> Add Superuser
                        </h2>
                    </div>
                    <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                        {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">{error}</div>}
                        {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm">{success}</div>}
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <button type="submit" className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                            Provision Superuser
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
