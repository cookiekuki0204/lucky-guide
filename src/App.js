import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ReactGA from 'react-ga4';

// 구글 애널리틱스 초기화
ReactGA.initialize('G-0349GV858G');

function App() {
  const [activeTab, setActiveTab] = useState('lotto');
  const [numbers, setNumbers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const cardRef = useRef(null);

  // AI 기능용 상태값
  const [sajuData, setSajuData] = useState({ date: '', time: 'unknown' });
  const [sajuResult, setSajuResult] = useState(null);
  const [aiStep, setAiStep] = useState('input'); // input, loading, result
  const [selectedImage, setSelectedImage] = useState(null);

  // 페이지 뷰 추적
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  // 로또 번호 생성
  const generateNumbers = () => {
    setIsSpinning(true);
    ReactGA.event({ category: 'Lotto', action: 'Generate Numbers' });
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

  // 번호 복사
  const copyToClipboard = () => {
    if (numbers.length === 0) return;
    navigator.clipboard.writeText(`럭키가이드 행운 번호: ${numbers.join(', ')}`).then(() => {
      alert('행운의 번호가 복사되었습니다!');
      ReactGA.event({ category: 'Lotto', action: 'Copy Numbers' });
    });
  };

  // 사주 분석 로직
  const analyzeSaju = () => {
    if (!sajuData.date) return alert("생년월일을 선택해주세요!");
    setIsSpinning(true);
    ReactGA.event({ category: 'AI', action: 'Analyze Saju' });
    setTimeout(() => {
      const results = [
        { title: "천복성(天福星)의 기운", desc: "당신의 사주는 타고난 재물 창고가 매우 넓고 견고합니다. 평생 먹을 복이 끊이지 않으며, 특히 올해는 '편재'의 운이 강하게 들어와 예상치 못한 장소에서 횡재수가 따를 상입니다. 주변 사람과의 협력을 통해 부의 크기가 더 커질 것입니다." },
        { title: "황금 들판의 기운", desc: "성실함이 결국 큰 재산으로 변하는 귀한 사주입니다. 현재 대운이 금(金)의 기운으로 흐르고 있어 결실을 맺기 매우 좋은 시기입니다. 직관을 믿고 움직인다면 로또와 같은 큰 재물운도 충분히 잡을 수 있는 운명입니다." }
      ];
      setSajuResult(results[Math.floor(Math.random() * results.length)]);
      setIsSpinning(false);
    }, 2000);
  };

  // 이미지 업로드 로직
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setAiStep('loading');
      ReactGA.event({ category: 'AI', action: `Analyze ${activeTab}` });
      setTimeout(() => setAiStep('result'), 3000);
    }
  };

  // 이미지 저장
  const downloadImage = async () => {
    if (!cardRef.current) return;
    ReactGA.event({ category: 'Share', action: 'Download Image' });
    const canvas = await html2canvas(cardRef.current, { backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', scale: 2 });
    const link = document.createElement('a');
    link.download = `lucky-numbers.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // 카카오톡 공유
  const shareKakao = () => {
    if (!window.Kakao) return;
    const kakao = window.Kakao;
    if (!kakao.isInitialized()) kakao.init('8ee405ddc4c4db04b8de8268a8317426');
    ReactGA.event({ category: 'Share', action: 'Kakao Share' });
    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: numbers.length > 0 ? `🍀 내 행운 번호: ${numbers.join(', ')}` : '🍀 오늘 내 운세는?',
        description: 'AI가 분석한 로또 번호와 운세를 확인해보세요!',
        imageUrl: 'https://lucky-guide.pages.dev/og-image.png',
        link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' },
      },
      buttons: [{ title: '내 행운 확인하기', link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' } }],
    });
  };

  const bgClass = isDarkMode ? "bg-[#0f172a]" : "bg-[#ffffff]";

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center font-sans transition-colors duration-300`}>
      <header className="w-full max-w-[600px] pt-12 pb-6">
        <div className="flex justify-between items-center mb-8 px-6">
          <div className="w-10"></div>
          {/* 1. 타이틀: 이탈릭체 제거 및 정자체 볼드 적용 */}
          <h1 className={`text-3xl font-[900] tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#1e293b]'}`}>LUCKY GUIDE</h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {isDarkMode ? '🌙' : '🌙'}
          </button>
        </div>
        
        <nav className="flex overflow-x-auto no-scrollbar border-b border-slate-100 px-4">
          {[
            { id: 'lotto', label: '로또추첨' },
            { id: 'saju', label: 'AI사주' },
            { id: 'face', label: 'AI관상' },
            { id: 'palm', label: 'AI손금' },
            { id: 'dream', label: '꿈해몽' },
            { id: 'guide', label: '띠별운세' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => {setActiveTab(tab.id); setAiStep('input'); setSajuResult(null); setSelectedImage(null);}} 
              className={`flex-1 py-4 px-6 text-[15px] font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? (isDarkMode ? 'text-yellow-400 border-b-4 border-yellow-400' : 'text-slate-900 border-b-4 border-[#eab308]') : 'text-slate-300'}`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="w-full max-w-[450px] px-6 pb-20 flex flex-col items-center">
        {/* AD SLOT TOP */}
        <div className="w-full py-3 mb-10 border border-slate-100 rounded-full text-center bg-slate-50/30">
          <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">ADVERTISEMENT - TOP</span>
        </div>

        <div ref={cardRef} className={`w-full p-12 rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] mb-10 text-center flex flex-col items-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          {activeTab === 'lotto' && (
            <>
              <div className="mb-8 text-4xl">✨</div>
              <h2 className={`text-[26px] font-[900] mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>당신의 운을 믿으세요</h2>
              <p className="text-[13px] font-bold text-slate-300 tracking-[0.15em] mb-12 uppercase">LUCKY GUIDE PREMIUM</p>
              
              <div className="h-16 flex items-center justify-center mb-12">
                {numbers.length > 0 ? (
                  <div className="flex gap-2">
                    {numbers.map((n, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-[#1e293b] text-[#facc15] flex items-center justify-center font-bold shadow-md border border-yellow-500/20">{n}</div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-200 font-bold tracking-[0.3em] text-sm uppercase">READY TO LUCK</span>
                )}
              </div>

              <button 
                onClick={generateNumbers}
                disabled={isSpinning}
                className="w-full py-6 rounded-[2rem] font-[900] text-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #e9c46a 0%, #f4a261 100%)',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(244, 162, 97, 0.4)'
                }}
              >
                {isSpinning ? '생성 중...' : '행운 번호 받기'}
              </button>
            </>
          )}

          {activeTab === 'saju' && (
             <div className="w-full">
                {!sajuResult ? (
                  <div className="space-y-8">
                    <span className="text-5xl block">🎎</span>
                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : ''}`}>AI 사주 재물운</h2>
                    <p className="text-[13px] opacity-50 leading-relaxed text-center">태어난 날의 기운을 분석하여<br/>당신의 재물운 흐름을 스캔합니다.</p>
                    
                    {/* 3. 사주 입력 필드 수정: 날짜 + 태어난 시간 */}
                    <div className="space-y-4">
                      <input 
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full p-5 rounded-2xl border-2 outline-none font-bold text-center ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-100'}`}
                      onChange={(e) => setSajuData({...sajuData, date: e.target.value})} 
                      />
                      <select className={`w-full p-5 rounded-2xl border-2 outline-none font-bold text-center appearance-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-100'}`} onChange={(e) => setSajuData({...sajuData, time: e.target.value})}>
                        <option value="unknown">태어난 시간 선택 (모름)</option>
                        <option value="0">자시 (23~01시)</option><option value="1">축시 (01~03시)</option>
                        <option value="2">인시 (03~05시)</option><option value="3">묘시 (05~07시)</option>
                        <option value="4">진시 (07~09시)</option><option value="5">사시 (09~11시)</option>
                        <option value="6">오시 (11~13시)</option><option value="7">미시 (13~15시)</option>
                        <option value="8">신시 (15~17시)</option><option value="9">유시 (17~19시)</option>
                        <option value="10">술시 (19~21시)</option><option value="11">해시 (21~23시)</option>
                      </select>
                    </div>
                    <button onClick={analyzeSaju} className="w-full py-6 rounded-3xl bg-[#1e293b] text-white font-black text-lg shadow-lg">분석하기</button>
                  </div>
                ) : (
                  <div className="text-left animate-in fade-in">
                    <h3 className="text-lg font-black text-yellow-600 mb-4">{sajuResult.title}</h3>
                    <div className={`p-6 rounded-3xl text-[14px] leading-relaxed mb-8 ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                      {sajuResult.desc}
                    </div>
                    <button onClick={() => setSajuResult(null)} className="w-full py-4 border-2 rounded-2xl text-xs font-bold text-slate-300">다시 입력</button>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'face' && (
            <div className="w-full text-center">
              {aiStep === 'input' && (
                <div className="space-y-8">
                  <span className="text-5xl block">🎭</span>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : ''}`}>AI 관상 재물운</h2>
                  <p className="text-[13px] opacity-50 leading-relaxed">얼굴의 이목구비를 분석하여<br/>타고난 복과 재물운을 스캔합니다.</p>
                  <label className="w-full py-6 rounded-3xl bg-[#1e293b] text-white font-black text-lg block cursor-pointer shadow-lg">사진 업로드<input type="file" className="hidden" onChange={handleImageUpload} /></label>
                </div>
              )}
              {aiStep === 'loading' && <div className="py-20 animate-pulse font-black text-lg text-yellow-500">관상의 기운을 정밀 분석 중...</div>}
              {aiStep === 'result' && (
                <div className="text-left animate-in slide-in-from-bottom-4">
                  <h3 className="text-lg font-black text-yellow-500 mb-4">황금빛 부자 관상</h3>
                  <div className={`p-6 rounded-3xl text-[14px] leading-relaxed mb-8 ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    분석 결과, 이마가 넓고 깨끗하여 초년운이 매우 좋으며 코의 준두가 도톰하여 재물을 끌어모으는 강력한 기운이 있습니다. 전형적인 재물이 끊이지 않는 부자 관상입니다.
                  </div>
                  <button onClick={() => setAiStep('input')} className="w-full py-4 border-2 rounded-2xl text-xs font-bold text-slate-300">다시 분석</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'palm' && (
            <div className="w-full text-center">
              {aiStep === 'input' && (
                <div className="space-y-8">
                  <span className="text-5xl block">✋</span>
                  <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : ''}`}>AI 손금 재물운</h2>
                  <p className="text-[13px] opacity-50 leading-relaxed">손바닥의 주요 선들을 추적하여<br/>미래의 성공과 재력을 예측합니다.</p>
                  <label className="w-full py-6 rounded-3xl bg-[#1e293b] text-white font-black text-lg block cursor-pointer shadow-lg">손바닥 사진 업로드<input type="file" className="hidden" onChange={handleImageUpload} /></label>
                </div>
              )}
              {aiStep === 'loading' && <div className="py-20 animate-pulse font-black text-lg text-yellow-500">손금의 선들을 정밀 스캔 중...</div>}
              {aiStep === 'result' && (
                <div className="text-left animate-in slide-in-from-bottom-4">
                  <h3 className="text-lg font-black text-yellow-500 mb-4">강력한 재물운의 손금</h3>
                  <div className={`p-6 rounded-3xl text-[14px] leading-relaxed mb-8 ${isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    생명선과 두뇌선이 굵고 선명하며, 특히 약지 아래로 뻗은 태양선이 매우 강력합니다. 이는 스스로의 힘으로 명예와 막대한 부를 일굴 수 있는 귀한 손금임을 뜻합니다.
                  </div>
                  <button onClick={() => setAiStep('input')} className="w-full py-4 border-2 rounded-2xl text-xs font-bold text-slate-300">다시 분석</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'dream' && (
            <div className="w-full">
              <h2 className="text-xl font-black mb-8 text-center text-yellow-600">당첨 길몽 10선</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
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
                  <div key={i} className={`p-5 rounded-3xl border-l-4 border-yellow-500 shadow-sm text-left ${isDarkMode ? 'bg-slate-700/40 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    <h3 className="font-black text-sm mb-1">{i+1}. {item.t}</h3>
                    <p className="text-[11px] opacity-80 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="w-full space-y-4">
              <h2 className="text-xl font-black mb-6 text-center text-yellow-600">띠별 행운 포인트</h2>
              {[
                {g: "쥐, 용, 원숭이", n: "1, 6, 15, 29, 44", d: "북쪽 / 블랙", t: "침착하게 기다리면 큰 복이 찾아옵니다."},
                {g: "소, 뱀, 닭", n: "2, 7, 24, 33, 41", d: "서쪽 / 화이트", t: "주변과 화합할 때 운이 급상승합니다."},
                {g: "호랑이, 말, 개", n: "3, 8, 12, 28, 39", d: "남쪽 / 레드", t: "자신감 있게 추진하면 반드시 성과가 있습니다."},
                {g: "토끼, 양, 돼지", n: "4, 9, 21, 35, 42", d: "동쪽 / 그린", t: "순리대로 행하면 재물이 자연스럽게 따릅니다."}
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-[2.5rem] border ${isDarkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-100 bg-slate-50/50'} text-left`}>
                  <h3 className="font-black text-yellow-500 mb-3 text-base">{item.g}띠</h3>
                  <div className="text-[12px] space-y-2">
                    <p><strong>행운 번호:</strong> {item.n}</p>
                    <p><strong>행운 방향/색상:</strong> {item.d}</p>
                    <p className="italic opacity-60 mt-3 pt-3 border-t">"{item.t}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AD SLOT BOTTOM */}
        <div className="w-full py-3 mb-10 border border-slate-100 rounded-full text-center bg-slate-50/30">
          <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">ADVERTISEMENT - BOTTOM</span>
        </div>

        {/* 공유/복사 섹션 */}
        {activeTab === 'lotto' && numbers.length > 0 && (
          <div className="grid grid-cols-3 gap-8 w-full px-4">
            <button onClick={copyToClipboard} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl active:scale-90 transition-all">📋</div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Copy</span>
            </button>
            <button onClick={downloadImage} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl active:scale-90 transition-all">💾</div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Save</span>
            </button>
            <button onClick={shareKakao} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-[#FEE500] rounded-2xl shadow-xl flex items-center justify-center text-2xl active:scale-90 transition-all">💬</div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Share</span>
            </button>
          </div>
        )}
      </main>

      <footer className="w-full py-10 text-center mt-auto border-t border-slate-50">
        <button onClick={() => setIsPrivacyOpen(true)} className="text-[11px] font-bold text-slate-300 underline mb-2">개인정보처리방침</button>
        <p className="text-[11px] font-bold text-slate-200 uppercase tracking-tighter">© 2026 LUCKY GUIDE. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* 개인정보 모달 */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-sm p-10 rounded-[3rem] max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
            <h2 className="text-xl font-black mb-8 border-b pb-4">개인정보처리방침</h2>
            <div className="text-[12px] leading-relaxed space-y-6 opacity-90 text-left">
              <p><strong>1. 수집 항목</strong>: 본 서비스는 이름, 연락처 등 개인 식별 정보를 수집하지 않습니다. 분석용 사진은 브라우저 내에서만 처리되며 서버에 저장되지 않습니다.</p>
              <p><strong>2. 분석 도구</strong>: Google Analytics(GA4)를 사용하여 서비스 개선을 위한 익명 통계만 수집합니다.</p>
              <p><strong>3. 데이터 보안</strong>: 입력된 생년월일은 분석 즉시 파기되며 어디에도 저장되지 않습니다.</p>
            </div>
            <button onClick={() => setIsPrivacyOpen(false)} className="w-full mt-10 py-5 bg-yellow-500 text-slate-900 font-black rounded-3xl shadow-xl">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;