import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, Thermometer, Droplets, AlertTriangle, Server, Activity } from 'lucide-react';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [logsRes, alertsRes] = await Promise.all([
                axios.get('http://localhost:8000/api/monitoring/logs/'),
                axios.get('http://localhost:8000/api/monitoring/alerts/')
            ]);
            
            // Assuming DRF returns paginated results in .results or direct array
            const logsData = logsRes.data.results || logsRes.data;
            const alertsData = alertsRes.data.results || alertsRes.data;
            
            // Format data for chart (reverse to chronological order for line chart)
            const formattedLogs = logsData.slice(0, 20).reverse().map(log => ({
                time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                temperature: log.temperature_celsius,
                humidity: log.humidity_percentage
            }));

            setLogs(formattedLogs);
            setAlerts(alertsData.slice(0, 5)); // Keep only recent alerts
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const currentTemp = logs.length > 0 ? logs[logs.length - 1].temperature : '--';
    const currentHumidity = logs.length > 0 ? logs[logs.length - 1].humidity : '--';

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 glass p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <Activity className="text-primary w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">NetOne NOC Dashboard</h1>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </header>

            {loading && logs.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Metrics Overview */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 font-medium mb-1">Server Racks</p>
                                <p className="text-3xl font-bold text-white">Active</p>
                            </div>
                            <div className="bg-success/20 p-4 rounded-full">
                                <Server className="w-8 h-8 text-success" />
                            </div>
                        </div>
                        
                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 font-medium mb-1">Avg Temperature</p>
                                <p className={`text-3xl font-bold ${currentTemp > 27 ? 'text-danger' : 'text-white'}`}>
                                    {currentTemp}°C
                                </p>
                            </div>
                            <div className={`${currentTemp > 27 ? 'bg-danger/20' : 'bg-primary/20'} p-4 rounded-full`}>
                                <Thermometer className={`w-8 h-8 ${currentTemp > 27 ? 'text-danger' : 'text-primary'}`} />
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 font-medium mb-1">Avg Humidity</p>
                                <p className="text-3xl font-bold text-white">{currentHumidity}%</p>
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-full">
                                <Droplets className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="lg:col-span-2 glass p-6 rounded-2xl h-96 flex flex-col">
                        <h2 className="text-xl font-bold text-white mb-6">Thermal Trends</h2>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={logs}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Temperature (°C)" />
                                    <Line type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={3} dot={false} name="Humidity (%)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="glass p-6 rounded-2xl h-96 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Active Alerts</h2>
                            <span className="bg-danger/20 text-danger px-3 py-1 rounded-full text-xs font-bold">
                                {alerts.filter(a => !a.resolved).length} Critical
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {alerts.length === 0 ? (
                                <div className="text-slate-400 text-center mt-10">No recent alerts. System stable.</div>
                            ) : (
                                alerts.map(alert => (
                                    <div key={alert.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex gap-4 items-start">
                                        <div className={`p-2 rounded-full mt-1 ${alert.resolved ? 'bg-success/20' : 'bg-danger/20'}`}>
                                            <AlertTriangle className={`w-5 h-5 ${alert.resolved ? 'text-success' : 'text-danger'}`} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm mb-1">{alert.alert_type}</p>
                                            <p className="text-slate-400 text-xs mb-2">{alert.message}</p>
                                            <p className="text-slate-500 text-[10px]">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
