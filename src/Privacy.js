import React from 'react';

const Privacy = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto text-sm text-gray-600">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">개인정보처리방침</h1>
      <p className="mb-4">본 사이트는 다음과 같이 개인정보처리방침을 준수합니다.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>구글과 같은 제3자 제공업체는 사용자의 이전 방문을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다.</li>
        <li>구글의 광고 쿠키 사용을 통해 구글과 파트너는 본 사이트 또는 다른 사이트 방문을 토대로 사용자에게 맞춤형 광고를 제공할 수 있습니다.</li>
        <li>사용자는 구글 광고 설정을 방문하여 맞춤 설정 광고를 해제할 수 있습니다.</li>
      </ul>
      <p className="mt-8 text-xs text-gray-400">최종 수정일: 2026년 1월 27일</p>
    </div>
  );
};

export default Privacy;