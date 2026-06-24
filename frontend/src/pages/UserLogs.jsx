import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import { List, Search } from 'lucide-react';

const UserLogs = () => {
    const [logs, setLogs] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [username, setUsername] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (currentPage = page) => {
        setLoading(true);
        try {
            const params = { page: currentPage };
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            if (username) params.username = username;
            
            const response = await api.get('/users/activity/', { params });
            setLogs(response.data.results);
            setTotalPages(Math.ceil(response.data.count / 8));
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        setPage(1);
        fetchLogs(1);
    };

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
            fetchLogs(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage(page + 1);
            fetchLogs(page + 1);
        }
    };

    const getActionColor = (action) => {
        switch(action) {
            case 'LOGIN': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'LOGOUT': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'NAVIGATION': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <List className="w-6 h-6 text-purple-400" />
                        User Activity Audit
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Track logins, logouts, and system navigations</p>
                </div>
                
                <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Username</label>
                        <input 
                            type="text" 
                            placeholder="Search..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-32 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">End Date</label>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Search className="w-4 h-4" /> Filter
                    </button>
                </form>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-slate-800/80 text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Action Type</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading activity logs...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No activity recorded for this date range.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{log.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wider ${getActionColor(log.action_type)}`}>
                                                {log.action_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{log.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-4 bg-slate-800/80 border-t border-slate-700/50">
                    <button 
                        onClick={handlePrevious} 
                        disabled={page === 1 || loading}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-400">Page {page} of {totalPages || 1}</span>
                    <button 
                        onClick={handleNext} 
                        disabled={page >= totalPages || loading}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserLogs;
