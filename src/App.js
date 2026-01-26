import React, { useState, useEffect } from 'react';
import Privacy from './Privacy'; 
import './index.css'; 
import Lotto from './components/Lotto';

function App() {
  const [view, setView] = useState('main');
  const [fortune, setFortune] = useState('');

  // 사주 기반 오늘의 운세 데이터 (텍스트 보강용)
  const fortuneList = [
    "오늘은 금전운이 북쪽에서 들어오는 날입니다. 차분한 마음으로 번호를 고르세요.",
    "밝은 노란색이 행운을 불러옵니다. 주위의 밝은 기운을 모아 번호를 생성해보세요.",
    "기다리던 소식이 들려올 수 있는 길조가 보입니다. 직감을 믿고 번호를 선택하세요.",
    "오늘은 인내심이 필요한 날입니다. 서두르지 말고 천천히 행운을 기다려보세요.",
    "주변 사람과의 화합이 행운의 열쇠입니다. 함께 번호를 공유해보는 것도 좋습니다."
  ];

  useEffect(() => {
    // 매일 새로운 운세를 보여주기 위한 로직
    const today = new Date().getDate();
    setFortune(fortuneList[today % fortuneList.length]);
  }, []);

  if (view === 'privacy') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button onClick={() => setView('main')} className="mb-6 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-sm font-bold transition-colors">← 돌아가기</button>
          <div className="bg-white rounded-3xl shadow-xl p-4"><Privacy /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {view === 'main' ? (
        <div className="w-full max-w-sm space-y-4 animate-in fade-in">
          <div className="text-center mb-8 px-4">
            <h1 className="text-3xl font-black text-indigo-600 mb-2">🍀 럭키 가이드</h1>
            <p className="text-slate-400 font-medium tracking-tight">오늘 당신의 행운을 지금 확인하세요</p>
          </div>
          
          {/* 오늘의 운세 카드 (텍스트 콘텐츠 보강) */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[1.5rem] shadow-lg text-white mb-6">
            <h3 className="text-xs font-bold opacity-80 mb-2 uppercase tracking-widest">오늘의 사주 운세</h3>
            <p className="text-lg font-medium leading-relaxed italic">"{fortune}"</p>
          </div>
          
          <button onClick={() => setView('lotto')} className="w-full bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
            <span className="text-4xl group-hover:scale-110 transition-transform">🔮</span>
            <div className="text-left">
              <h3 className="font-bold text-slate-800">로또 번호 추첨</h3>
              <p className="text-slate-400 text-xs">사주 기운을 담은 6개 번호</p>
            </div>
          </button>

          {/* 정보성 텍스트 영역 (구글 봇을 위한 장치) */}
          <div className="p-4 text-[11px] text-slate-400 leading-normal bg-slate-100/50 rounded-xl">
            <p className="font-bold mb-1 text-slate-500">💡 행운 가이드</p>
            로또 당첨 확률을 높이기 위해서는 균형 잡힌 번호 조합이 중요합니다. 럭키 가이드는 고유의 알고리즘과 오늘의 사주 기운을 분석하여 사용자에게 최적의 번호를 제안합니다. 매일 오전 9시 이후 새로운 운세를 확인하세요.
          </div>

          {/* 준비 중 메뉴는 하단에 작게 배치 */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white/50 p-3 rounded-xl border border-slate-100 text-center opacity-60">
              <p className="text-[10px] font-bold text-slate-400">AI 관상 (준비중)</p>
            </div>
            <div className="flex-1 bg-white/50 p-3 rounded-xl border border-slate-100 text-center opacity-60">
              <p className="text-[10px] font-bold text-slate-400">AI 손금 (준비중)</p>
            </div>
          </div>
        </div>
      ) : (
        <Lotto onBack={() => setView('main')} />
      )}

      {/* 광고 영역 */}
      <div className="mt-8 w-full max-w-sm px-4">
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-300 font-bold text-[10px] tracking-widest uppercase">
          AD : Google AdSense
        </div>
      </div>

      <footer className='mt-10 mb-5 text-center'>
        <button onClick={() => setView('privacy')} className='text-xs text-gray-400 underline hover:text-gray-600 transition-colors'>개인정보처리방침</button>
        <p className="text-[10px] text-gray-300 mt-3 tracking-wider font-medium uppercase">© 2026 LUCKY GUIDE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;