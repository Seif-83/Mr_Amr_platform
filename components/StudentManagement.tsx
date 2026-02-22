
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudentStore, Student } from '../useStudentStore';

const StudentManagement: React.FC = () => {
    const navigate = useNavigate();
    const { students, isLoading, removeStudent } = useStudentStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Auth guard
    useEffect(() => {
        if (sessionStorage.getItem('admin_authenticated') !== 'true') {
            navigate('/admin-login');
        }
    }, [navigate]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleDelete = async (studentId: string) => {
        await removeStudent(studentId);
        setDeleteConfirm(null);
        showSuccess('تم حذف الطالب بنجاح ✓');
    };

    const filteredStudents = students.filter(s =>
        s.name.includes(searchQuery) || s.phone.includes(searchQuery)
    );

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen pb-20 relative z-10">
            {/* Header */}
            <div className="science-gradient pt-28 pb-20 text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3">إدارة الطلاب</h1>
                <p className="text-sky-100 text-xl">عرض وإدارة الطلاب المسجلين في المنصة</p>
                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        to="/admin"
                        className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full transition-all text-sm"
                    >
                        ← الرجوع للوحة التحكم
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-10">
                {/* Registration Requests Section */}
                {requests.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            🔔 طلبات التسجيل الجديدة
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{requests.length}</span>
                        </h2>
                        <div className="bg-glass rounded-[2rem] shadow-xl border border-white/50 overflow-hidden divide-y divide-gray-50">
                            {requests.map((req) => (
                                <div key={req.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/40 transition-all">
                                    <div className="flex items-center gap-4 text-right w-full md:w-auto">
                                        <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 text-xl font-bold">
                                            {req.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{req.name}</div>
                                            <div className="text-sm text-gray-500" dir="ltr">{req.phone}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <div className="flex-1 md:flex-none">
                                            <div className="text-xs text-gray-400 mb-1">كود التفعيل:</div>
                                            <div className="bg-gray-100 px-4 py-2 rounded-xl font-mono text-xl font-black text-center tracking-wider">
                                                {req.code}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={`https://wa.me/2${req.phone}?text=${encodeURIComponent(`أهلاً يا بطل! كود التفعيل الخاص بك لمنصة الأستاذ عمرو محسن هو: ${req.code}. بالتوفيق!`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all flex items-center gap-2 font-bold"
                                            >
                                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.584 3.911 1.706 5.61l-.998 3.647 3.754-.985zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                                إرسال
                                            </a>
                                            <button
                                                onClick={() => removeRegistrationRequest(req.id)}
                                                className="p-4 bg-sky-100 text-sky-600 rounded-2xl hover:bg-sky-200 transition-all font-bold"
                                                title="تمت الموافقة"
                                            >
                                                تم ✓
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Success message */}
                {successMsg && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl text-center font-bold text-lg animate-fade-in">
                        {successMsg}
                    </div>
                )}

                {/* Stats + Search */}
                <div className="bg-glass rounded-2xl shadow-lg p-6 mb-8 border border-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="bg-sky-50 p-4 rounded-2xl">
                            <div className="text-3xl font-extrabold text-sky-600">{students.length}</div>
                            <div className="text-sm text-gray-500 font-medium">طالب مسجل</div>
                        </div>
                    </div>
                    <div className="flex-1 max-w-md w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="🔍 بحث بالاسم أو رقم الهاتف..."
                            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-right"
                        />
                    </div>
                </div>

                {/* Loading */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">جاري تحميل بيانات الطلاب...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="bg-glass rounded-[2rem] shadow-xl border border-white/50 p-16 text-center">
                        <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-xl font-bold text-gray-400">
                            {searchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد طلاب مسجلين بعد'}
                        </p>
                        <p className="mt-2 text-gray-400">
                            {searchQuery ? 'جرب البحث بكلمة مختلفة' : 'سيظهر الطلاب هنا بعد تسجيل الدخول'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-glass rounded-[2rem] shadow-xl border border-white/50 overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50/50 font-bold text-gray-600 text-sm">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-3">الاسم</div>
                            <div className="col-span-2">المرحلة</div>
                            <div className="col-span-2">رقم الهاتف</div>
                            <div className="col-span-2">تاريخ التسجيل</div>
                            <div className="col-span-1">آخر ظهور</div>
                            <div className="col-span-1 text-center">إجراء</div>
                        </div>

                        {/* Student Rows */}
                        {filteredStudents.map((student, index) => (
                            <div
                                key={student.id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-gray-50 hover:bg-sky-50/30 transition-all items-center"
                            >
                                <div className="hidden md:flex col-span-1 justify-center">
                                    <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-900">{student.name}</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className="md:hidden font-bold text-gray-400 ml-2">المرحلة:</span>
                                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                                        {student.level === '1st-prep' ? '1 إعدادي' :
                                            student.level === '2nd-prep' ? '2 إعدادي' :
                                                student.level === '3rd-prep' ? '3 إعدادي' : 'غير محدد'}
                                    </span>
                                </div>
                                <div className="col-span-2 text-gray-600" dir="ltr">
                                    <span className="md:hidden font-bold text-gray-400 ml-2">الهاتف:</span>
                                    📱 {student.phone}
                                </div>
                                <div className="col-span-2 text-gray-500 text-sm">
                                    <span className="md:hidden font-bold text-gray-400 ml-2">التسجيل:</span>
                                    {formatDate(student.loginDate)}
                                </div>
                                <div className="col-span-1 text-gray-500 text-sm">
                                    <span className="md:hidden font-bold text-gray-400 ml-2">آخر ظهور:</span>
                                    {formatDate(student.lastSeen)}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button
                                        onClick={() => setDeleteConfirm(student.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                                        title="حذف الطالب"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">تأكيد حذف الطالب</h3>
                        <p className="text-gray-500 mb-8">هل أنت متأكد من حذف هذا الطالب من القائمة؟</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
