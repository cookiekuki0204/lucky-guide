import React, { useState } from 'react';
import html2canvas from 'html2canvas';

const KAKAO_KEY = "8ee405ddc4c4db04b8de8268a8317426"; 

const Lotto = ({ onBack }) => {
  const [numbers, setNumbers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const startLotto = () => {
    setIsRunning(true);
    setIsDone(false);
    setNumbers([]);
    const finalNums = Array.from({length: 45}, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .sort((a, b) => a - b);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setNumbers(finalNums.slice(0, count));
      if (count === 6) {
        clearInterval(interval);
        setTimeout(() => { setIsRunning(false); setIsDone(true); }, 800);
      }
    }, 400);
  };

  // ✅ 번호 텍스트 복사 기능 추가 완료
  const copyNumbers = () => {
    const text = `🍀 럭키 가이드 행운 번호: ${numbers.join(', ')}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("번호가 복사되었습니다! 원하는 곳에 붙여넣으세요.");
    });
  };

  const saveImage = async () => {
    const element = document.getElementById('capture-area');
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'lucky-numbers.png';
    link.click();
  };

  const shareKakao = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) kakao.init(KAKAO_KEY);
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '🍀 오늘의 로또 행운 번호',
          description: `번호: ${numbers.join(', ')}`,
          imageUrl: 'https://lucky-guide.pages.dev/logo192.png',
          link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' },
        },
        buttons: [{ title: '나도 번호 뽑기', link: { mobileWebUrl: 'https://lucky-guide.pages.dev', webUrl: 'https://lucky-guide.pages.dev' } }],
      });
    } else {
      alert('카카오 SDK를 확인해주세요.');
    }
  };

  const getColor = (n) => {
    if (n <= 10) return 'bg-[#fbc400] text-white';
    if (n <= 20) return 'bg-[#69c8f2] text-white';
    if (n <= 30) return 'bg-[#ff7272] text-white';
    if (n <= 40) return 'bg-[#aaaaaa] text-white';
    return 'bg-[#b0d840] text-white';
  };

  return (
    <div className="w-full max-w-[360px] animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-50">
        <div id="capture-area" className="p-10 pb-8 text-center bg-white font-sans">
          <h2 className="text-xl font-black text-slate-800 mb-1">로또 행운 번호</h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-widest mb-10">Lucky Guide</p>
          <div className="flex justify-center gap-2 min-h-[48px]">
            {numbers.map((n, i) => (
              <div key={i} className={`${getColor(n)} w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shadow-lg shadow-slate-200`}>{n}</div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8 space-y-4">
          {!isDone ? (
            <button onClick={startLotto} disabled={isRunning} className="w-full py-4 rounded-2xl font-black bg-indigo-600 text-white shadow-xl active:scale-95 transition-all">
              {isRunning ? '추첨 중...' : '번호 추첨하기'}
            </button>
          ) : (
            <>
              <button onClick={startLotto} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black active:scale-95 transition-all shadow-xl">다시 추첨하기</button>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button onClick={saveImage} className="flex flex-col items-center p-3 bg-slate-50 rounded-xl group transition-all">
                  <span className="text-xl mb-1 group-hover:scale-110">💾</span>
                  <span className="text-[9px] font-bold text-slate-500">이미지 저장</span>
                </button>
                <button onClick={copyNumbers} className="flex flex-col items-center p-3 bg-slate-50 rounded-xl group transition-all">
                  <span className="text-xl mb-1 group-hover:scale-110">📋</span>
                  <span className="text-[9px] font-bold text-slate-500">번호 복사</span>
                </button>
                <button onClick={shareKakao} className="flex flex-col items-center p-3 bg-yellow-50 rounded-xl group transition-all">
                  <span className="text-xl mb-1 group-hover:scale-110">💬</span>
                  <span className="text-[9px] font-bold text-slate-600">카톡 공유</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <button onClick={onBack} className="w-full mt-6 text-slate-400 text-[11px] font-bold text-center underline underline-offset-4">← 홈으로 돌아가기</button>
    </div>
  );
};

export default Lotto;