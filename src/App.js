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

  const AdSlot = ({ id }) => (
    <div className={`w-full max-w-[360px] my-4 p-4 text-center border border-dashed rounded-2xl ${isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-white'}`}>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Advertisement - {id}</p>
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
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        scale: 2,
        useCORS: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('.capture-card');
          if (clonedCard) {
            clonedCard.style.display = 'flex';
            clonedCard.style.flexDirection = 'column';
            clonedCard.style.alignItems = 'center';
            clonedCard.style.textAlign = 'center';
          }
        }
      });
      const link = document.createElement('a');
      link.download = `lucky-numbers.png`;
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
      buttons: [{ title: '번호 받으러 가기', link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' } }],
    });
  };

  const bgClass = isDarkMode ? "bg-[#0f172a] text-slate-100" : "bg-[#ffffff] text-slate-800";
  const navBg = isDarkMode ? "bg-[#0f172a]/90 border-slate-800" : "bg-white/95 border-slate-100";
  const cardClass = `w-full max-w-[360px] p-8 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-50'}`;
  const tabClass = (id) => `flex-none md:flex-1 px-5 md:px-2 py-5 text-[14px] md:text-[15px] font-black transition-all relative whitespace-nowrap text-center ${activeTab === id ? (isDarkMode ? 'text-yellow-400' : 'text-slate-900') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`;

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center font-sans overflow-x-hidden relative transition-colors duration-300`}>
      <header className={`w-full max-w-[400px] md:max-w-[700px] sticky top-0 z-40 transition-colors ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
        <div className="relative pt-12 pb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">LUCKY GUIDE</h1>
          <button onClick={toggleDarkMode} className="absolute right-4 top-12 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:scale-110 transition-transform shadow-sm">{isDarkMode ? '☀️' : '🌙'}</button>
        </div>
        <nav className={`flex backdrop-blur-md border-b overflow-x-auto no-scrollbar touch-pan-x ${navBg}`}>
          <div className="flex min-w-full items-center justify-start md:justify-center px-2">
            {[
              { id: 'lotto', label: '로또추첨' },
              { id: 'saju', label: 'AI사주' },
              { id: 'face', label: 'AI관상' },
              { id: 'palm', label: 'AI손금' },
              { id: 'dream', label: '꿈해몽' },
              { id: 'guide', label: '띠별운세' }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabClass(tab.id)}>
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-2 right-2 h-1 bg-yellow-500 rounded-full" />}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="w-full flex flex-col items-center px-6 py-8 pb-32">
        <AdSlot id="TOP" />

        <div ref={cardRef} className={`${cardClass} capture-card`}>
          {activeTab === 'lotto' && (
            <div className="flex flex-col items-center w-full">
              <div className="text-center mb-10">
                <span className="text-5xl mb-4 block animate-bounce">✨</span>
                <h2 className="text-2xl font-black">당신의 운을 믿으세요</h2>
                <p className="text-slate-400 text-[12px] mt-2 font-bold tracking-widest uppercase">Lucky Guide Premium</p>
              </div>
              <div className="flex justify-center items-center gap-3 mb-12 h-14 w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="w-11 h-11 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold text-lg shadow-lg border border-yellow-500/30" style={{ minWidth: '44px' }}>{num}</div>
                )) : <div className="text-slate-300 text-base font-bold tracking-widest uppercase">Ready to Luck</div>}
              </div>
              <div className="w-full flex justify-center">
                <button onClick={generateNumbers} disabled={isSpinning} style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite', display: 'block', width: '100%' }} className={`py-6 rounded-2xl font-black text-slate-900 text-xl shadow-xl ${isSpinning ? 'opacity-50' : ''}`}>{isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}</button>
              </div>
            </div>
          )}

          {activeTab === 'saju' && (
            <div className="text-center py-6 w-full flex flex-col items-center">
              <span className="text-6xl mb-6 block">🎎</span>
              <h2 className="text-2xl font-black mb-4 text-center">타고난 운명, 사주풀이</h2>
              <div className={`p-6 rounded-3xl text-left text-[14px] leading-relaxed font-medium space-y-4 w-full ${isDarkMode ? 'bg-slate-700/50 text-slate-200 border border-slate-600' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                <p><strong>사주팔자는 인생의 설계도입니다.</strong> 태어난 연, 월, 일, 시의 기운이 당신의 평생 운을 결정합니다.</p>
                <p>로또와 같은 큰 재물운은 사주에서 <strong>'편재'</strong>의 기운이 강할 때 찾아옵니다. 럭키가이드 AI는 당신의 사주 속 재물 기운이 극대화되는 황금 시간대를 분석하여 최적의 행운을 가이드합니다.</p>
              </div>
              <div className="mt-8 inline-block px-5 py-2 bg-yellow-100 text-yellow-700 text-[11px] font-black rounded-full animate-pulse uppercase">AI Engine Updating...</div>
            </div>
          )}              

          {activeTab === 'face' && (
            <div className="text-center py-6 w-full flex flex-col items-center">
              <span className="text-6xl mb-6 block">🎭</span>
              <h2 className="text-2xl font-black mb-4 text-center">재벌이 될 상인가?</h2>
              <div className={`p-6 rounded-3xl text-left text-[14px] leading-relaxed font-medium w-full ${isDarkMode ? 'bg-slate-700/50 text-slate-200 border border-slate-600' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                <p className="mb-4"><strong>코는 재산이 머무는 창고입니다.</strong> 관상학에서는 얼굴의 중심인 코와 입의 균형을 통해 말년의 경제적 풍요를 점칩니다.</p>
                <p>AI 얼굴 인식 기술로 당신의 이목구비에 담긴 재물복을 분석해 드릴 예정입니다. 곧 사진 업로드 기능이 시작됩니다.</p>
              </div>
              <div className="mt-8 inline-block px-5 py-2 bg-yellow-100 text-yellow-700 text-[11px] font-black rounded-full animate-pulse uppercase">Content Updating...</div>
            </div>
          )}

          {activeTab === 'palm' && (
            <div className="text-center py-6 w-full flex flex-col items-center">
              <span className="text-6xl mb-6 block">✋</span>
              <h2 className="text-2xl font-black mb-4 text-center">손바닥 속 보물지도</h2>
              <div className={`p-6 rounded-3xl text-left text-[14px] leading-relaxed font-medium space-y-4 w-full ${isDarkMode ? 'bg-slate-700/50 text-slate-200 border border-slate-600' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                <p><strong>재물선이 뚜렷하면 대박의 징조입니다.</strong> 수상학에서 손금은 뇌의 신경과 연결되어 그 사람의 에너지를 실시간으로 반영합니다.</p>
                <p>로또 당첨자들에게서 흔히 발견되는 <strong>삼지창 손금</strong>과 재운선을 AI가 스캔하여 당신의 현재 재물운 지수를 분석해 드립니다.</p>
              </div>
              <div className="mt-8 inline-block px-5 py-2 bg-yellow-100 text-yellow-700 text-[11px] font-black rounded-full animate-pulse uppercase">AI Scanning Ready...</div>
            </div>
          )}
          
          {activeTab === 'dream' && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-black mb-6 text-center">로또 당첨 길몽 10선</h2>
              <div className="space-y-4 text-[14px] h-[380px] overflow-y-auto pr-2 no-scrollbar font-medium w-full">
                {[
                  {t: "연예인이 집에 온 꿈", d: "재물운이 크게 상승할 징조입니다."},
                  {t: "대통령과 악수하는 꿈", d: "명예와 횡재수가 따르는 최고 길몽입니다."},
                  {t: "조상님이 밝게 웃는 꿈", d: "부를 얻게 될 조상님의 선물입니다."},
                  {t: "똥에 흠뻑 젖는 꿈", d: "막대한 재산이 굴러오는 전형적인 꿈입니다."},
                  {t: "집이 활활 타는 꿈", d: "재산이 급격히 번창할 것을 예시합니다."},
                  {t: "맑은 물이 집안에 가득참", d: "부귀영화를 누릴 강력한 징조입니다."},
                  {t: "돼지 떼를 발견하는 꿈", d: "횡재수가 넝쿨째 들어오는 꿈입니다."},
                  {t: "자신의 몸에서 피가 남", d: "선명한 피는 큰 재물운을 의미합니다."},
                  {t: "용이 하늘로 승천함", d: "일생일대의 기회가 찾아옴을 뜻합니다."},
                  {t: "돈다발을 선물받는 꿈", d: "실제 횡재 가능성이 매우 높습니다."}
                ].map((item, i) => (
                  <div key={i} className={`p-5 rounded-2xl border-l-4 border-yellow-500 shadow-sm ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    <h3 className={`font-black mb-2 text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{i+1}. {item.t}</h3><p>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl font-black mb-6 text-center">12간지 행운 포인트</h2>
              <div className={`p-6 rounded-3xl text-left text-[14px] leading-relaxed font-medium space-y-4 mb-6 w-full ${isDarkMode ? 'bg-slate-700/50 text-slate-200 border border-slate-600' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                <p><strong>띠별 오행의 조화:</strong> 12간지는 각기 고유한 기운을 지닙니다. 이에 따라 로또 번호의 홀짝 조합이나 특정 숫자대의 기운이 달라집니다.</p>
              </div>
              <div className={`overflow-hidden rounded-3xl border shadow-sm w-full ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                <table className="w-full text-[13px] text-center border-collapse font-medium">
                  <thead className={isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-50 text-slate-400'}><tr><th className="p-4">띠 그룹</th><th className="p-4">행운 숫자</th><th className="p-4">컬러</th></tr></thead>
                  <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700 text-slate-300' : 'divide-slate-50 text-slate-700'}`}>
                    <tr><td className="p-4">쥐/용/원숭이</td><td className="p-4 font-black">1, 6, 15, 29</td><td className="p-4 text-blue-500 font-bold">BLUE</td></tr>
                    <tr><td className="p-4">소/뱀/닭</td><td className="p-4 font-black">2, 7, 24, 38</td><td className="p-4 text-red-500 font-bold">RED</td></tr>
                    <tr><td className="p-4">범/말/개</td><td className="p-4 font-black">3, 8, 19, 42</td><td className="p-4 text-green-600 font-bold">GREEN</td></tr>
                    <tr><td className="p-4">토끼/양/돼지</td><td className="p-4 font-black">4, 9, 31, 45</td><td className="p-4 text-slate-400 font-bold">WHITE</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <AdSlot id="BOTTOM" />

        {activeTab === 'lotto' && numbers.length > 0 && (
          <div className="flex justify-center gap-8 mt-12">
            <button onClick={downloadImage} className="flex flex-col items-center gap-2 group transition-all active:scale-90">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-yellow-100 transition-colors shadow-sm">💾</div>
              <span className="text-[12px] font-bold text-slate-500">이미지 저장</span>
            </button>
            <button onClick={shareKakao} className="flex flex-col items-center gap-2 group transition-all active:scale-90">
              <div className="w-14 h-14 rounded-2xl bg-[#FEE500] flex items-center justify-center text-2xl shadow-sm">💬</div>
              <span className="text-[12px] font-bold text-slate-500">카톡 공유</span>
            </button>
            <button onClick={() => { navigator.clipboard.writeText(numbers.join(', ')); alert('복사되었습니다! 🍀'); }} className="flex flex-col items-center gap-2 group transition-all active:scale-90">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-yellow-100 transition-colors shadow-sm">📋</div>
              <span className="text-[12px] font-bold text-slate-500">번호 복사</span>
            </button>
          </div>
        )}
      </main>

      <footer className={`w-full max-w-[360px] py-20 px-6 text-center border-t mt-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex justify-center gap-6 mb-4 text-[12px] font-bold text-slate-400">
          <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-yellow-600 underline transition-colors">개인정보처리방침</button>
          <span>|</span>
          <span className="opacity-50">© 2026 LUCKY GUIDE</span>
        </div>
      </footer>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsPrivacyOpen(false)}>
          <div className={`${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-500'} w-full max-w-[340px] max-h-[70vh] overflow-y-auto rounded-[2rem] p-8 shadow-2xl text-left`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-xl font-black mb-6 border-b pb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>개인정보처리방침</h3>
            <div className="text-[13px] leading-relaxed space-y-6 font-medium">
              <section><p className={`font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>1. 개인정보 수집 미실시</p><p>성함, 연락처 등 일체의 개인 식별 정보를 수집하거나 저장하지 않습니다.</p></section>
              <section><p className={`font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>2. 구글 애드센스 활용</p><p>광고 게재를 위한 구글 쿠키가 사용될 수 있음을 알려드립니다.</p></section>
              <section><p className={`font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-slate-900'}`}>3. 보안 관리</p><p>모든 데이터는 안전한 로컬 환경에서 즉시 처리됩니다.</p></section>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm">확인했습니다</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;