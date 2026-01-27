import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const cardRef = useRef(null); // 이미지 저장을 위한 참조

  // 1. 행운 번호 생성
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

  // 2. 이미지 다운로드 기능 추가
  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2, // 고화질 저장
      });
      const link = document.createElement('a');
      link.download = `lucky-numbers-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('이미지 저장 실패:', err);
    }
  };

  // 3. 카카오톡 공유
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

  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500";
  const tabClass = (id) => `flex-1 py-4 text-sm font-black transition-all relative ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden">
      <style>{`
        @keyframes glimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* 헤더 & 네비게이션 */}
      <header className="w-full max-w-[400px] bg-[#f8fafc] sticky top-0 z-50">
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        </div>
        <nav className="flex bg-white/70 backdrop-blur-md border-b border-slate-100">
          <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>로또번호{activeTab === 'lotto' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>해몽{activeTab === 'dream' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>띠별행운{activeTab === 'guide' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-12">
        {activeTab === 'lotto' && (
          <div className="flex flex-col items-center w-full">
            {/* 저장될 영역: cardRef 연결 */}
            <div ref={cardRef} className={cardClass}>
              <div className="text-center mb-10">
                <span className="text-4xl mb-3 block">✨</span>
                <h2 className="text-xl font-black text-slate-800">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[10px] mt-2 tracking-widest uppercase">Lucky Guide Premium</p>
              </div>
              
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">
                    {num}
                  </div>
                )) : <div className="text-slate-200 text-sm font-bold tracking-widest">LUCKY NUMBERS</div>}
              </div>

              <button 
                onClick={generateNumbers}
                disabled={isSpinning}
                style={{
                  background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)',
                  backgroundSize: '400% 400%',
                  animation: isSpinning ? 'none' : 'glimmer 3s ease infinite',
                }}
                className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg transition-all active:scale-95 shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}
              >
                {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
              </button>
            </div>

            {/* 하단 보조 버튼들 */}
            {numbers.length > 0 && (
              <div className="flex justify-center gap-6 mt-10">
                <button onClick={downloadImage} className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-yellow-600">
                  <span className="text-lg">💾</span> 이미지 저장
                </button>
                <button onClick={shareKakao} className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-yellow-600">
                  <span className="text-lg">💬</span> 카톡 공유
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText(numbers.join(', '));
                  alert('행운의 숫자가 복사되었습니다! 🍀');
                }} className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-yellow-600">
                  <span className="text-lg">📋</span> 번호 복사
                </button>
              </div>
            )}
          </div>
        )}

        {/* 해몽 탭과 포인트 탭은 이전과 동일 (코드 생략 방지를 위해 포함) */}
        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"혹시 이런 꿈을 꾸셨나요?"</h2>
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1">👴 조상님 꿈</h3>
                <p>밝은 표정의 조상님은 강력한 재물운을 상징합니다.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1">💩 오물(똥) 꿈</h3>
                <p>온몸이 흠뻑 젖을 정도라면 더할 나위 없는 대박 징조입니다.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"띠별 행운 포인트"</h2>
            <table className="w-full text-xs text-center border-collapse">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                <tr><th className="p-4">띠별 그룹</th><th className="p-4">숫자</th><th className="p-4">컬러</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                <tr><td className="p-4 font-bold">쥐/용/원숭이</td><td className="p-4">1, 6</td><td className="p-4 text-blue-500 font-bold">BLUE</td></tr>
                <tr><td className="p-4 font-bold">소/뱀/닭</td><td className="p-4">2, 7</td><td className="p-4 text-red-500 font-bold">RED</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="py-16 text-[10px] text-slate-300 font-black tracking-widest uppercase">© 2026 LUCKY GUIDE</footer>
    </div>
  );
}

export default App;