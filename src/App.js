import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
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

  // 2. 이미지 다운로드
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

  // 3. 카카오톡 공유 (부활 및 유지)
  const shareKakao = () => {
    if (!window.Kakao) return;
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) {
      kakao.init('8ee405ddc4c4db04b8de8268a8317426'); // 발급받으신 실제 키 입력 필수
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

  const cardClass = "w-full max-w-[360px] p-8 bg-white rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500";
  const tabClass = (id) => `flex-none px-5 py-4 text-[11px] font-black transition-all relative ${activeTab === id ? 'text-slate-900' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center font-sans overflow-x-hidden relative">
      <style>{`
        @keyframes glimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 헤더 & 네비게이션 */}
      <header className="w-full max-w-[400px] bg-[#f8fafc] sticky top-0 z-40">
        <div className="pt-12 pb-4 text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">LUCKY GUIDE</h1>
        </div>
        <nav className="flex bg-white/70 backdrop-blur-md border-b border-slate-100 overflow-x-auto no-scrollbar whitespace-nowrap px-2">
          <button onClick={() => setActiveTab('lotto')} className={tabClass('lotto')}>로또번호추첨기{activeTab === 'lotto' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('face')} className={tabClass('face')}>AI관상{activeTab === 'face' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('palm')} className={tabClass('palm')}>AI손금{activeTab === 'palm' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('dream')} className={tabClass('dream')}>대박꿈해몽{activeTab === 'dream' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
          <button onClick={() => setActiveTab('guide')} className={tabClass('guide')}>띠별운세{activeTab === 'guide' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-yellow-500 rounded-full" />}</button>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-12">
        {/* 1. 로또 추첨기 */}
        {activeTab === 'lotto' && (
          <div className="flex flex-col items-center w-full">
            <div ref={cardRef} className={cardClass}>
              <div className="text-center mb-10 text-slate-800">
                <span className="text-4xl mb-3 block animate-bounce">✨</span>
                <h2 className="text-xl font-black">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[10px] mt-2 font-bold tracking-widest uppercase">Lucky Guide Premium</p>
              </div>
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">{num}</div>
                )) : <div className="text-slate-200 text-sm font-bold tracking-widest uppercase tracking-widest">Believe your luck</div>}
              </div>
              <button onClick={generateNumbers} disabled={isSpinning}
                style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite' }}
                className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}>
                {isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}
              </button>
            </div>
            {numbers.length > 0 && (
              <div className="flex justify-center gap-6 mt-10">
                <button onClick={downloadImage} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-all active:scale-90"><span className="text-xl">💾</span>이미지 저장</button>
                <button onClick={shareKakao} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-all active:scale-90"><span className="text-xl">💬</span>카톡 공유</button>
                <button onClick={() => { navigator.clipboard.writeText(numbers.join(', ')); alert('복사되었습니다! 🍀'); }} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-all active:scale-90"><span className="text-xl">📋</span>번호 복사</button>
              </div>
            )}
          </div>
        )}

        {/* 2. AI 관상 커밍순 */}
        {activeTab === 'face' && (
          <div className={cardClass}>
            <div className="text-center py-10">
              <span className="text-5xl mb-6 block">🎭</span>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">"재벌이 될 상인가?"</h2>
              <p className="text-slate-400 text-xs mb-8">AI가 분석하는 당신의 숨겨진 재물복</p>
              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                  "코는 재물이 쌓이는 창고라 하였습니다."<br/><br/>
                  AI 얼굴 인식으로 당신의 성공운을<br/>과학적으로 분석해 드립니다.
                </p>
              </div>
              <div className="mt-8 inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-full animate-pulse">COMING SOON</div>
            </div>
          </div>
        )}

        {/* 3. AI 손금 커밍순 */}
        {activeTab === 'palm' && (
          <div className={cardClass}>
            <div className="text-center py-10">
              <span className="text-5xl mb-6 block">✋</span>
              <h2 className="text-xl font-black text-slate-800 mb-2 italic">"손바닥의 보물지도"</h2>
              <p className="text-slate-400 text-xs mb-8">손금에 숨겨진 당첨의 기운을 찾아서</p>
              <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                  "재물선이 뚜렷하니 대박의 징조로다."<br/><br/>
                  손금의 주요 선들을 AI로 추출하여<br/>당신의 횡재수를 알려드립니다.
                </p>
              </div>
              <div className="mt-8 inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-full animate-pulse">COMING SOON</div>
            </div>
          </div>
        )}

        {/* 4. 대박꿈해몽 10선 */}
        {activeTab === 'dream' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"로또 1등 길몽 10선"</h2>
            <div className="space-y-4 text-[11px] text-slate-600 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {[
                {t: "연예인이 집에 온 꿈", d: "귀인을 만나 재물운이 크게 상승할 징조입니다."},
                {t: "대통령과 악수", d: "명예와 함께 엄청난 횡재수가 따르는 최고 길몽입니다."},
                {t: "조상님의 밝은 미소", d: "집안에 큰 부를 얻게 될 강력한 조상님의 선물입니다."},
                {t: "똥에 흠뻑 젖는 꿈", d: "막대한 재물이 굴러들어올 전형적인 당첨 꿈입니다."},
                {t: "집이 활활 타는 꿈", d: "사업이나 재산이 급격히 번창할 것을 예시합니다."},
                {t: "맑은 물이 차오름", d: "집안에 부귀영화가 가득할 징조입니다."},
                {t: "돼지 떼 발견", d: "횡재수가 넝쿨째 들어오는 꿈입니다."},
                {t: "피가 솟구침", d: "선명한 피가 많이 날수록 큰 돈이 생깁니다."},
                {t: "용의 승천", d: "인생 최고의 기회가 찾아왔음을 암시합니다."},
                {t: "돈다발 선물", d: "횡재 가능성이 매우 높은 직관적인 길몽입니다."}
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm">
                  <h3 className="font-black text-slate-900 mb-1">{i+1}. {item.t}</h3>
                  <p>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 띠별운세 (12간지 전체) */}
        {activeTab === 'guide' && (
          <div className={cardClass}>
            <h2 className="text-xl font-black text-slate-800 mb-8 text-center italic">"12간지 행운 포인트"</h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
              <table className="w-full text-[10px] text-center border-collapse">
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

      {/* 푸터 & 개인정보처리방침 (3항목 고수) */}
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
            <h3 className="text-lg font-black text-slate-900 mb-6 italic border-b pb-2">개인정보처리방침</h3>
            <div className="text-[11px] text-slate-500 leading-relaxed space-y-5 font-medium text-left">
              <section>
                <p className="text-slate-900 font-bold mb-1">1. 개인정보 수집 미실시</p>
                <p>본 서비스는 성함, 연락처 등 어떠한 개인정보도 서버에 전송하거나 저장하지 않습니다.</p>
              </section>
              <section>
                <p className="text-slate-900 font-bold mb-1">2. 구글 애드센스 정책</p>
                <p>Google AdSense를 통해 맞춤형 광고를 제공하며, 구글은 분석을 위해 쿠키 정보를 활용할 수 있습니다.</p>
              </section>
              <section>
                <p className="text-slate-900 font-bold mb-1">3. 서비스 보안 로직</p>
                <p>모든 번호 추첨은 사용자의 기기 로컬 환경에서만 즉석 실행되도록 설계되어 안전합니다.</p>
              </section>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs active:scale-95 transition-all">내용 확인 완료</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;