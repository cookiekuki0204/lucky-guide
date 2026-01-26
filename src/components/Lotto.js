import React, { useState } from 'react';

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

  const getColor = (n) => {
    if (n <= 10) return 'bg-[#fbc400] text-white';
    if (n <= 20) return 'bg-[#69c8f2] text-white';
    if (n <= 30) return 'bg-[#ff7272] text-white';
    if (n <= 40) return 'bg-[#aaaaaa] text-white';
    return 'bg-[#b0d840] text-white';
  };

  return (
    <div className="w-full max-w-[360px] animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white">
        <div id="capture-area" className="p-8 pb-6 text-center bg-white">
          <h2 className="text-xl font-black text-slate-800 mb-1">로또 행운 번호</h2>
          <div className="flex justify-center gap-1.5 mt-8 mb-8 min-h-[48px]">
            {numbers.map((n, i) => (
              <div key={i} className={`${getColor(n)} w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-inner animate-bounce`}>
                {n}
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {!isDone ? (
            <button onClick={startLotto} disabled={isRunning} className="w-full py-4 rounded-xl font-black bg-indigo-600 text-white shadow-lg active:scale-95 transition-all">
              {isRunning ? '번호 생성 중...' : '추첨 시작하기'}
            </button>
          ) : (
            <button onClick={startLotto} className="w-full py-4 bg-slate-800 text-white rounded-xl font-black active:scale-95 transition-all">다시 추첨하기</button>
          )}
        </div>
      </div>
      <button onClick={onBack} className="w-full mt-4 text-slate-400 text-xs text-center underline">← 홈으로 돌아가기</button>
    </div>
  );
};

export default Lotto;