
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../useStudentStore';

const StudentLogin: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [level, setLevel] = useState('1st-prep');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { registerStudent, loginByPhone } = useStudentStore();

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) {
            setError('يرجى إدخال رقم الهاتف');
            return;
        }

        // Validate phone number (Egyptian format)
        const phoneClean = phone.trim().replace(/\s/g, '');
        if (phoneClean.length < 10) {
            setError('يرجى إدخال رقم هاتف صحيح');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            console.log('StudentLogin: Calling loginByPhone for:', phoneClean);
            const student = await loginByPhone(phoneClean);
            console.log('StudentLogin: loginByPhone returned:', student);

            if (student) {
                sessionStorage.setItem('student_logged_in', 'true');
                sessionStorage.setItem('student_name', student.name);
                sessionStorage.setItem('student_phone', student.phone);
                sessionStorage.setItem('student_level', student.level || '1st-prep');
                sessionStorage.setItem('student_id', (student as any).id || '');
                navigate('/');
            } else {
                console.log('StudentLogin: Moving to registration step');
                setStep(2);
            }
        } catch (err) {
            console.error('StudentLogin: Error during login:', err);
            setError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى أو التحقق من الإنترنت');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('يرجى إدخال الاسم');
            return;
        }

        setIsSubmitting(true);
        const phoneClean = phone.trim().replace(/\s/g, '');

        try {
            const id = await registerStudent(name.trim(), phoneClean, level);
            // Login after registration
            sessionStorage.setItem('student_logged_in', 'true');
            sessionStorage.setItem('student_name', name.trim());
            sessionStorage.setItem('student_phone', phoneClean);
            sessionStorage.setItem('student_level', level);
            if (id) sessionStorage.setItem('student_id', id);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء التسجيل');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
            <div className="bg-glass rounded-[2.5rem] shadow-2xl p-10 md:p-16 text-center max-w-md w-full border border-white/50">
                {/* Student Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-sky-500/30">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>

                {step === 1 ? (
                    <>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h2>
                        <p className="text-gray-500 mb-10 text-lg">أدخل رقم الهاتف للمتابعة</p>

                        <form onSubmit={handlePhoneSubmit} className="space-y-5">
                            <div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                                    placeholder="رقم الهاتف"
                                    className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-center text-lg font-bold focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm"
                                    dir="ltr"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-red-500 font-bold animate-fade-in">{error}</p>}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 science-gradient text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all transform active:scale-95 disabled:opacity-60"
                            >
                                {isSubmitting ? 'جاري التحقق...' : 'التالي'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">حساب جديد</h2>
                        <p className="text-gray-500 mb-10 text-lg">رقم الهاتف غير مسجل. يرجى إدخال البيانات للتسجيل.</p>

                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setError(''); }}
                                    placeholder="الاسم بالكامل بالعربي"
                                    className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-center text-lg font-bold focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all shadow-sm"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-right text-gray-700 font-bold mb-2 mr-2">المرحلة الدراسية:</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: '1st-prep', label: '1 إعدادي' },
                                        { id: '2nd-prep', label: '2 إعدادي' },
                                        { id: '3rd-prep', label: '3 إعدادي' }
                                    ].map((l) => (
                                        <button
                                            key={l.id}
                                            type="button"
                                            onClick={() => setLevel(l.id)}
                                            className={`p-3 rounded-xl border-2 font-bold transition-all ${level === l.id
                                                ? 'border-sky-500 bg-sky-50 text-sky-600'
                                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                                }`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl text-gray-500 text-sm font-medium">
                                رقم الهاتف: <span dir="ltr" className="font-bold text-gray-800">{phone}</span>
                            </div>
                            {error && <p className="text-red-500 font-bold animate-fade-in">{error}</p>}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-shrink-0 w-16 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    ←
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-5 science-gradient text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all transform active:scale-95 disabled:opacity-60"
                                >
                                    {isSubmitting ? 'جاري التسجيل...' : 'تسجيل حساب'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <p className="mt-6 text-sm text-gray-400">بيانات التسجيل تُستخدم للمتابعة مع المعلم فقط.</p>
            </div>
        </div>
    );
};

export default StudentLogin;
