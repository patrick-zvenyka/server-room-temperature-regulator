import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background text-slate-200 flex">
            {/* Ambient Background for entire layout */}
            <div className="fixed top-[-20%] left-[20%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            {/* Main Content Area - padded left on large screens */}
            <div className={`flex-1 relative z-10 overflow-x-hidden transition-all duration-300 lg:ml-64`}>
                {/* Mobile Header for Sidebar Toggle */}
                <div className="lg:hidden p-4 flex items-center bg-[#1f2937]/50 border-b border-gray-800 backdrop-blur-md sticky top-0 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="ml-4 font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="bg-indigo-500 p-1.5 rounded-md">
                            <Menu className="w-4 h-4 text-white opacity-0 hidden" /> 
                        </span>
                        NetOne <span className="text-indigo-400">NOC</span>
                    </h1>
                </div>

                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
