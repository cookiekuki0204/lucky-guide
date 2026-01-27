import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const cardRef = useRef(null);

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
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#f8fafc', scale: 2 });
      const link = document.createElement('a');
      link.download = `lucky-numbers-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) { console.error('이미지 저장 실패:', err); }
  };

  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500";
  const tabClass = (id) => `flex-1 py-4 text-sm font-black transition-all relative ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden">
      <style>{`@keyframes glimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>

      {/* 헤더 & 네비게이션 */}
      <header className="w-full max-w-[400px] bg-[#f8fafc] sticky top-0 z-50">
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        </div>
        <nav className="flex bg-white/70 backdrop-blur-md border-b border-slate-100">
          <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>추첨{activeTab === 'lotto' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>해몽{activeTab === 'dream' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>포인트{activeTab === 'guide' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}</button>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-12">
        {activeTab === 'lotto' && (
          <div className="flex flex-col items-center w-full">
            <div ref={cardRef} className={cardClass}>
              <div className="text-center mb-10 text-slate-800">
                <span className="text-4xl mb-3 block animate-bounce">✨</span>
                <h2 className="text-xl font-black">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[10px] mt-2 tracking-widest uppercase font-bold">Lucky Guide Premium</p>
              </div>
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">{num}</div>
                )) : <div className="text-slate-200 text-sm font-bold tracking-widest">LUCKY NUMBERS</div>}
              </div>
              <button onClick={generateNumbers} disabled={isSpinning}
                style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite' }}
                className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}>
                {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
              </button>
            </div>
            {numbers.length > 0 && (
              <div className="flex justify-center gap-8 mt-10">
                <button onClick={downloadImage} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-colors">
                  <span className="text-xl">💾</span>이미지 저장
                </button>
                <button onClick={() => { navigator.clipboard.writeText(numbers.join(', ')); alert('복사되었습니다! 🍀'); }} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-colors">
                  <span className="text-xl">📋</span>번호 복사
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"혹시 이런 꿈을?"</h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm text-xs text-slate-600 leading-relaxed">
                <h3 className="font-black text-slate-900 mb-1">👴 조상님 꿈</h3>
                <p>밝은 표정의 조상님은 당신에게 재물운이 강력하게 들어오고 있음을 알리는 최고의 길몽입니다.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm text-xs text-slate-600 leading-relaxed">
                <h3 className="font-black text-slate-900 mb-1">💩 오물(똥) 꿈</h3>
                <p>현실에선 불쾌할 수 있으나 꿈속에서 온몸이 흠뻑 젖는다면 큰 부를 얻게 될 징조입니다.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm text-xs text-slate-600 leading-relaxed">
                <h3 className="font-black text-slate-900 mb-1">🔥 불 꿈</h3>
                <p>집이 활활 타오르는 강한 불길은 당신의 사업이나 운세가 걷잡을 수 없이 번창할 것을 의미합니다.</p>
              </div>
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
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  <tr><td className="p-3 font-bold">쥐 / 용 / 원숭이</td><td className="p-3">1, 6</td><td className="p-3 text-blue-500 font-black">BLUE</td></tr>
                  <tr><td className="p-3 font-bold">소 / 뱀 / 닭</td><td className="p-3">2, 7</td><td className="p-3 text-red-500 font-black">RED</td></tr>
                  <tr><td className="p-3 font-bold">범 / 말 / 개</td><td className="p-3">3, 8</td><td className="p-3 text-green-600 font-black">GREEN</td></tr>
                  <tr><td className="p-3 font-bold">토끼 / 양 / 돼지</td><td className="p-3">4, 9</td><td className="p-3 text-slate-400 font-black">WHITE</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-[9px] text-slate-400 text-center leading-relaxed font-medium">
              오늘 당신의 기운과 공명하는 컬러 아이템을 지녀보세요.<br/>긍정적인 에너지가 행운을 더 빨리 끌어당깁니다.
            </p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-[360px] py-16 px-6 text-center">
        <div className="flex justify-center gap-4 mb-4 text-[10px] font-bold text-slate-400">
          <a href="/privacy" className="hover:text-yellow-600 underline decoration-slate-200 transition-colors">개인정보처리방침</a>
          <span>|</span>
          <span className="opacity-50">© 2026 LUCKY GUIDE</span>
        </div>
        <p className="text-[9px] text-slate-300 font-medium tracking-widest uppercase">Premium Fortune Selection Service</p>
      </footer>
    </div>
  );
}

export default App;