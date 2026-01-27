import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  // 1. 행운 번호 생성 로직
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

  // --- 스타일 및 클래스 ---
  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500";
  
  const glitterButtonStyle = {
    background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)',
    backgroundSize: '400% 400%',
    animation: isSpinning ? 'none' : 'glimmer 3s ease infinite',
  };

  const tabClass = (id) => `
    flex-1 py-4 text-sm font-black transition-all relative
    ${activeTab === id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}
  `;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden">
      <style>{`
        @keyframes glimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 상단 네비게이션 헤더 */}
      <header className="w-full max-w-[400px] bg-[#f8fafc] sticky top-0 z-50">
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        </div>
        
        {/* 탭 네비게이션 */}
        <nav className="flex bg-white/70 backdrop-blur-md border-b border-slate-100">
          <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>
            로또 번호
            {activeTab === 'lotto' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>
            해몽
            {activeTab === 'dream' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>
            띠별 행운
            {activeTab === 'guide' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}
          </button>
        </nav>
      </header>

      {/* 메인 섹션 */}
      <main className="w-full flex flex-col items-center px-6 py-12">
        {activeTab === 'lotto' && (
          <div className={cardClass}>
            <div className="text-center mb-10">
              <span className="text-4xl mb-3 block animate-pulse">✨</span>
              <h2 className="text-xl font-black text-slate-800">당신의 운을 믿으세요</h2>
              <p className="text-slate-400 text-xs mt-2">오늘 당신에게 찾아온 특별한 숫자</p>
            </div>
            
            <div className="flex justify-center gap-2 mb-12 h-10 items-center">
              {numbers.length > 0 ? numbers.map((num, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">
                  {num}
                </div>
              )) : (
                <div className="text-slate-300 text-sm font-bold tracking-widest animate-pulse">LUCKY NUMBERS</div>
              )}
            </div>

            <button 
              onClick={generateNumbers}
              disabled={isSpinning}
              style={glitterButtonStyle}
              className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg transition-all active:scale-95 shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
            </button>

            {numbers.length > 0 && (
              <div className="flex justify-center gap-6 mt-10">
                <button onClick={shareKakao} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-yellow-600 transition-colors">
                  <span>💬</span> 카톡 공유
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText(numbers.join(', '));
                  alert('행운의 숫자가 복사되었습니다! 🍀');
                }} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-yellow-600 transition-colors">
                  <span>📋</span> 번호 복사
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"혹시 이런 꿈을 꾸셨나요?"</h2>
            <div className="space-y-4 text-sm text-slate-600">
              <section className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1">👴 조상님 꿈</h3>
                <p className="text-xs leading-relaxed">조상님이 밝게 웃으며 물건을 건네주었다면 재물운이 최고조에 달한 징조입니다.</p>
              </section>
              <section className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1">💩 오물(똥) 꿈</h3>
                <p className="text-xs leading-relaxed">온몸이 흠뻑 젖을 정도라면 더할 나위 없는 대박 징조! 행운을 놓치지 마세요.</p>
              </section>
              <section className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1">🔥 불이 나는 꿈</h3>
                <p className="text-xs leading-relaxed">활활 타오르는 불꽃은 당신의 운세가 걷잡을 수 없이 번창할 것임을 뜻합니다.</p>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"띠별 행운의 포인트"</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm mb-6">
              <table className="w-full text-xs text-center border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-tighter">
                  <tr><th className="p-4">띠별 그룹</th><th className="p-4">숫자</th><th className="p-4">컬러</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  <tr><td className="p-4 font-bold">쥐/용/원숭이</td><td className="p-4">1, 6</td><td className="p-4 font-black text-blue-500">BLUE</td></tr>
                  <tr><td className="p-4 font-bold">소/뱀/닭</td><td className="p-4">2, 7</td><td className="p-4 font-black text-red-500">RED</td></tr>
                  <tr><td className="p-4 font-bold">호랑이/말/개</td><td className="p-4">3, 8</td><td className="p-4 font-black text-green-600">GREEN</td></tr>
                  <tr><td className="p-4 font-bold">토끼/양/돼지</td><td className="p-4">4, 9</td><td className="p-4 font-black text-slate-400 text-[10px]">WHITE</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed font-bold tracking-tight px-4">
              오늘 나와 공명하는 컬러 아이템을 챙기면<br/>잠재된 행운의 에너지가 더욱 깨어납니다.
            </p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-[360px] py-16 px-6 text-center">
        <p className="text-[10px] text-slate-300 font-black tracking-[0.2em] uppercase">Premium Fortune Guide</p>
        <p className="text-[10px] text-slate-300 mt-2">© 2026 LUCKY GUIDE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;