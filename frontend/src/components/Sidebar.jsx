import { Link, useLocation } from 'react-router-dom';
import { Activity, Users, Thermometer, List, LogOut, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#1f2937] border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-500/20 p-2 rounded-full">
                                <LogOut className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            Are you sure you want to securely end your session? You will need to log in again to access the dashboard.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setIsLogoutModalOpen(false);
                                    logout();
                                }}
                                className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Sidebar;
