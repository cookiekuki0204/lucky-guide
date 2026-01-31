import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  // 사용하지 않는 isPrivacyOpen 제거
  const [isDarkMode, setIsDarkMode] = useState(false);
  const cardRef = useRef(null);

  // AI 기능용 상태값
  const [sajuData, setSajuData] = useState({ date: '', time: 'unknown' });
  const [sajuResult, setSajuResult] = useState(null);
  const [aiStep, setAiStep] = useState('input'); // input, loading, result
  // 사용하지 않는 aiType 제거
  const [selectedImage, setSelectedImage] = useState(null);

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

  // 공통 AI 분석 시뮬레이션
  const startAiAnalysis = () => {
    setAiStep('loading');
    setTimeout(() => {
      setAiStep('result');
    }, 3000);
  };

  const analyzeSaju = () => {
    if (!sajuData.date) return alert("생년월일을 선택해주세요!");
    setIsSpinning(true);
    setTimeout(() => {
      const sajuResults = [
        { title: "천복성(天福星)의 기운", desc: "타고난 재물 창고가 넓어 평생 먹을 복이 끊이지 않는 사주입니다. 특히 올해는 '편재'의 기운이 강하게 들어와 예상치 못한 횡재수가 따를 수 있습니다.", lucky: "금전운: 95%, 횡재수: 상", tip: "토요일 오후, 동쪽 방향의 판매점을 이용해보세요." },
        { title: "황금 들판의 기운", desc: "성실함이 재물로 이어지는 사주이나, 가끔씩 찾아오는 운의 흐름을 잡는 직관이 탁월합니다. 현재 대운이 금(金)의 기운으로 흐르고 있어 결실을 맺기 좋은 시기입니다.", lucky: "금전운: 88%, 횡재수: 중상", tip: "금속 재질의 액세서리를 착용하면 행운이 상승합니다." },
        { title: "수처작주(隨處作主)의 기운", desc: "어디서든 주인이 될 상이며 스스로 운명을 개척하는 힘이 강합니다. 로또와 같은 큰 재물은 본인의 컨디션이 가장 좋을 때 직감적으로 찾아옵니다.", lucky: "금전운: 92%, 횡재수: 최상", tip: "붉은색 아이템을 지니고 번호를 선택하는 것이 유리합니다." }
      ];
      setSajuResult(sajuResults[new Date(sajuData.date).getDate() % 3]);
      setIsSpinning(false);
    }, 2000);
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        scale: 2,
        useCORS: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const balls = clonedDoc.querySelectorAll('.lotto-ball');
          balls.forEach(ball => {
            ball.style.display = 'table';
            const span = ball.querySelector('span');
            if (span) {
              span.style.display = 'table-cell';
              span.style.verticalAlign = 'middle';
              span.style.textAlign = 'center';
              span.style.lineHeight = '1';
            }
          });
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      startAiAnalysis();
    }
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
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setAiStep('input'); setSajuResult(null); setSelectedImage(null); }} className={tabClass(tab.id)}>
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
              <div className="text-center mb-10"><span className="text-5xl mb-4 block animate-bounce">✨</span><h2 className="text-2xl font-black">당신의 운을 믿으세요</h2><p className="text-slate-400 text-[12px] mt-2 font-bold tracking-widest uppercase">Lucky Guide Premium</p></div>
              <div className="flex justify-center items-center gap-3 mb-12 h-14 w-full" style={{ display: 'flex', justifyContent: 'center' }}>
                {numbers.length > 0 ? numbers.map((num, i) => (
                  <div key={i} className="lotto-ball w-12 h-12 rounded-full bg-slate-900 text-yellow-400 font-bold text-xl shadow-lg border border-yellow-500/30" style={{ display: 'table', borderCollapse: 'separate', flexShrink: 0 }}>
                    <span style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>{num}</span>
                  </div>
                )) : <div className="text-slate-300 text-base font-bold tracking-widest uppercase">Ready to Luck</div>}
              </div>
              <button onClick={generateNumbers} disabled={isSpinning} style={{ background: 'linear-gradient(45deg, #D4AF37, #F9E29B, #B8860B, #F9E29B)', backgroundSize: '400% 400%', animation: isSpinning ? 'none' : 'glimmer 3s ease infinite', display: 'block', width: '100%' }} className={`py-6 rounded-2xl font-black text-slate-900 text-xl shadow-xl ${isSpinning ? 'opacity-50' : ''}`}>{isSpinning ? '기운을 모으는 중...' : '행운 번호 받기'}</button>
            </div>
          )}

          {activeTab === 'saju' && (
            <div className="flex flex-col items-center w-full">
              {!sajuResult ? (
                <div className="w-full text-center py-4">
                  <span className="text-6xl mb-6 block">🎎</span>
                  <h2 className="text-2xl font-black mb-6">당신의 사주를 분석합니다</h2>
                  <div className={`p-6 rounded-3xl space-y-4 mb-8 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    <div className="flex flex-col text-left"><label className="text-[12px] font-bold text-slate-400 mb-2 uppercase ml-1">Birth Date</label>
                    <input type="date" className={`w-full p-4 rounded-2xl font-bold outline-none border-2 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-100'}`} onChange={(e) => setSajuData({...sajuData, date: e.target.value})} /></div>
                    <div className="flex flex-col text-left"><label className="text-[12px] font-bold text-slate-400 mb-2 uppercase ml-1">Birth Time</label>
                    <select className={`w-full p-4 rounded-2xl font-bold outline-none border-2 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-100'}`} onChange={(e) => setSajuData({...sajuData, time: e.target.value})}>
                      <option value="unknown">모름 / 선택안함</option><option value="0">자시 (23~01시)</option><option value="2">축시 (01~03시)</option><option value="4">인시 (03~05시)</option><option value="6">묘시 (05~07시)</option><option value="8">진시 (07~09시)</option><option value="10">사시 (09~11시)</option><option value="12">오시 (11~13시)</option><option value="14">미시 (13~15시)</option><option value="16">신시 (15~17시)</option><option value="18">유시 (17~19시)</option><option value="20">술시 (19~21시)</option><option value="22">해시 (21~23시)</option>
                    </select></div>
                  </div>
                  <button onClick={analyzeSaju} disabled={isSpinning} className={`w-full py-6 rounded-2xl font-black text-xl shadow-xl transition-all ${isSpinning ? 'bg-slate-300' : 'bg-slate-900 text-white'}`}>{isSpinning ? '운명을 분석 중...' : '사주 분석하기'}</button>
                </div>
              ) : (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="text-center mb-6"><span className="text-4xl">📜</span><h2 className="text-2xl font-black mt-2">{sajuResult.title}</h2></div>
                  <div className={`p-6 rounded-3xl text-left text-[14px] leading-relaxed font-medium space-y-4 mb-6 ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    <p>{sajuResult.desc}</p><p className="text-yellow-600 font-black">✨ {sajuResult.lucky}</p><p className="text-sm opacity-80 italic">💡 {sajuResult.tip}</p>
                  </div>
                  <button onClick={() => setSajuResult(null)} className="w-full py-4 rounded-2xl font-bold text-slate-400 border border-slate-200">다시 입력하기</button>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'face' || activeTab === 'palm') && (
            <div className="flex flex-col items-center w-full">
              {aiStep === 'input' && (
                <div className="text-center py-6 w-full">
                  <span className="text-6xl mb-6 block">{activeTab === 'face' ? '🎭' : '✋'}</span>
                  <h2 className="text-2xl font-black mb-4">{activeTab === 'face' ? '관상 분석' : '손금 분석'}</h2>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">사진을 업로드하면 AI가 당신의<br/>재물복과 행운을 분석합니다.</p>
                  <label className="w-full py-6 rounded-2xl font-black text-xl shadow-xl bg-slate-900 text-white block cursor-pointer hover:bg-black transition-colors">
                    사진 업로드하기
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
              {aiStep === 'loading' && (
                <div className="text-center py-12 w-full">
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {selectedImage && <img src={selectedImage} alt="scanning" className="w-full h-full object-cover rounded-2xl opacity-50" />}
                    <div className="absolute inset-0 border-t-4 border-yellow-500 animate-scan shadow-[0_-10px_15px_rgba(234,179,8,0.5)]"></div>
                  </div>
                  <h3 className="text-xl font-black animate-pulse">AI 이미지 분석 중...</h3>
                  <p className="text-slate-400 text-sm mt-2">랜드마크를 추출하여 특징을 계산하고 있습니다.</p>
                </div>
              )}
              {aiStep === 'result' && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="text-center mb-6"><span className="text-4xl">💎</span><h2 className="text-2xl font-black mt-2">{activeTab === 'face' ? '황금빛 부자 관상' : '성공의 삼지창 손금'}</h2></div>
                  <div className={`p-6 rounded-3xl text-left text-[14px] leading-relaxed font-medium space-y-4 mb-6 ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    <p>{activeTab === 'face' ? "얼굴의 '중정' 부위가 매우 조화로워 중년 이후의 재물운이 강력합니다. 특히 코끝의 기운이 둥글게 맺혀 있어 재산이 밖으로 새나가지 않는 전형적인 부자 관상입니다." : "약지 아래로 뻗은 태양선이 매우 선명합니다. 이는 대중의 인기와 금전적 성취를 동시에 거둘 수 있는 운명임을 시사합니다. 손바닥의 두툼한 기운이 행운을 담고 있습니다."}</p>
                    <p className="text-yellow-600 font-black">✨ 분석 점수: 94점</p>
                  </div>
                  <button onClick={() => setAiStep('input')} className="w-full py-4 rounded-2xl font-bold text-slate-400 border border-slate-200">다시 분석하기</button>
                </div>
              )}
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
          <span className="opacity-50">© 2026 LUCKY GUIDE</span>
        </div>
      </footer>
    </div>
  );
}

export default App;