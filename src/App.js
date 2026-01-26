import React, { useState, useEffect } from 'react';
import Privacy from './Privacy'; 
import './index.css'; 
import Lotto from './components/Lotto';

function App() {
  const [view, setView] = useState('main');
  const [fortune, setFortune] = useState('');

  useEffect(() => {
    const fortuneList = [
      "오늘은 금전운이 북쪽에서 들어오는 날입니다.\n차분한 마음으로 번호를 고르세요.",
      "밝은 노란색이 행운을 불러옵니다.\n주위의 밝은 기운을 모아 번호를 생성해보세요.",
      "기다리던 소식이 들려올 수 있는 길조가 보입니다.\n직감을 믿고 번호를 선택하세요.",
      "오늘은 인내심이 필요한 날입니다.\n서두르지 말고 천천히 행운을 기다려보세요.",
      "주변 사람과의 화합이 행운의 열쇠입니다.\n함께 번호를 공유해보는 것도 좋습니다."
    ];
    const today = new Date().getDate();
    setFortune(fortuneList[today % fortuneList.length]);
  }, []);

  if (view === 'privacy') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-2xl">
          <button onClick={() => setView('main')} className="mb-6 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 text-sm font-bold transition-all active:scale-95">← 돌아가기</button>
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8"><Privacy /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900 leading-relaxed">
      {view === 'main' ? (
        <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-indigo-600 mb-3 tracking-tight">🍀 럭키가이드</h1>
            <p className="text-slate-400 font-medium text-sm">오늘 당신의 행운을 지금 확인하세요</p>
          </div>
          
          {/* 운세 카드: 가독성 및 정렬 개선 */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] shadow-2xl shadow-indigo-200 text-white text-center">
            <h3 className="text-[10px] font-bold opacity-70 mb-4 uppercase tracking-[0.2em]">오늘의 사주 운세</h3>
            <p className="text-lg font-bold leading-snug whitespace-pre-line break-keep">
              "{fortune}"
            </p>
          </div>
          
          <button onClick={() => setView('lotto')} className="w-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all group active:scale-95">
            <div className="flex items-center gap-5 text-left">
              <span className="text-4xl group-hover:rotate-12 transition-transform">🔮</span>
              <div>
                <h3 className="font-bold text-lg text-slate-800">로또 번호 추첨</h3>
                <p className="text-slate-400 text-xs mt-0.5">사주 기운을 담은 6개 번호</p>
              </div>
            </div>
            <span className="text-slate-300 font-bold ml-2">→</span>
          </button>

          {/* 정보성 텍스트 보강 */}
          <div className="px-6 py-5 bg-slate-100/80 rounded-[1.5rem] border border-slate-200/50">
            <p className="text-[11px] font-bold mb-2 text-slate-500 flex items-center gap-1.5">
              <span className="text-sm">💡</span> 행운 가이드
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed break-keep opacity-80">
              럭키 가이드는 단순 무작위가 아닌 고유 알고리즘과 사주 기운을 결합해 번호를 제안합니다. 매일 오전 9시, 새로운 기운으로 번호를 생성해 보세요.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-white/40 p-4 rounded-[1.2rem] border border-slate-200/50 text-center">
              <p className="text-[10px] font-bold text-slate-400">AI 관상 <span className="text-[8px] block opacity-50 uppercase">Coming Soon</span></p>
            </div>
            <div className="flex-1 bg-white/40 p-4 rounded-[1.2rem] border border-slate-200/50 text-center">
              <p className="text-[10px] font-bold text-slate-400">AI 손금 <span className="text-[8px] block opacity-50 uppercase">Coming Soon</span></p>
            </div>
          </div>
        </div>
      ) : (
        <Lotto onBack={() => setView('main')} />
      )}

      {/* 광고 영역 */}
      <div className="mt-12 w-full max-w-sm px-2">
        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[1.5rem] py-8 text-center text-slate-300 font-bold text-[9px] tracking-[0.2em] uppercase">
          AD : Google AdSense
        </div>
      </div>

      <footer className='mt-12 mb-6 text-center space-y-4'>
        <button onClick={() => setView('privacy')} className='text-[10px] text-slate-400 underline hover:text-indigo-500 transition-colors font-medium'>개인정보처리방침</button>
        <p className="text-[9px] text-slate-300 tracking-[0.15em] font-semibold uppercase">© 2026 LUCKY GUIDE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;