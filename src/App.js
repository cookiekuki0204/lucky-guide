import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false); // 개인정보 팝업 상태
  const cardRef = useRef(null);

  // 1. 번호 생성 로직
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

  // 2. 이미지 저장
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

  // 3. 카카오 공유
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

  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500";
  const tabClass = (id) => `flex-1 py-4 text-[11px] font-black transition-all relative ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden relative">
      <style>{`@keyframes glimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>

      {/* 헤더 & 네비게이션 (이름 수정됨) */}
      <header className="w-full max-w-[400px] bg-[#f8fafc] sticky top-0 z-40">
        <div className="pt-12 pb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        </div>
        <nav className="flex bg-white/70 backdrop-blur-md border-b border-slate-100">
          <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>
            로또번호추첨기
            {activeTab === 'lotto' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>
            대박꿈해몽
            {activeTab === 'dream' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>
            띠별운세
            {activeTab === 'guide' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-yellow-500 rounded-full" />}
          </button>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-12">
        {activeTab === 'lotto' && (
          <div className="flex flex-col items-center w-full">
            <div ref={cardRef} className={cardClass}>
              <div className="text-center mb-10 text-slate-800">
                <span className="text-4xl mb-3 block animate-bounce">✨</span>
                <h2 className="text-xl font-black">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[10px] mt-2 tracking-widest uppercase font-bold tracking-widest">Lucky Guide Premium</p>
              </div>
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">{num}</div>
                )) : <div className="text-slate-200 text-sm font-bold tracking-widest uppercase">Luck is coming</div>}
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
                <button onClick={shareKakao} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-colors">
                  <span className="text-xl">💬</span>카톡 공유
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"대박을 부르는 꿈"</h2>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1 italic">조상님 꿈</h3>
                <p>밝게 웃는 조상님은 당신에게 재물운이 강력하게 들어오고 있음을 알리는 최고의 길몽입니다.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm">
                <h3 className="font-black text-slate-900 mb-1 italic">오물(똥) 꿈</h3>
                <p>현실에선 불쾌할 수 있으나 꿈속에서 온몸이 흠뻑 젖는다면 큰 부를 얻게 될 강력한 징조입니다.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"띠별 행운 포인트"</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
              <table className="w-full text-[10px] text-center">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                  <tr><th className="p-3">띠별 그룹</th><th className="p-3">숫자</th><th className="p-3">컬러</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  <tr><td className="p-3 font-bold">쥐/용/원숭이</td><td className="p-3 font-medium">1, 6</td><td className="p-3 text-blue-500 font-black">BLUE</td></tr>
                  <tr><td className="p-3 font-bold">소/뱀/닭</td><td className="p-3 font-medium">2, 7</td><td className="p-3 text-red-500 font-black">RED</td></tr>
                  <tr><td className="p-3 font-bold">범/말/개</td><td className="p-3 font-medium">3, 8</td><td className="p-3 text-green-600 font-black">GREEN</td></tr>
                  <tr><td className="p-3 font-bold">토끼/양/돼지</td><td className="p-3 font-medium">4, 9</td><td className="p-3 text-slate-400 font-black">WHITE</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 영역 */}
      <footer className="w-full max-w-[360px] py-16 px-6 text-center">
        <div className="flex justify-center gap-4 mb-4 text-[10px] font-bold text-slate-400">
          <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-yellow-600 underline decoration-slate-200 transition-colors">개인정보처리방침</button>
          <span>|</span>
          <span className="opacity-50 font-medium">© 2026 LUCKY GUIDE</span>
        </div>
        <p className="text-[9px] text-slate-300 font-black tracking-widest uppercase italic">Believe in your luck</p>
      </footer>

      {/* 개인정보처리방침 모달(팝업) */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsPrivacyOpen(false)}>
          <div className="bg-white w-full max-w-[320px] max-h-[70vh] overflow-y-auto rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-4">개인정보처리방침</h3>
            <div className="text-[11px] text-slate-500 leading-relaxed space-y-4">
              <p>본 서비스('럭키가이드')는 사용자의 개인정보를 수집하거나 저장하지 않습니다.</p>
              <p><strong>1. 수집 항목:</strong> 본 사이트는 쿠키를 통한 기본 분석 외에 이름, 연락처 등 어떠한 개인정보도 요구하거나 저장하지 않습니다.</p>
              <p><strong>2. 제3자 광고:</strong> 본 서비스는 Google AdSense를 통해 광고를 게재하며, 구글은 사용자의 방문 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.</p>
              <p><strong>3. 정보 보안:</strong> 모든 번호 추첨 로직은 사용자의 브라우저 내에서 실행되며 서버로 전송되지 않습니다.</p>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs active:scale-95 transition-all">확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;