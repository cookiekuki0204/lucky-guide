import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const cardRef = useRef(null);

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

  // 2. 이미지 다운로드 기능
  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#f8fafc', scale: 2 });
      const link = document.createElement('a');
      link.download = `lucky-numbers-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('이미지 저장 실패:', err); }
  };

  // 3. 카카오톡 공유 기능 (확실히 포함!)
  const shareKakao = () => {
    if (!window.Kakao) return;
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init('8ee405ddc4c4db04b8de8268a8317426'); // 여기에 발급받으신 JS 키를 넣어주세요.
    }
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

  // 스타일 정의
  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500";
  const tabClass = (id) => `flex-1 py-4 text-[11px] font-black transition-all relative ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden relative">
      <style>{`@keyframes glimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>

      {/* 헤더 & 네비게이션 */}
      <header className="w-full max-w-[400px] bg-[#f8fafc] sticky top-0 z-40">
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        </div>
        <nav className="flex bg-white/70 backdrop-blur-md border-b border-slate-100">
          <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>로또번호추첨기{activeTab === 'lotto' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>대박꿈해몽{activeTab === 'dream' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>띠별운세{activeTab === 'guide' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-12">
        {activeTab === 'lotto' && (
          <div className="flex flex-col items-center w-full">
            <div ref={cardRef} className={cardClass}>
              <div className="text-center mb-10 text-slate-800">
                <span className="text-4xl mb-3 block animate-bounce">✨</span>
                <h2 className="text-xl font-black">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[10px] mt-2 uppercase font-bold tracking-widest">Lucky Guide Premium</p>
              </div>
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">{num}</div>
                )) : <div className="text-slate-200 text-sm font-bold tracking-widest uppercase tracking-widest">LUCKY NUMBERS</div>}
              </div>
              <button onClick={generateNumbers} disabled={isSpinning}
                style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite' }}
                className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}>
                {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
              </button>
            </div>
            {numbers.length > 0 && (
              <div className="flex justify-center gap-6 mt-10">
                <button onClick={downloadImage} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600">
                  <span className="text-xl">💾</span>이미지 저장
                </button>
                <button onClick={shareKakao} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600">
                  <span className="text-xl">💬</span>카톡 공유
                </button>
                <button onClick={() => { navigator.clipboard.writeText(numbers.join(', ')); alert('복사되었습니다! 🍀'); }} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600">
                  <span className="text-xl">📋</span>번호 복사
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"로또 당첨을 부르는 길몽 10선"</h2>
            <div className="space-y-4 text-[11px] text-slate-600 max-h-[50vh] overflow-y-auto pr-2">
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">1. 연예인이 집에 온 꿈</h3><p>귀인을 만나 재물을 얻을 징조입니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">2. 대통령과 악수</h3><p>명예와 횡재수가 따르는 최고 길몽입니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">3. 조상님의 미소</h3><p>조상님이 무언가 주신다면 대박 신호입니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">4. 똥에 젖는 꿈</h3><p>강력한 재물운의 유입을 상징합니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">5. 집에 큰 불</h3><p>재산이 급격히 번창할 징조입니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">6. 맑은 물 가득</h3><p>집안에 부가 가득 차오름을 뜻합니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">7. 돼지 떼 발견</h3><p>막대한 재물이 굴러오는 꿈입니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">8. 피가 솟구침</h3><p>피가 많이 날수록 큰 횡재수가 있습니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">9. 용의 승천</h3><p>인생 최고의 부귀 기회를 의미합니다.</p></div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm"><h3 className="font-black text-slate-900 mb-1">10. 돈다발 선물</h3><p>실제 횡재 가능성이 매우 높은 꿈입니다.</p></div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"12간지 행운 포인트"</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
              <table className="w-full text-[10px] text-center">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-tighter">
                  <tr><th className="p-3">띠별 그룹</th><th className="p-3">숫자</th><th className="p-3">컬러</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                  <tr><td className="p-3">쥐/용/원숭이</td><td className="p-3">1, 6</td><td className="p-3 text-blue-500 font-black">BLUE</td></tr>
                  <tr><td className="p-3">소/뱀/닭</td><td className="p-3">2, 7</td><td className="p-3 text-red-500 font-black">RED</td></tr>
                  <tr><td className="p-3">범/말/개</td><td className="p-3">3, 8</td><td className="p-3 text-green-600 font-black">GREEN</td></tr>
                  <tr><td className="p-3">토끼/양/돼지</td><td className="p-3">4, 9</td><td className="p-3 text-slate-400 font-black text-[9px]">WHITE</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full max-w-[360px] py-16 px-6 text-center">
        <div className="flex justify-center gap-4 mb-4 text-[10px] font-bold text-slate-400">
          <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-yellow-600 underline decoration-slate-200 transition-colors">개인정보처리방침</button>
          <span>|</span>
          <span className="opacity-50">© 2026 LUCKY GUIDE</span>
        </div>
      </footer>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsPrivacyOpen(false)}>
          <div className="bg-white w-full max-w-[320px] max-h-[70vh] overflow-y-auto rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-4">개인정보처리방침</h3>
            <div className="text-[11px] text-slate-500 leading-relaxed space-y-4">
              <p>본 서비스는 사용자의 개인정보를 저장하지 않습니다.</p>
              <p>1. 모든 추첨은 기기 내에서만 이루어집니다. 2. Google AdSense 광고를 통해 맞춤 정보를 제공할 수 있습니다.</p>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs">확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;