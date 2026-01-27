import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const cardRef = useRef(null);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // 광고 슬롯 (애드센스 승인 필수 레이아웃)
  const AdSlot = ({ id }) => (
    <div className={`w-full max-w-[360px] my-4 p-3 text-center border border-dashed rounded-2xl ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Advertisement - {id}</p>
    </div>
  );

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
      const canvas = await html2canvas(cardRef.current, { backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', scale: 2 });
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

  const bgClass = isDarkMode ? "bg-slate-900 text-slate-100" : "bg-[#f8fafc] text-slate-800";
  const navBg = isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-100";
  const cardClass = `w-full max-w-[360px] p-8 rounded-[2.5rem] shadow-xl animate-in fade-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`;
  const tabClass = (id) => `flex-none md:flex-1 px-5 md:px-2 py-4 text-[11px] md:text-[13px] font-black transition-all relative whitespace-nowrap text-center ${activeTab === id ? (isDarkMode ? 'text-yellow-400' : 'text-slate-900') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`;

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center font-sans overflow-x-hidden relative transition-colors duration-300`}>
      <header className={`w-full max-w-[400px] md:max-w-[700px] sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900' : 'bg-[#f8fafc]'}`}>
        <div className="relative pt-12 pb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight italic">LUCKY GUIDE</h1>
          <button onClick={toggleDarkMode} className="absolute right-4 top-12 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:scale-110 transition-transform">{isDarkMode ? '☀️' : '🌙'}</button>
        </div>
        <nav className={`flex backdrop-blur-md border-b overflow-x-auto md:overflow-x-visible no-scrollbar touch-pan-x ${navBg}`}>
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

      <main className="w-full flex flex-col items-center px-6 py-8 pb-32">
        <AdSlot id="TOP" />

        <div ref={cardRef} className={cardClass}>
          {activeTab === 'lotto' && (
            <div className="flex flex-col items-center w-full">
              <div className="text-center mb-10"><span className="text-4xl mb-3 block animate-bounce">✨</span><h2 className="text-xl font-black italic">당신의 운을 믿으세요</h2><p className="text-slate-400 text-[10px] mt-2 font-bold tracking-widest uppercase">Lucky Guide Premium</p></div>
              <div className="flex justify-center gap-2 mb-12 h-10 items-center">
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-sm shadow-lg border border-yellow-500/30">{num}</div>
                )) : <div className="text-slate-200 text-sm font-bold tracking-widest uppercase italic">Ready to Luck</div>}
              </div>
              <button onClick={generateNumbers} disabled={isSpinning} style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite' }} className={`w-full py-5 rounded-2xl font-black text-slate-900 text-lg shadow-xl shadow-yellow-200/50 ${isSpinning ? 'opacity-50' : ''}`}>{isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}</button>
            </div>
          )}

          {activeTab === 'saju' && (
            <div className="text-center py-6">
              <span className="text-5xl mb-6 block">🎎</span><h2 className="text-xl font-black mb-2 italic">타고난 운명, 사주풀이</h2>
              <p className="text-slate-400 text-xs mb-8">생년월일시 데이터를 바탕으로 분석합니다</p>
              <div className={`p-6 rounded-3xl text-left text-[11px] leading-relaxed font-medium ${isDarkMode ? 'bg-slate-700/50 text-slate-300 border border-slate-600' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                "사주팔자는 인생의 설계도와 같습니다." 최신 AI가 당신의 대운과 올해의 횡재수를 정밀 분석합니다.
              </div>
              <div className="mt-8 inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-full animate-pulse uppercase">Coming Soon</div>
            </div>
          )}

          {/* AI 관상 복구 */}
          {activeTab === 'face' && (
            <div className="text-center py-6">
              <span className="text-5xl mb-6 block">🎭</span><h2 className="text-xl font-black mb-2 italic">"재벌이 될 상인가?"</h2>
              <p className="text-slate-400 text-xs mb-8">AI 얼굴 인식으로 찾는 재물복</p>
              <div className={`p-6 rounded-3xl text-left text-[11px] leading-relaxed font-medium ${isDarkMode ? 'bg-slate-700/50 text-slate-300 border border-slate-600' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                "코는 재물 창고라 하였습니다." 최신 인식 기술로 당신의 성공운을 분석해 드립니다.
              </div>
              <div className="mt-8 inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-full animate-pulse uppercase">Coming Soon</div>
            </div>
          )}

          {/* AI 손금 복구 */}
          {activeTab === 'palm' && (
            <div className="text-center py-6">
              <span className="text-5xl mb-6 block">✋</span><h2 className="text-xl font-black mb-2 italic">"손바닥 보물지도"</h2>
              <p className="text-slate-400 text-xs mb-8">손바닥에 그려진 당첨의 기운</p>
              <div className={`p-6 rounded-3xl text-left text-[11px] leading-relaxed font-medium ${isDarkMode ? 'bg-slate-700/50 text-slate-300 border border-slate-600' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                "재물선이 뚜렷하니 대박의 징조로다." 손금의 주요 선을 AI로 분석하여 횡재수를 찾아냅니다.
              </div>
              <div className="mt-8 inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-full animate-pulse uppercase">Coming Soon</div>
            </div>
          )}

          {activeTab === 'dream' && (
            <div>
              <h2 className="text-xl font-black mb-8 text-center italic">로또 당첨 길몽 10선</h2>
              <div className="space-y-4 text-[11px] max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar font-medium">
                {[
                  {t: "연예인이 집에 온 꿈", d: "귀인을 만나 재물운이 크게 상승할 징조입니다."},
                  {t: "대통령과 악수", d: "명예와 횡재수가 따르는 최고 길몽입니다."},
                  {t: "조상님의 밝은 미소", d: "부를 얻게 될 조상님의 선물입니다."},
                  {t: "똥에 흠뻑 젖는 꿈", d: "막대한 재물이 굴러오는 전형적 당첨 꿈입니다."},
                  {t: "집이 활활 타는 꿈", d: "재산이 급격히 번창할 것을 예시합니다."},
                  {t: "맑은 물이 차오름", d: "부귀영화를 누릴 강력한 징조입니다."},
                  {t: "돼지 떼 발견", d: "횡재수가 넝쿨째 들어오는 꿈입니다."},
                  {t: "피가 솟구침", d: "선명한 피가 많이 날수록 큰 돈이 생깁니다."},
                  {t: "용의 승천", d: "일생일대의 기회가 찾아왔음을 뜻합니다."},
                  {t: "돈다발 선물", d: "실제 횡재 가능성이 매우 높은 길몽입니다."}
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-l-4 border-yellow-500 shadow-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                    <h3 className={`font-black mb-1 italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{i+1}. {item.t}</h3><p>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div>
              <h2 className="text-xl font-black mb-8 text-center italic">"12간지 행운 포인트"</h2>
              <div className={`overflow-hidden rounded-3xl border shadow-sm ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <table className="w-full text-[10px] text-center border-collapse font-medium">
                  <thead className={isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-50 text-slate-400'}><tr><th className="p-3">띠별 그룹</th><th className="p-3">숫자</th><th className="p-3">컬러</th></tr></thead>
                  <tbody className={`divide-y italic ${isDarkMode ? 'divide-slate-700 text-slate-300' : 'divide-slate-50 text-slate-700'}`}>
                    <tr><td className="p-3">쥐/용/원숭이</td><td className="p-3">1, 6</td><td className="p-3 text-blue-500 font-black">BLUE</td></tr>
                    <tr><td className="p-3">소/뱀/닭</td><td className="p-3">2, 7</td><td className="p-3 text-red-500 font-black">RED</td></tr>
                    <tr><td className="p-3">범/말/개</td><td className="p-3">3, 8</td><td className="p-3 text-green-600 font-black">GREEN</td></tr>
                    <tr><td className="p-3">토끼/양/돼지</td><td className="p-3">4, 9</td><td className="p-3 text-slate-400 font-black text-[9px]">WHITE</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <AdSlot id="BOTTOM" />

        {activeTab === 'lotto' && numbers.length > 0 && (
          <div className="flex justify-center gap-6 mt-10">
            <button onClick={downloadImage} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-all active:scale-90"><span className="text-xl">💾</span>이미지 저장</button>
            <button onClick={shareKakao} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-all active:scale-90"><span className="text-xl">💬</span>카톡 공유</button>
            <button onClick={() => { navigator.clipboard.writeText(numbers.join(', ')); alert('복사되었습니다! 🍀'); }} className="flex flex-col items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-yellow-600 transition-all active:scale-90"><span className="text-xl">📋</span>번호 복사</button>
          </div>
        )}
      </main>

      <footer className={`w-full max-w-[360px] py-16 px-6 text-center border-t mt-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
        <div className="flex justify-center gap-4 mb-4 text-[10px] font-bold text-slate-400">
          <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-yellow-600 underline decoration-slate-200 transition-colors italic">개인정보처리방침</button>
          <span>|</span>
          <span className="opacity-50">© 2026 LUCKY GUIDE</span>
        </div>
      </footer>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsPrivacyOpen(false)}>
          <div className={`${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-500'} w-full max-w-[320px] max-h-[70vh] overflow-y-auto rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 text-left`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-black mb-6 italic border-b pb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>개인정보처리방침</h3>
            <div className="text-[11px] leading-relaxed space-y-5 font-medium">
              <section><p className={`font-bold mb-1 italic ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>1. 개인정보 수집 미실시</p><p>본 서비스는 성함, 연락처 등 개인 식별 정보를 저장하지 않습니다.</p></section>
              <section><p className={`font-bold mb-1 italic ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>2. 구글 애드센스 정책</p><p>맞춤형 광고를 위해 구글 쿠키가 활용될 수 있음을 고지합니다.</p></section>
              <section><p className={`font-bold mb-1 italic ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>3. 서비스 보안 로직</p><p>모든 데이터는 사용자의 기기 로컬 환경에서 즉석 실행됩니다.</p></section>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs">확인 완료</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;