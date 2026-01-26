import React, { useState } from 'react';
import './index.css'; 
import Lotto from './components/Lotto';

function App() {
  const [view, setView] = useState('main');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {view === 'main' ? (
        <div className="w-full max-w-sm space-y-4 animate-in fade-in">
          <div className="text-center mb-10 px-4">
            <h1 className="text-3xl font-black text-indigo-600 mb-2">🍀 럭키 가이드</h1>
            <p className="text-slate-400 font-medium tracking-tight">오늘 당신의 행운을 지금 확인하세요</p>
          </div>
          
          {/* 1. 로또 버튼 */}
          <button onClick={() => setView('lotto')} className="w-full bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🔮</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">로또 번호 추첨</h3>
              <p className="text-slate-400 text-xs">행운의 6개 번호</p>
            </div>
          </button>

          {/* 2. 관상 버튼 (복구) */}
          <button className="w-full bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 opacity-70 hover:shadow-md transition-all group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🎭</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">AI 관상 분석</h3>
              <p className="text-indigo-500 text-xs font-semibold">준비 중...</p>
            </div>
          </button>

          {/* 3. 손금 버튼 (분리) */}
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
    </div>
  );
}

export default App;