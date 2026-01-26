import React, { useState } from 'react';
import html2canvas from 'html2canvas'; // 설치 여부를 여기서 확인합니다.

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
        setTimeout(() => {
          setIsRunning(false);
          setIsDone(true);
        }, 800);
      }
    }, 400);
  };

  // ✅ 실제 이미지 저장 기능
  const saveImage = async () => {
    const element = document.getElementById('capture-area');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2 // 화질을 높입니다.
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'lucky-numbers.png';
      link.click();
    } catch (err) {
      alert('이미지 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("링크가 복사되었습니다! 친구들에게 공유해보세요.");
    });
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
        {/* 이미지로 캡처될 영역 */}
        <div id="capture-area" className="p-10 pb-8 text-center bg-white">
          <h2 className="text-xl font-black text-slate-800 mb-1">로또 행운 번호</h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-10">Lucky Guide</p>
          
          <div className="flex justify-center gap-2 min-h-[48px]">
            {numbers.length > 0 ? numbers.map((n, i) => (
              <div key={i} className={`${getColor(n)} w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shadow-lg shadow-slate-200`}>
                {n}
              </div>
            )) : (
              <div className="flex gap-2">
                {[1,2,3,4,5,6].map((_, i) => (
                  <div key={i} className="w-11 h-11 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-200 text-xs font-bold italic">?</div>
                ))}
              </div>
            )}
          </div>
          {isDone && <p className="mt-6 text-[10px] text-slate-300 font-medium">https://lucky-guide.pages.dev</p>}
        </div>

        <div className="px-8 pb-8 space-y-4">
          {!isDone ? (
            <button onClick={startLotto} disabled={isRunning} className="w-full py-4 rounded-2xl font-black bg-indigo-600 text-white shadow-xl shadow-indigo-100 active:scale-95 transition-all">
              {isRunning ? '기운을 모으는 중...' : '행운 번호 추첨하기'}
            </button>
          ) : (
            <>
              <button onClick={startLotto} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black active:scale-95 transition-all shadow-xl shadow-slate-200">
                다시 추첨하기
              </button>
              
              <div className="grid grid-cols-3 gap-3 pt-2">
                <button onClick={saveImage} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform">💾</span>
                  <span className="text-[10px] font-bold text-slate-500">이미지 저장</span>
                </button>
                <button onClick={copyLink} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🔗</span>
                  <span className="text-[10px] font-bold text-slate-500">링크 복사</span>
                </button>
                <button onClick={() => alert('카카오톡 SDK 설정이 필요합니다!')} className="flex flex-col items-center justify-center p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group">
                  <span className="text-xl mb-1 group-hover:scale-110 transition-transform">💬</span>
                  <span className="text-[10px] font-bold text-slate-600">카톡 공유</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <button onClick={onBack} className="w-full mt-6 text-slate-400 text-[11px] font-bold text-center underline underline-offset-4 hover:text-slate-600 transition-colors font-sans">
        ← 홈으로 돌아가기
      </button>
    </div>
  );
};

export default Lotto;