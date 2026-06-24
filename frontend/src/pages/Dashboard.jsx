import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { LogOut, Thermometer, Droplets, AlertTriangle, Server, Activity, ShieldCheck, Clock } from 'lucide-react';

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
            
            const logsData = logsRes.data.results || logsRes.data;
            const alertsData = alertsRes.data.results || alertsRes.data;
            
            const formattedLogs = logsData.slice(0, 20).reverse().map(log => ({
                time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                temperature: log.temperature_celsius,
                humidity: log.humidity_percentage
            }));

            setLogs(formattedLogs);
            setAlerts(alertsData.slice(0, 8));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const currentTemp = logs.length > 0 ? logs[logs.length - 1].temperature : '--';
    const currentHumidity = logs.length > 0 ? logs[logs.length - 1].humidity : '--';
    const isTempCritical = currentTemp > 27 || currentTemp < 18;

    return (
        <div className="min-h-screen bg-background text-slate-200 p-4 md:p-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10 animate-fade-in">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 glass p-5 md:px-8 rounded-3xl animate-slide-up">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="bg-gradient-to-br from-primary to-purple-600 p-3 rounded-2xl shadow-lg shadow-primary/20 animate-float">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">NetOne <span className="text-primaryLight">NOC</span></h1>
                            <p className="text-sm text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-success" /> System Secure & Active
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 px-5 py-2.5 rounded-xl transition-all border border-slate-700/50"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold text-sm">Sign Out</span>
                    </button>
                </header>

                {loading && logs.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-96 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-700 border-t-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-primary">
                                <Activity className="w-6 h-6 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium animate-pulse">Initializing telemetry...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Metrics Overview */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="glass-card p-6 rounded-3xl flex items-center justify-between group">
                                <div>
                                    <p className="text-slate-400 font-semibold mb-2 text-sm uppercase tracking-wider">Monitored Racks</p>
                                    <p className="text-4xl font-bold text-white group-hover:text-primary transition-colors">12 <span className="text-lg text-slate-500 font-normal">Active</span></p>
                                </div>
                                <div className="bg-slate-800/80 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors border border-slate-700/50">
                                    <Server className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            
                            <div className={`glass-card p-6 rounded-3xl flex items-center justify-between group ${isTempCritical ? 'border-danger/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : ''}`}>
                                <div>
                                    <p className="text-slate-400 font-semibold mb-2 text-sm uppercase tracking-wider">Avg Temperature</p>
                                    <div className="flex items-end gap-2">
                                        <p className={`text-4xl font-bold ${isTempCritical ? 'text-danger animate-pulse' : 'text-white'}`}>
                                            {currentTemp}°<span className="text-2xl">C</span>
                                        </p>
                                    </div>
                                </div>
                                <div className={`${isTempCritical ? 'bg-danger/20' : 'bg-orange-500/10'} p-4 rounded-2xl border border-slate-700/50 group-hover:scale-110 transition-transform`}>
                                    <Thermometer className={`w-8 h-8 ${isTempCritical ? 'text-danger' : 'text-orange-400'}`} />
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-3xl flex items-center justify-between group">
                                <div>
                                    <p className="text-slate-400 font-semibold mb-2 text-sm uppercase tracking-wider">Avg Humidity</p>
                                    <p className="text-4xl font-bold text-white">{currentHumidity}<span className="text-2xl text-slate-400">%</span></p>
                                </div>
                                <div className="bg-blue-500/10 p-4 rounded-2xl border border-slate-700/50 group-hover:scale-110 transition-transform">
                                    <Droplets className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl h-[450px] flex flex-col animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Thermal & Environmental Trends</h2>
                                    <p className="text-sm text-slate-400 mt-1">Real-time data stream from IoT sensors</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                    <span className="text-xs font-semibold text-slate-300 uppercase">Live</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full -ml-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                                        <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                            itemStyle={{ color: '#f8fafc', fontWeight: '600' }}
                                            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                        />
                                        <Area type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} name="Temperature (°C)" />
                                        <Area type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHum)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} name="Humidity (%)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Alerts Panel */}
                        <div className="glass p-6 md:p-8 rounded-3xl h-[450px] overflow-hidden flex flex-col animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">System Alerts</h2>
                                    <p className="text-sm text-slate-400 mt-1">ASHRAE Threshold Breaches</p>
                                </div>
                                <span className="bg-danger/10 text-danger px-3 py-1.5 rounded-lg text-xs font-bold border border-danger/20 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3" />
                                    {alerts.filter(a => !a.resolved).length} Critical
                                </span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {alerts.length === 0 ? (
                                    <div className="text-slate-500 flex flex-col items-center justify-center h-full space-y-3">
                                        <ShieldCheck className="w-12 h-12 text-slate-700" />
                                        <p>No recent alerts. Environment stable.</p>
                                    </div>
                                ) : (
                                    alerts.map(alert => (
                                        <div key={alert.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex gap-4 items-start hover:bg-slate-800/80 transition-colors group">
                                            <div className={`p-2.5 rounded-xl mt-0.5 flex-shrink-0 ${alert.resolved ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'}`}>
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-white font-semibold text-sm">{alert.alert_type.replace('_', ' ')}</p>
                                                    <span className="flex items-center gap-1 text-slate-500 text-[10px] font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-xs leading-relaxed">{alert.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Custom Scrollbar Styles appended directly */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(71, 85, 105, 0.5);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
