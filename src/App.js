import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  // 1. 로또 번호 생성
  const generateNumbers = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const newNumbers = [];
      while (newNumbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!newNumbers.includes(num)) newNumbers.push(num);
      }
      setNumbers(newNumbers.sort((a, b) => a - b));
      setIsSpinning(false);
    }, 1000);
  };

  // 2. 카카오톡 공유
  const shareKakao = () => {
    if (!window.Kakao) return;
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) kakao.init('YOUR_KAKAO_JS_KEY');

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: numbers.length > 0 ? `🍀 내 행운 번호: ${numbers.join(', ')}` : '🍀 오늘 내 운은 어떨까?',
        description: '당신의 운을 믿고 행운을 잡아보세요!',
        imageUrl: 'https://lucky-guide.pages.dev/og-image.png',
        link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' },
      },
    });
  };

  // 스타일 정의
  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in duration-500";
  
  const glitterButtonStyle = {
    background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)',
    backgroundSize: '400% 400%',
    animation: isSpinning ? 'none' : 'glimmer 3s ease infinite',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden">
      <style>{`
        @keyframes glimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 헤더 */}
      <header className="w-full max-w-[360px] pt-12 pb-8 px-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        <div className="w-12 h-1 bg-yellow-500 mt-2 rounded-full"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="w-full flex flex-col items-center px-6 pb-40">
        {activeTab === 'lotto' && (
          <div className={cardClass}>
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">✨</span>
              <h2 className="text-xl font-black text-slate-800">당신의 운을 믿으세요</h2>
              <p className="text-slate-400 text-xs mt-1">오늘 당신에게 찾아온 행운의 번호</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-10 h-10 items-center">
              {numbers.length > 0 ? numbers.map((num, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg transform scale-110">
                  {num}
                </div>
              )) : (
                <div className="text-slate-300 text-sm font-medium">행운을 불러오는 중...</div>
              )}
            </div>

            <button 
              onClick={generateNumbers}
              disabled={isSpinning}
              style={glitterButtonStyle}
              className={`w-full py-4 rounded-2xl font-black text-slate-900 transition-all active:scale-95 shadow-lg shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}
            >
              {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
            </button>

            {numbers.length > 0 && (
              <div className="flex justify-center gap-4 mt-8">
                <button onClick={shareKakao} className="text-xs font-bold text-slate-400 hover:text-yellow-600">💬 카톡 공유</button>
                <button onClick={() => {
                  navigator.clipboard.writeText(numbers.join(', '));
                  alert('행운이 복사되었습니다!');
                }} className="text-xs font-bold text-slate-400 hover:text-yellow-600">📋 번호 복사</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">🌙 꿈해몽 대박 징조</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <section className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500">
                <h3 className="font-bold text-slate-800 mb-1 italic text-center">"조상님 꿈"</h3>
                <p className="text-xs leading-relaxed">조상님이 밝게 웃으시는 모습은 아주 강한 재물운을 상징합니다.</p>
              </section>
              <section className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500">
                <h3 className="font-bold text-slate-800 mb-1 italic text-center">"오물(똥) 꿈"</h3>
                <p className="text-xs leading-relaxed">현실에선 싫지만, 꿈에서 온몸이 젖는다면 대박이 터질 징조입니다.</p>
              </section>
              <section className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500">
                <h3 className="font-bold text-slate-800 mb-1 italic text-center">"불이 나는 꿈"</h3>
                <p className="text-xs leading-relaxed">집이 활활 타오르는 강한 불길은 재산이 급격히 늘어날 기운입니다.</p>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={cardClass}>
            <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">📅 띠별 행운 포인트</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-100 mb-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold text-center">
                  <tr><th className="p-3">띠</th><th className="p-3">숫자</th><th className="p-3">컬러</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 text-center">
                  <tr><td className="p-3 font-bold">쥐/용/원숭이</td><td className="p-3">1, 6</td><td className="p-3 font-medium text-blue-500">블루</td></tr>
                  <tr><td className="p-3 font-bold">소/뱀/닭</td><td className="p-3">2, 7</td><td className="p-3 font-medium text-red-500">레드</td></tr>
                  <tr><td className="p-3 font-bold">호랑이/말/개</td><td className="p-3">3, 8</td><td className="p-3 font-medium text-green-500">그린</td></tr>
                  <tr><td className="p-3 font-bold">토끼/양/돼지</td><td className="p-3">4, 9</td><td className="p-3 font-medium text-slate-400">화이트</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium italic">"나와 맞는 행운의 아이템을 지녀보세요."</p>
          </div>
        )}
      </main>

      {/* 하단 네비게이션 (위치 조정: bottom-12) */}
      <nav className="fixed bottom-12 z-50 bg-slate-900/95 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl flex gap-10 border border-white/10">
        <button onClick={() => setActiveTab('lotto')} className={`flex flex-col items-center transition-all ${activeTab === 'lotto' ? 'scale-110' : 'opacity-30'}`}>
          <span className="text-xl">🍀</span>
          <span className="text-[10px] text-white font-bold mt-1">추첨</span>
        </button>
        <button onClick={() => setActiveTab('dream')} className={`flex flex-col items-center transition-all ${activeTab === 'dream' ? 'scale-110' : 'opacity-30'}`}>
          <span className="text-xl">🌙</span>
          <span className="text-[10px] text-white font-bold mt-1">해몽</span>
        </button>
        <button onClick={() => setActiveTab('guide')} className={`flex flex-col items-center transition-all ${activeTab === 'guide' ? 'scale-110' : 'opacity-30'}`}>
          <span className="text-xl">📅</span>
          <span className="text-[10px] text-white font-bold mt-1">띠</span>
        </button>
      </nav>

      <footer className="w-full max-w-[360px] py-10 px-6 text-center">
        <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">Premium Fortune Guide</p>
        <p className="text-[10px] text-slate-300 mt-1">© 2026 LUCKY GUIDE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;