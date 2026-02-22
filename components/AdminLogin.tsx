
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'amr-admin-2025';

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim() === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_authenticated', 'true');
            navigate('/admin');
        } else {
            setError('كلمة المرور غير صحيحة');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
            <div
                className={`bg-glass rounded-[2.5rem] shadow-2xl p-10 md:p-16 text-center max-w-md w-full border border-white/50 transition-transform ${isShaking ? 'animate-shake' : ''}`}
            >
                {/* Admin Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-sky-500/30">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
                <p className="text-gray-500 mb-10 text-lg">أدخل كلمة المرور للدخول إلى لوحة تحكم المعلم</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        placeholder="كلمة المرور"
                        className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-center text-xl font-bold focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm"
                        autoFocus
                    />
                    {error && <p className="text-red-500 font-bold animate-fade-in">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-5 science-gradient text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all transform active:scale-95"
                    >
                        دخول
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
