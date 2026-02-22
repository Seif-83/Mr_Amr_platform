
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PrepLevelCard from './components/PrepLevelCard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminExams from './components/AdminExams';
import StudentExams from './components/StudentExams';
import StudentExamPage from './components/StudentExamPage';
import AdminExamResults from './components/AdminExamResults';
import StudentLogin from './components/StudentLogin';
import StudentManagement from './components/StudentManagement';
import { useContentStore } from './useContentStore';
import { Lesson } from './types';
import { useExamStore } from './useExamStore';
import ErrorBoundary from './components/ErrorBoundary';

const ScienceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden science-grid">
      {/* Atom */}
      <div className="absolute top-[10%] left-[5%] animate-science-float text-sky-400/20">
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(45 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-45 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(90 12 12)" />
        </svg>
      </div>

      {/* Microscope */}
      <div className="absolute bottom-[10%] right-[8%] animate-science-sway text-teal-400/20" style={{ animationDelay: '2s' }}>
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M6 18h8m-8-3h5m-2-3h2m-2-3h2m-6 9V4a2 2 0 012-2h1m2 0h1a2 2 0 012 2v1m-4 2l4 4m-4 0l4-4" />
          <path d="M12 18l3 3m0-3l-3 3M9 22h9" />
        </svg>
      </div>

      {/* DNA */}
      <div className="absolute top-[40%] right-[12%] animate-science-float text-sky-500/10" style={{ animationDelay: '4s' }}>
        <svg width="80" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M8 3c4 4 4 14 0 18M16 3c-4 4-4 14 0 18M8 7h8M8 12h8M8 17h8" />
        </svg>
      </div>

      {/* Flask */}
      <div className="absolute bottom-[40%] left-[10%] animate-science-pulse text-teal-500/20">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M9 3h6M10 3v15a2 2 0 002 2 2 2 0 002-2V3m-4 10h4" />
        </svg>
      </div>

      {/* Molecules / Bubbles */}
      <div className="absolute top-[20%] right-[40%] w-3 h-3 rounded-full bg-sky-300 animate-science-pulse"></div>
      <div className="absolute top-[25%] right-[42%] w-2 h-2 rounded-full bg-teal-300 animate-science-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-[30%] left-[45%] w-4 h-4 rounded-full bg-sky-200 animate-science-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[15%] left-[25%] w-2 h-2 rounded-full bg-teal-200 animate-science-pulse" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { levels, isLoading } = useContentStore();
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [studentLevel, setStudentLevel] = useState<string | null>(null);

  // Always initialize exam store hooks to preserve hook order
  const { exams, isLoading: isExamsLoading } = useExamStore();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('student_logged_in') === 'true';
    const level = sessionStorage.getItem('student_level');
    setIsStudentLoggedIn(loggedIn);
    setStudentLevel(level);
  }, []);

  if (isLoading || isExamsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Filter levels based on student's selection
  const displayedLevels = isStudentLoggedIn
    ? levels.filter(l => l.id === studentLevel)
    : [];
  const availableExamsForLevel = isStudentLoggedIn && studentLevel
    ? exams.filter(e => e.published && e.levelId === studentLevel)
    : [];

  return (
    <div className="relative">
      <Hero />

      {isStudentLoggedIn && (
        <section id="levels" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">مرحلتك الدراسية</h2>
            <div className="mt-4 h-1.5 w-24 bg-sky-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
              كل ما تحتاجه للتفوق في مادة العلوم.
            </p>
          </div>

          {displayedLevels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-center">
              {displayedLevels.map(level => (
                <PrepLevelCard key={level.id} data={level} />
              ))}
            </div>
          ) : (
            <div className="text-center p-10 bg-white/50 rounded-3xl border border-gray-100">
              <p className="text-xl text-gray-500 font-bold">لم يتم العثور على محتوى للمرحلة المختارة.</p>
              <Link to="/student-login" className="mt-4 inline-block text-sky-600 font-bold hover:underline">تسجيل الخروج وتغيير المرحلة</Link>
            </div>
          )}
          {/* Exams section for the student's level */}
          {isStudentLoggedIn && (
            <section className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-extrabold">اختبارات لمرحلتك</h3>
                <p className="text-gray-500 mt-2">حل اختبارات نشرت من قبل المعلم لقياس مستواك</p>
              </div>

              <div className="max-w-4xl mx-auto px-4">
                {availableExamsForLevel.length === 0 ? (
                  <div className="p-8 bg-white rounded-2xl text-center text-gray-500">لا توجد اختبارات منشورة لمرحلتك حالياً.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableExamsForLevel.map(ex => (
                      <div key={ex.id} className="p-6 bg-white rounded-2xl border flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{ex.title}</h4>
                          <p className="text-sm text-gray-500 mt-2">{ex.description}</p>
                          <p className="text-xs text-gray-400 mt-2">أسئلة: {ex.questions?.length ?? 0} • زمن: {ex.timeLimitMinutes ?? 'غير محدد'}</p>
                        </div>
                        <div className="mt-4">
                          <Link to={`/exam/${ex.id}`} className="px-4 py-3 bg-sky-600 text-white rounded-xl">ابدأ الاختبار</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </section>
      )}

      {!isStudentLoggedIn && (
        <section className="py-16 max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="bg-gradient-to-br from-sky-500 to-teal-400 rounded-[3rem] p-12 text-white shadow-xl shadow-sky-200 transform hover:scale-[1.02] transition-all duration-500">
            <h2 className="text-4xl font-extrabold mb-6">ابدأ رحلتك التعليمية الآن</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              سجل دخولك الآن للوصول إلى محتوى مرحلتك الدراسية ومتابعة دروسك أولاً بأول.
            </p>
            <Link
              to="/student-login"
              className="inline-block bg-white text-sky-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-sky-50 transition-all shadow-lg hover:shadow-xl transform active:scale-95"
            >
              تسجيل الدخول للطالب
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

const VideoLessonCard: React.FC<{ lesson: Lesson; levelId: string }> = ({ lesson, levelId }) => {
  const { updateLesson } = useContentStore();
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // If lesson has single-use codes, it's locked unless unlocked in session
    if (lesson.codes && lesson.codes.length > 0) return !(sessionStorage.getItem(`video_unlocked_${lesson.id}`) === 'true');
    return !!lesson.code;
  });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Keep locked state in sync when lesson changes
  useEffect(() => {
    if (lesson.codes && lesson.codes.length > 0) {
      const unlocked = sessionStorage.getItem(`video_unlocked_${lesson.id}`);
      setIsLocked(!(unlocked === 'true'));
    } else {
      setIsLocked(!!lesson.code);
    }
  }, [lesson.id, lesson.code, lesson.codes]);



  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    // If single-use codes are configured for this lesson
    if (lesson.codes && lesson.codes.length > 0) {
      const entered = code.trim();
      const found = lesson.codes.find(c => c.value === entered);
      if (!found) {
        setError('الكود غير صحيح');
        return;
      }
      if (found.used) {
        setError('هذا الكود مستخدم بالفعل');
        return;
      }

      // Mark code as used and assign to student (if available)
      const studentPhone = sessionStorage.getItem('student_phone') || sessionStorage.getItem('student_name') || null;
      const updatedCodes = (lesson.codes || []).map(c => c.value === entered ? { ...c, used: true, assignedTo: studentPhone } : c);

      try {
        await updateLesson(levelId, lesson.id, { codes: updatedCodes });
        setIsLocked(false);
        sessionStorage.setItem(`video_unlocked_${lesson.id}`, 'true');
        setError('');
      } catch (err) {
        console.error('Failed to mark code used', err);
        setError('حدث خطأ، يرجى المحاولة لاحقاً');
      }
      return;
    }

    // Legacy single static code
    if (code.trim() === lesson.code) {
      setIsLocked(false);
      sessionStorage.setItem(`video_unlocked_${lesson.id}`, 'true');
      setError('');
    } else {
      setError('الكود غير صحيح');
    }
  };

  // Get videos from lesson: either new videos array or fallback to single videoUrl
  const videos = lesson.videos && lesson.videos.length > 0
    ? lesson.videos
    : (lesson.videoUrl ? [{ id: 'legacy-' + lesson.id, title: lesson.title, videoUrl: lesson.videoUrl }] : []);

  return (
    <div className="space-y-8">
      {/* Lock overlay if needed */}
      {isLocked && ((lesson.codes?.length ?? 0) > 0 || lesson.code) && (
        <div className="bg-glass rounded-[2rem] shadow-xl border border-white/50 p-12 text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🔒</span>
          </div>
          <h3 className="text-white font-bold mb-2 text-2xl">هذه الفيديوهات محمية بكود</h3>
          {lesson.codes && lesson.codes.length > 0 && lesson.codes.every(c => c.used) ? (
            <div className="text-gray-300 max-w-xs mx-auto mt-4">
              <p className="mb-2">عذراً، لا توجد أكواد متاحة حالياً.</p>
              <p>يرجى التواصل مع المعلم للحصول على أكواد جديدة.</p>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-3 mt-6 mx-auto">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="أدخل كود الفيديو"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center focus:ring-2 focus:ring-sky-500 outline-none"
              />
              {error && <p className="text-red-400 text-sm font-bold">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold transition-colors"
              >
                مشاهدة
              </button>
            </form>
          )}
        </div>
      )}

      {/* Display all videos */}
      {!isLocked && videos.map((video, idx) => (
        <div key={video.id} className="bg-glass rounded-[2rem] shadow-xl overflow-hidden border border-white/50 flex flex-col">
          <div className="aspect-video relative bg-black overflow-hidden">
            {video.videoUrl && (video.videoUrl.startsWith('data:') || video.videoUrl.endsWith('.mp4')) ? (
              <video
                className="w-full h-full"
                src={video.videoUrl}
                controls
                controlsList="nodownload"
                onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
                }}
              />
            ) : (
              <iframe
                className="w-full h-full"
                src={video.videoUrl}
                title={video.title}
                allowFullScreen
              ></iframe>
            )}
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">📹 {video.title}</h3>
            {video.description && (
              <p className="text-gray-500 leading-relaxed">{video.description}</p>
            )}
            {videos.length > 1 && (
              <p className="text-gray-400 text-sm mt-4">الفيديو {idx + 1} من {videos.length}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const { levels } = useContentStore();
  const level = levels.find(l => l.id === levelId);

  if (!level) return <div className="p-20 text-center font-bold text-2xl">المرحلة غير موجودة.</div>;

  return (
    <div className="min-h-screen pb-32 relative z-10">
      <div className="science-gradient pt-32 pb-48 text-white text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">{level.titleAr}</h1>
        <p className="text-sky-100 text-2xl">🎥 فيديوهات الشرح</p>
        <Link to="/" className="mt-8 inline-block bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all">
          ← العودة للرئيسية
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(level.lessons || []).map(lesson => (
            <Link key={lesson.id} to={`/level/${levelId}/videos/${lesson.id}`} className="block group">
              <div className="bg-glass rounded-[2rem] shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all transform hover:scale-105">
                <div
                  className="aspect-video relative bg-black"
                  style={lesson.coverImage ? { backgroundImage: `url(${lesson.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#000' }}
                >
                  {lesson.videoUrl && (lesson.videoUrl.startsWith('data:') || lesson.videoUrl.endsWith('.mp4')) ? (
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/40 text-xs px-2 py-1 rounded">محمّل</span>
                    </div>
                  ) : null}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-end p-4">
                    <div>
                      <h3 className="text-white text-lg font-bold">{lesson.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-2">{lesson.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentPage: React.FC<{ type: 'videos' | 'notes' }> = ({ type }) => {
  const { levelId } = useParams<{ levelId: string }>();
  const { levels, isLoading } = useContentStore();
  const level = levels.find(l => l.id === levelId);

  if (!level) return <div className="p-20 text-center font-bold text-2xl">المرحلة غير موجودة.</div>;

  return (
    <div className="min-h-screen pb-32 relative z-10">
      <div className="science-gradient pt-32 pb-48 text-white text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">{level.titleAr}</h1>
        <p className="text-sky-100 text-2xl">{type === 'videos' ? '🎥 فيديوهات الشرح' : '📚 مذكرات الشرح'}</p>
        <Link to="/" className="mt-8 inline-block bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all">
          ← العودة للرئيسية
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {type === 'notes' && (level.lessons || []).filter(l => l.pdfUrl && l.pdfUrl.trim() !== '').length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-xl font-bold">لا توجد مذكرات لهذه المرحلة حالياً</p>
            </div>
          )}
          {(type === 'notes'
            ? (level.lessons || []).filter(l => l.pdfUrl && l.pdfUrl.trim() !== '')
            : (level.lessons || [])
          ).map(lesson => (
            <React.Fragment key={lesson.id}>
              {type === 'videos' ? (
                <VideoLessonCard lesson={lesson} levelId={level.id} />
              ) : (
                <div className="bg-glass rounded-[2rem] shadow-xl overflow-hidden border border-white/50 flex flex-col hover:shadow-2xl transition-all group">
                  <div className="h-48 bg-teal-50 flex items-center justify-center text-teal-600">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{lesson.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-8">{lesson.description}</p>
                    <a
                      href={lesson.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-teal-600/20"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      فتح المذكرة
                    </a>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const VideoPlayerPage: React.FC = () => {
  const { levelId, lessonId } = useParams<{ levelId: string; lessonId: string }>();
  const { levels } = useContentStore();
  const level = levels.find(l => l.id === levelId);
  const lesson = level?.lessons?.find(les => les.id === lessonId);

  if (!level || !lesson) return <div className="p-20 text-center font-bold text-2xl">الدرس غير موجود.</div>;

  return (
    <div className="min-h-screen pb-32 relative z-10">
      <div className="science-gradient pt-32 pb-12 text-white text-center px-4">
        <Link to={`/level/${levelId}/courses`} className="inline-block bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all mb-4">
          ← العودة للفيديوهات
        </Link>
        <h1 className="text-4xl font-extrabold mb-4">{lesson.title}</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <VideoLessonCard lesson={lesson} levelId={level.id} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative bg-slate-50">
        <ScienceBackground />
        <Navbar />
        <main className="flex-grow">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/level/:levelId/courses" element={<CoursesPage />} />
              <Route path="/level/:levelId/videos/:lessonId" element={<VideoPlayerPage />} />
              <Route path="/level/:levelId/videos" element={<ContentPage type="videos" />} />
              <Route path="/level/:levelId/notes" element={<ContentPage type="notes" />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/exams" element={<AdminExams />} />
              <Route path="/admin/exam-results" element={<AdminExamResults />} />
              <Route path="/exams" element={<StudentExams />} />
              <Route path="/exam/:examId" element={<StudentExamPage />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/admin/students" element={<StudentManagement />} />
            </Routes>
          </ErrorBoundary>
        </main>

        <footer className="bg-gray-900 text-gray-400 py-20 px-4 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-right">
            <div>
              <h3 className="text-white text-2xl font-extrabold mb-4">الأستاذة صفاء إسماعيل</h3>
              <p className="text-lg">رحلتك نحو التميز في مادة العلوم تبدأ من هنا.</p>
            </div>
            <div className="flex justify-center gap-6">
              <a href="https://www.facebook.com/share/16t9uVs1Q1/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all" title="فيسبوك">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://youtube.com/@safaaesmail7729?si=7Pw4o4EbbIpmhgAc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all" title="يوتيوب">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://wa.me/201222966617" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all" title="واتساب">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة الأستاذة صفاء إسماعيل التعليمية
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
