
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'amr-admin-2025';

const LoginSelection: React.FC = () => {
    const navigate = useNavigate();
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleTeacherClick = () => {
        setShowPasswordInput(true);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_authenticated', 'true');
            navigate('/admin');
        } else {
            setError('كلمة المرور غير صحيحة');
        }
    };

    const handleStudentLogin = () => {
        navigate('/student-login');
    };

    if (showPasswordInput) {
        return (
            <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-12">
                <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/50 shadow-2xl text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-sky-500/30">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">تأكيد الهوية</h2>
                    <p className="text-gray-500 mb-8">يرجى إدخال كلمة مرور المعلم للمتابعة</p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            placeholder="كلمة المرور"
                            className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-center text-xl font-bold focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm"
                            autoFocus
                        />
                        {error && <p className="text-red-500 font-bold">{error}</p>}

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold text-xl hover:bg-sky-700 transition-all transform active:scale-95 shadow-lg shadow-sky-500/20"
                            >
                                دخول
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPasswordInput(false)}
                                className="w-full py-2 text-gray-400 hover:text-gray-600 font-medium transition-colors"
                            >
                                رجوع
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative z-10 px-4 py-12">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">تسجيل الدخول</h2>
                    <p className="text-xl text-gray-600">من فضلك اختر نوع الحساب للمتابعة</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    {/* Teacher Card */}
                    <button
                        onClick={handleTeacherClick}
                        className="group relative bg-white/70 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden text-right w-full"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-4">معلم / مسؤول</h3>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                الدخول إلى لوحة التحكم لإدارة المنهج والطلاب والاختبارات.
                            </p>

                            <div className="mt-8 flex items-center gap-2 text-sky-600 font-bold group-hover:gap-4 transition-all duration-300">
                                <span>دخول لوحة التحكم</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    {/* Student Card */}
                    <button
                        onClick={handleStudentLogin}
                        className="group relative bg-white/70 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden text-right w-full"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-500">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-4">طالب</h3>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                الدخول لمراجعة الدروس، المذكرات، والمشاركة في الاختبارات.
                            </p>

                            <div className="mt-8 flex items-center gap-2 text-teal-600 font-bold group-hover:gap-4 transition-all duration-300">
                                <span>دخول الطالب</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginSelection;
