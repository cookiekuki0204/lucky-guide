import React, { useState } from 'react';
import Privacy from './Privacy'; 
import './index.css'; 
import Lotto from './components/Lotto';

function App() {
  // 'main', 'lotto', 'privacy' 세 가지 상태를 가집니다.
  const [view, setView] = useState('main');

  // 1. 개인정보처리방침 화면
  if (view === 'privacy') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button 
            onClick={() => setView('main')} 
            className="mb-6 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-sm font-bold transition-colors"
          >
            ← 돌아가기
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-4">
            <Privacy />
          </div>
        </div>
      </div>
    );
  }

  // 2. 로또 또는 메인 메뉴 화면
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {view === 'main' ? (
        <div className="w-full max-w-sm space-y-4 animate-in fade-in">
          <div className="text-center mb-10 px-4">
            <h1 className="text-3xl font-black text-indigo-600 mb-2">🍀 럭키 가이드</h1>
            <p className="text-slate-400 font-medium tracking-tight">오늘 당신의 행운을 지금 확인하세요</p>
          </div>
          
          <button onClick={() => setView('lotto')} className="w-full bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🔮</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">로또 번호 추첨</h3>
              <p className="text-slate-400 text-xs">행운의 6개 번호</p>
            </div>
          </button>

          <button className="w-full bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 opacity-70 hover:shadow-md transition-all group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🎭</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">AI 관상 분석</h3>
              <p className="text-indigo-500 text-xs font-semibold">준비 중...</p>
            </div>
          </button>

          <button className="w-full bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 opacity-70 hover:shadow-md transition-all group">
            <span className="text-4xl group-hover:scale-110 transition-transform">✋</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">AI 손금 분석</h3>
              <p className="text-indigo-500 text-xs font-semibold">준비 중...</p>
            </div>
          </button>
        </div>
      ) : (
        <Lotto onBack={() => setView('main')} />
      )}

      {/* 광고 영역 */}
      <div className="mt-12 w-full max-w-sm px-4">
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-300 font-bold text-xs tracking-widest uppercase">
          AD : Google AdSense
        </div>
      </div>

      {/* 푸터 영역: 링크 클릭 시 view를 'privacy'로 바꿉니다. */}
      <footer className='mt-10 mb-5 text-center'>
        <button 
          onClick={() => setView('privacy')} 
          className='text-xs text-gray-400 underline hover:text-gray-600 transition-colors'
        >
          개인정보처리방침
        </button>
      </footer>
    </div>
  );
}

export default App;