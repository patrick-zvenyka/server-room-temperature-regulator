import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import { Thermometer, Search } from 'lucide-react';

const TemperatureLogs = () => {
    const [logs, setLogs] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            
            const response = await api.get('/monitoring/logs/', { params });
            const logsData = response.data.results || response.data;
            setLogs(logsData);
        } catch (error) {
            console.error('Error fetching temperature logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchLogs();
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Thermometer className="w-6 h-6 text-orange-400" />
                        Temperature & Humidity Logs
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Historical telemetry data from all sensor racks</p>
                </div>
                
                <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
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
                                <th className="px-6 py-4">Rack ID</th>
                                <th className="px-6 py-4">Temperature (°C)</th>
                                <th className="px-6 py-4">Humidity (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading logs...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No logs found for this date range.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4">{log.rack_identifier}</td>
                                        <td className={`px-6 py-4 font-medium ${log.temperature_celsius > 27 || log.temperature_celsius < 18 ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {log.temperature_celsius}
                                        </td>
                                        <td className="px-6 py-4">{log.humidity_percentage}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default TemperatureLogs;
