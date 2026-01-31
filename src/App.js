import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-0349GV858G');

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const cardRef = useRef(null);

  const [sajuData, setSajuData] = useState({ date: '', time: 'unknown' });
  const [sajuResult, setSajuResult] = useState(null);
  const [aiStep, setAiStep] = useState('input');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

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

  const copyToClipboard = () => {
    if (numbers.length === 0) return;
    navigator.clipboard.writeText(`럭키가이드 행운 번호: ${numbers.join(', ')}`).then(() => {
      alert('행운의 번호가 복사되었습니다!');
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setAiStep('loading');
      setTimeout(() => setAiStep('result'), 3000);
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', scale: 2 });
    const link = document.createElement('a');
    link.download = `lucky-numbers.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const shareKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) return;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '🍀 내 행운 번호 확인하기',
        description: 'AI가 분석한 로또 번호와 운세!',
        imageUrl: 'https://lucky-guide.pages.dev/og-image.png',
        link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' },
      },
      buttons: [{ title: '무료 확인', link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' } }],
    });
  };

  const bgClass = isDarkMode ? "bg-[#0f172a] text-slate-100" : "bg-[#ffffff] text-slate-800";

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center font-sans transition-colors duration-300`}>
      <header className="w-full max-w-[500px] sticky top-0 z-40 bg-inherit border-b">
        <div className="pt-10 pb-4 text-center relative">
          <h1 className="text-2xl font-black italic tracking-tighter">LUCKY GUIDE</h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="absolute right-4 top-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 shadow-sm">{isDarkMode ? '☀️' : '🌙'}</button>
        </div>
        <nav className="flex overflow-x-auto no-scrollbar px-2">
          {[
            { id: 'lotto', label: '로또추첨' },
            { id: 'saju', label: 'AI사주' },
            { id: 'face', label: 'AI관상' },
            { id: 'palm', label: 'AI손금' },
            { id: 'dream', label: '꿈해몽' },
            { id: 'guide', label: '띠별운세' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setAiStep('input'); setSajuResult(null); setSelectedImage(null); }} 
              className={`flex-1 py-4 px-4 text-[13px] font-black whitespace-nowrap ${activeTab === tab.id ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-slate-400'}`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="w-full max-w-[400px] p-6 flex flex-col items-center">
        <div ref={cardRef} className={`w-full p-8 rounded-[2.5rem] shadow-2xl mb-8 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}>
          {/* 로또 탭 */}
          {activeTab === 'lotto' && (
            <div className="text-center">
              <h2 className="text-xl font-black mb-10 text-yellow-500">LUCKY NUMBERS</h2>
              <div className="flex justify-center gap-2 mb-12 h-12">
                {numbers.length > 0 ? numbers.map((n, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-900 text-yellow-400 flex items-center justify-center font-bold shadow-md border border-yellow-500/20">{n}</div>
                )) : <div className="text-slate-300 font-bold uppercase tracking-widest pt-2">Waiting for Luck</div>}
              </div>
              <button onClick={generateNumbers} className="w-full py-5 rounded-2xl bg-yellow-500 text-slate-900 font-black text-lg shadow-xl active:scale-95 transition-transform">번호 생성하기</button>
            </div>
          )}

          {/* 사주 탭 - 설명글 복구 */}
          {activeTab === 'saju' && (
            <div className="text-center py-4">
              {!sajuResult ? (
                <div className="space-y-6">
                  <span className="text-5xl block">🎎</span>
                  <h2 className="text-xl font-black">AI 사주 분석</h2>
                  <p className="text-[12px] opacity-70">태어난 날의 기운을 분석하여<br/>당신의 재물운 흐름을 알려드립니다.</p>
                  <input type="date" className={`w-full p-4 rounded-xl border-2 outline-none font-bold ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white'}`} onChange={(e) => setSajuData({...sajuData, date: e.target.value})} />
                  <button onClick={() => {
                    if(!sajuData.date) return alert("날짜를 선택해주세요.");
                    setIsSpinning(true);
                    setTimeout(() => {
                      setSajuResult({title: "천복성(天福星)의 기운", desc: "당신의 사주는 타고난 재물 창고가 매우 넓고 견고합니다. 평생 먹을 복이 끊이지 않으며, 특히 올해는 '편재'의 운이 강하게 들어와 예상치 못한 장소에서 횡재수가 따를 상입니다. 주변 사람과의 협력을 통해 부의 크기가 더 커질 것입니다."});
                      setIsSpinning(false);
                    }, 1500);
                  }} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black">재물운 분석하기</button>
                </div>
              ) : (
                <div className="text-left animate-in fade-in">
                  <h3 className="text-lg font-black text-yellow-500 mb-4">{sajuResult.title}</h3>
                  <div className={`p-5 rounded-2xl text-[13px] leading-relaxed mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    {sajuResult.desc}
                  </div>
                  <button onClick={() => setSajuResult(null)} className="w-full py-3 border rounded-xl text-xs font-bold text-slate-400">다시 입력하기</button>
                </div>
              )}
            </div>
          )}

          {/* 관상 탭 - 설명글 복구 */}
          {activeTab === 'face' && (
            <div className="text-center py-4">
              {aiStep === 'input' && (
                <div className="space-y-6">
                  <span className="text-5xl block">🎭</span>
                  <h2 className="text-xl font-black">AI 관상 재물운</h2>
                  <p className="text-[12px] opacity-70">얼굴의 오관(五官)을 분석하여<br/>타고난 복과 재물운을 스캔합니다.</p>
                  <label className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black block cursor-pointer shadow-lg">얼굴 사진 업로드<input type="file" className="hidden" onChange={handleImageUpload} /></label>
                </div>
              )}
              {aiStep === 'loading' && <div className="py-10 animate-pulse font-black text-lg text-yellow-500">이목구비와 기운을 정밀 분석 중...</div>}
              {aiStep === 'result' && (
                <div className="animate-in slide-in-from-bottom-4 text-left">
                  <h3 className="text-lg font-black text-yellow-500 mb-4">황금빛 부자 관상</h3>
                  <div className={`p-5 rounded-2xl text-[13px] leading-relaxed mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    이마가 넓고 깨끗하여 초년운이 좋으며, 코의 준두(끝부분)가 도톰하여 재물을 끌어모으는 강력한 힘이 있습니다. 입꼬리가 위로 향해 있어 들어온 복이 나가지 않는 전형적인 '부자 관상'입니다.
                  </div>
                  <button onClick={() => setAiStep('input')} className="w-full py-3 border rounded-xl text-xs font-bold text-slate-400">다른 사진으로 분석</button>
                </div>
              )}
            </div>
          )}

          {/* 손금 탭 - 설명글 복구 */}
          {activeTab === 'palm' && (
            <div className="text-center py-4">
              {aiStep === 'input' && (
                <div className="space-y-6">
                  <span className="text-5xl block">✋</span>
                  <h2 className="text-xl font-black">AI 손금 재물운</h2>
                  <p className="text-[12px] opacity-70">손바닥의 주요 선들을 추적하여<br/>미래의 성공과 재력을 예측합니다.</p>
                  <label className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black block cursor-pointer shadow-lg">손바닥 사진 업로드<input type="file" className="hidden" onChange={handleImageUpload} /></label>
                </div>
              )}
              {aiStep === 'loading' && <div className="py-10 animate-pulse font-black text-lg text-yellow-500">생명선과 재물선을 정밀 스캔 중...</div>}
              {aiStep === 'result' && (
                <div className="animate-in slide-in-from-bottom-4 text-left">
                  <h3 className="text-lg font-black text-yellow-500 mb-4">강력한 재물운의 손금</h3>
                  <div className={`p-5 rounded-2xl text-[13px] leading-relaxed mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                    운명선이 손목부터 중지까지 곧게 뻗어 있어 스스로의 노력으로 큰 성공을 이룰 타입입니다. 특히 약지 아래의 태양선이 선명하여 노년으로 갈수록 명예와 부가 함께 따르는 귀한 손금을 가졌습니다.
                  </div>
                  <button onClick={() => setAiStep('input')} className="w-full py-3 border rounded-xl text-xs font-bold text-slate-400">다른 사진으로 분석</button>
                </div>
              )}
            </div>
          )}

          {/* 꿈해몽 탭 */}
          {activeTab === 'dream' && (
            <div className="w-full">
              <h2 className="text-xl font-black mb-6 text-center text-yellow-500">당첨 길몽 10선</h2>
              <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                {[
                  {t: "조상님이 밝게 웃는 꿈", d: "가문에 재물이 들어오고 큰 횡재수가 따를 징조입니다."},
                  {t: "온몸이 오물로 뒤덮이는 꿈", d: "현실에서 막대한 현금이 들어올 전조인 최고의 길몽입니다."},
                  {t: "집이 활활 타오르는 꿈", d: "사업이 번창하고 재산이 급격히 늘어남을 상징합니다."},
                  {t: "대통령과 악수하는 꿈", d: "최고의 명예와 함께 큰 행운이 따를 귀한 꿈입니다."},
                  {t: "피를 흥건하게 흘리는 꿈", d: "막혔던 금전운이 시원하게 뚫려 큰 이득을 봅니다."},
                  {t: "돼지가 품으로 안기는 꿈", d: "전형적인 복권 당첨 꿈으로 재물운 상승을 뜻합니다."},
                  {t: "황금 열쇠를 얻는 꿈", d: "인생의 큰 기회를 잡고 신분이 수직 상승합니다."},
                  {t: "집안에 맑은 물이 차는 꿈", d: "재산이 차곡차곡 쌓여 거부가 될 징조입니다."},
                  {t: "유명인이 집에 방문하는 꿈", d: "귀인의 도움으로 재물운이 크게 열리는 꿈입니다."},
                  {t: "하늘 높이 비행기를 타는 꿈", d: "목표를 달성하고 큰 행운을 잡게 되는 길몽입니다."}
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 border-yellow-500 ${isDarkMode ? 'bg-slate-700/40' : 'bg-slate-50'}`}>
                    <h3 className="font-black text-sm mb-1">{i+1}. {item.t}</h3>
                    <p className="text-[11px] opacity-70 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 띠별운세 탭 */}
          {activeTab === 'guide' && (
            <div className="w-full space-y-4">
              <h2 className="text-xl font-black mb-4 text-center text-yellow-500">띠별 행운 가이드</h2>
              {[
                {g: "쥐, 용, 원숭이", n: "1, 6, 15", d: "북쪽 / 블랙", t: "침착하게 기다리면 큰 복이 저절로 찾아옵니다."},
                {g: "소, 뱀, 닭", n: "2, 7, 24", d: "서쪽 / 화이트", t: "주변 사람들과 화합할 때 운이 급상승합니다."},
                {g: "호랑이, 말, 개", n: "3, 8, 12", d: "남쪽 / 레드", t: "자신감 있게 추진하면 반드시 얻는 게 있습니다."},
                {g: "토끼, 양, 돼지", n: "4, 9, 21", d: "동쪽 / 그린", t: "순리대로 행하면 재물이 자연스럽게 따릅니다."}
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <h3 className="font-black text-yellow-500 mb-2">{item.g}띠</h3>
                  <div className="text-[12px] space-y-1">
                    <p><strong>행운의 조합:</strong> {item.n} | {item.d}</p>
                    <p className="italic opacity-60">"{item.t}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'lotto' && numbers.length > 0 && (
          <div className="grid grid-cols-3 gap-6 w-full mb-10 animate-in fade-in">
            <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl group-active:scale-95 transition-transform shadow-sm">📋</div>
              <span className="text-[11px] font-bold opacity-60">번호 복사</span>
            </button>
            <button onClick={downloadImage} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl group-active:scale-95 transition-transform shadow-sm">💾</div>
              <span className="text-[11px] font-bold opacity-60">이미지 저장</span>
            </button>
            <button onClick={shareKakao} className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center text-2xl group-active:scale-95 transition-transform shadow-sm">💬</div>
              <span className="text-[11px] font-bold opacity-60">카톡 공유</span>
            </button>
          </div>
        )}
      </main>

      <footer className="w-full py-16 text-center border-t mt-auto text-[11px] font-bold text-slate-400">
        <button onClick={() => setIsPrivacyOpen(true)} className="mb-2 underline block mx-auto hover:text-slate-600">개인정보처리방침</button>
        © 2026 LUCKY GUIDE
      </footer>

      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-8 rounded-[2.5rem] max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <h2 className="text-xl font-black mb-6">개인정보처리방침</h2>
            <div className="text-[12px] leading-relaxed space-y-4 opacity-90">
              <p><strong>1. 수집 항목 및 방법</strong>: 본 서비스는 이름, 연락처 등 민감한 개인정보를 수집하지 않습니다. 분석용 사진은 브라우저 내에서만 처리되며 서버에 저장되지 않습니다.</p>
              <p><strong>2. 분석 도구</strong>: 서비스 개선 및 방문자 분석을 위해 Google Analytics(GA4)를 사용하여 익명화된 로그만 수집합니다.</p>
              <p><strong>3. 데이터 보안</strong>: 입력된 생년월일 정보는 운세 분석용으로만 활용되며 페이지 새로고침 시 즉시 삭제됩니다.</p>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-8 py-5 bg-yellow-500 text-slate-900 font-black rounded-2xl shadow-lg">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;