import { Link, useLocation } from 'react-router-dom';
import { Activity, Users, Thermometer, List, LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-5 h-5" /> },
        { name: 'Temperature Logs', path: '/temperature-logs', icon: <Thermometer className="w-5 h-5" /> },
        { name: 'User Management', path: '/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Activity Logs', path: '/user-logs', icon: <List className="w-5 h-5" /> },
    ];

    return (
        <div className={`w-64 h-screen bg-[#1f2937] border-r border-gray-800 flex flex-col justify-between fixed top-0 left-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div>
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 p-2 rounded-lg">
                            <Activity className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">NetOne <span className="text-indigo-400">NOC</span></h1>
                    </div>
                    {/* Mobile close button */}
                    <button 
                        className="lg:hidden p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <nav className="p-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive 
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
                <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
