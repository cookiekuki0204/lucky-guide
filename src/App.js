import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // 다크모드 상태
  const cardRef = useRef(null);

  // 다크모드 토글 함수
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // 기능 로직
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

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', 
        scale: 2 
      });
      const link = document.createElement('a');
      link.download = `lucky-numbers-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('이미지 저장 실패:', err); }
  };

  const shareKakao = () => {
    if (!window.Kakao) return;
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) kakao.init('8ee405ddc4c4db04b8de8268a8317426'); 
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: numbers.length > 0 ? `🍀 내 행운 번호: ${numbers.join(', ')}` : '🍀 오늘 내 운은 어떨까?',
        description: '럭키가이드에서 행운을 확인하세요!',
        imageUrl: 'https://lucky-guide.pages.dev/og-image.png',
        link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' },
      },
    });
  };

  // 스타일 정의 (다크모드 대응)
  const bgClass = isDarkMode ? "bg-slate-900 text-slate-100" : "bg-[#f8fafc] text-slate-800";
  const headerClass = isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-100";
  const cardContentClass = isDarkMode ? "bg-slate-800 text-slate-100" : "bg-white text-slate-800";
  const tabClass = (id) => `
    flex-none md:flex-1 px-5 md:px-2 py-4 text-[11px] md:text-[13px] font-black transition-all relative whitespace-nowrap text-center
    ${activeTab === id ? (isDarkMode ? 'text-yellow-400' : 'text-slate-900') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}
  `;

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center font-sans overflow-x-hidden relative transition-colors duration-300`}>
      <style>{`
        @keyframes glimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 헤더 & 우상단 다크모드 버튼 */}
      <header className={`w-full max-w-[400px] md:max-w-[700px] sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900' : 'bg-[#f8fafc]'}`}>
        <div className="relative pt-12 pb-4 text-center">
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LUCKY GUIDE</h1>
          {/* 다크모드 토글 버튼 */}
          <button 
            onClick={toggleDarkMode}
            className="absolute right-4 top-12 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:scale-110 transition-transform"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        <nav className={`flex backdrop-blur-md border-b overflow-x-auto md:overflow-x-visible no-scrollbar touch-pan-x ${headerClass}`}>
          <div className="flex min-w-full md:min-w-0 md:w-full items-center justify-start md:justify-center px-2">
            <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>로또번호추첨기{activeTab === 'lotto' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
            <button onClick={() => setActiveTab('saju')} className={tabClass('saju')}>AI사주{activeTab === 'saju' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
            <button onClick={() => setActiveTab('face')} className={tabClass('face')}>AI관상{activeTab === 'face' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
            <button onClick={() => setActiveTab('palm')} className={tabClass('palm')}>AI손금{activeTab === 'palm' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
            <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>대박꿈해몽{activeTab === 'dream' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
            <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>띠별운세{activeTab === 'guide' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
          </div>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-12 pb-32">
        {/* 콘텐츠 영역 (카드 배경색 다크모드 적용) */}
        <div ref={cardRef} className={`w-full max-w-[360px] p-8 rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500 ${cardContentClass}`}>
          {activeTab === 'lotto' && (
            <div className="flex flex-col items-center w-full">
              <div className="text-center mb-10">
                <span className="text-4xl mb-3 block animate-bounce">✨</span>
                <h2 className="text-xl font-black italic">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[10px] mt-2 font-bold tracking-widest uppercase">Lucky Guide Premium</p>
              </div>
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">{num}</div>
                )) : <div className="text-slate-400 text-sm font-bold tracking-widest uppercase italic tracking-widest opacity-50">Ready to Luck</div>}
              </div>
              <button onClick={generateNumbers} disabled={isSpinning}
                style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite' }}
                className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}>
                {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
              </button>
            </div>
          )}

          {activeTab === 'saju' && <div className="text-center py-10"><span className="text-5xl mb-6 block">🎎</span><h2 className="text-xl font-black mb-2 italic">타고난 운명, 사주풀이</h2><p className="text-slate-400 text-xs mb-8">Coming Soon</p></div>}
          {activeTab === 'face' && <div className="text-center py-10"><span className="text-5xl mb-6 block">🎭</span><h2 className="text-xl font-black mb-2 italic">재벌이 될 상인가?</h2><p className="text-slate-400 text-xs mb-8">Coming Soon</p></div>}
          {activeTab === 'palm' && <div className="text-center py-10"><span className="text-5xl mb-6 block">✋</span><h2 className="text-xl font-black mb-2 italic">손바닥 보물지도</h2><p className="text-slate-400 text-xs mb-8">Coming Soon</p></div>}
          
          {activeTab === 'dream' && (
            <div>
              <h2 className="text-xl font-black mb-8 text-center italic">로또 당첨 길몽 10선</h2>
              <div className="space-y-4 text-[11px] max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar font-medium">
                {[{t: "연예인 방문", d: "귀인을 만날 징조"}, {t: "대통령과 악수", d: "명예와 횡재수"}, {t: "조상님의 미소", d: "집안의 경사"}].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    <h3 className={`font-black mb-1 italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{i+1}. {item.t}</h3><p>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div>
              <h2 className="text-xl font-black mb-8 text-center italic">12간지 행운 포인트</h2>
              <div className={`overflow-hidden rounded-3xl border shadow-sm ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <table className="w-full text-[10px] text-center border-collapse font-medium">
                  <thead className={isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-50 text-slate-400'}><tr><th className="p-3">띠별</th><th className="p-3">숫자</th><th className="p-3">컬러</th></tr></thead>
                  <tbody className={`divide-y italic ${isDarkMode ? 'divide-slate-700 text-slate-300' : 'divide-slate-50 text-slate-700'}`}>
                    <tr><td className="p-3">쥐/용/원숭이</td><td className="p-3">1, 6</td><td className="p-3 text-blue-500 font-black">BLUE</td></tr>
                    <tr><td className="p-3">소/뱀/닭</td><td className="p-3">2, 7</td><td className="p-3 text-red-500 font-black">RED</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼들 (카드 밖으로 배치) */}
        {activeTab === 'lotto' && numbers.length > 0 && (
          <div className="flex justify-center gap-6 mt-10">
            <button onClick={downloadImage} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600"><span className="text-xl">💾</span>이미지 저장</button>
            <button onClick={shareKakao} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600"><span className="text-xl">💬</span>카톡 공유</button>
            <button onClick={() => { navigator.clipboard.writeText(numbers.join(', ')); alert('복사되었습니다! 🍀'); }} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600"><span className="text-xl">📋</span>번호 복사</button>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className={`w-full max-w-[360px] py-16 px-6 text-center border-t mt-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
        <div className="flex justify-center gap-4 mb-4 text-[10px] font-bold text-slate-400">
          <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-yellow-600 underline decoration-slate-200 italic">개인정보처리방침</button>
          <span>|</span>
          <span className="opacity-50">© 2026 LUCKY GUIDE</span>
        </div>
      </footer>

      {/* 개인정보 모달 (다크모드 적용) */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsPrivacyOpen(false)}>
          <div className={`${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-500'} w-full max-w-[320px] max-h-[70vh] overflow-y-auto rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 text-left`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-black mb-6 italic border-b pb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>개인정보처리방침</h3>
            <div className="text-[11px] leading-relaxed space-y-5 font-medium">
              <section><p className={`font-bold mb-1 italic ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>1. 개인정보 수집 미실시</p><p>본 서비스는 개인정보를 서버에 저장하지 않습니다.</p></section>
              <section><p className={`font-bold mb-1 italic ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>2. 구글 애드센스 정책</p><p>맞춤 광고를 위해 쿠키 정보가 활용될 수 있습니다.</p></section>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className={`w-full mt-10 py-4 rounded-2xl font-bold text-xs ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white'}`}>확인 완료</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;