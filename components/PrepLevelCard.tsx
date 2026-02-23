
import React from 'react';
import { Link } from 'react-router-dom';
import { PrepData } from '../types';

interface Props {
  data: PrepData;
}

const PrepLevelCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-sky-600 shadow-sm">
          {data.title}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{data.titleAr}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow">{data.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/level/${data.id}/courses`}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white transition-all group/btn"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v8h12V6H4zm3 2l5 2-5 2V8z"></path></svg>
            <span className="text-xs font-bold">الفيديوهات</span>
          </Link>
          <Link
            to={`/level/${data.id}/notes`}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-all"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
            <span className="text-xs font-bold">مذكرة الشرح</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrepLevelCard;
