import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-slate-200 flex">
            {/* Ambient Background for entire layout */}
            <div className="fixed top-[-20%] left-[20%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
            
            <Sidebar />
            
            {/* Main Content Area - padded left by the width of the sidebar (w-64 = 16rem = 256px) */}
            <div className="flex-1 ml-64 relative z-10 overflow-x-hidden">
                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
