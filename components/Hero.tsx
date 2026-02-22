
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-32 z-10 bg-transparent">
      {/* Soft Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-sky-100 rounded-full blur-[100px] opacity-40"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] bg-teal-100 rounded-full blur-[100px] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="text-right lg:col-span-7">
            <h1 className="text-5xl tracking-tight font-black text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block mb-2">تعلم الرياضيات بمتعة مع الأستاذ</span>
              <span className="block text-sky-600">عمرو محسن</span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-2xl lg:ml-0 lg:mr-auto">
              منصة تعليمية متكاملة لطلاب المرحلة الإعدادية. شروحات مبسطة، فيديوهات تفاعلية، ومذكرات شاملة لكل درس.            </p>
            <div className="mt-12 flex flex-wrap gap-6 justify-center">
              <a href="https://wa.me/201211143632" className="px-12 py-5 border-2 border-sky-100 text-xl font-bold rounded-2xl text-sky-700 bg-white/50 backdrop-blur-sm hover:bg-sky-50 transition-all">
                تواصل معنا
              </a>
            </div>
          </div>
          <div className="mt-16 lg:mt-0 lg:col-span-5 relative">
            <div className="relative mx-auto w-full rounded-[3rem] shadow-2xl overflow-hidden ring-12 ring-white/50 backdrop-blur-sm">
              <img
                className="w-full object-cover aspect-[4/5]"
                src="sections/logo2.jpeg"
                alt="Science Learning"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent"></div>
            </div>
            {/* Floating Element */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl animate-science-float hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl">🧪</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">فيديوهات تفاعلية</div>
                  <div className="text-xs text-gray-500">فهم كل درس بسهولة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
