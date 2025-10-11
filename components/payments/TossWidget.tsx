"use client";

import { useEffect, useState } from "react";

export default function TossWidget({ amount = 3 }: { amount?: number }) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const [widgets, setWidgets] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    if (!clientKey || !origin) {
      setError("환경변수 또는 origin이 설정되지 않았습니다.");
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("TossWidget 초기화 시작:", { clientKey: !!clientKey, origin });
        
        // 동적 import로 TossPayments SDK 로드
        const TossPayments = await import("@tosspayments/tosspayments-sdk");
        console.log("TossPayments SDK 로드됨:", TossPayments);
        
        const tp = await TossPayments.loadTossPayments(clientKey);
        console.log("TossPayments 인스턴스:", tp);
        
        // customerKey 생성 (영문 대소문자, 숫자, 특수문자 포함)
        const customerKey = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("customerKey:", customerKey);
        
        // 최신 TossPayments SDK는 widgets 대신 직접 결제 요청 방식 사용
        // 위젯 렌더링 대신 결제 버튼만 표시
        setWidgets(tp);
        setReady(true);
        
        console.log("TossWidget 초기화 완료");
      } catch (err) {
        console.error("TossWidget 초기화 오류:", err);
        setError(`결제 위젯 초기화에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [clientKey, origin, amount]);

  if (!clientKey) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-sm text-red-600 dark:text-red-400">환경변수 누락: NEXT_PUBLIC_TOSS_CLIENT_KEY</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        <span className="text-gray-600 dark:text-gray-400">결제 위젯 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Premium 플랜 - ${amount} USD
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          15회 추가 검색 크레딧
        </p>
      </div>
      
      <button
        disabled={!ready}
        className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={async () => {
          try {
            console.log("결제 요청 시작:", { widgets, ready });
            
            await widgets.requestPayment({
              orderId: crypto.randomUUID(),
              orderName: "Find AI Premium ($3)",
              amount: amount * 100, // 센트 단위로 변환
              successUrl: `${origin}/payments/success`,
              failUrl: `${origin}/payments/fail`,
            });
          } catch (e) {
            console.error("결제 요청 오류:", e);
            alert(`결제 시작 중 오류가 발생했습니다: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
          }
        }}
      >
        {ready ? "결제하기" : "로딩 중..."}
      </button>
    </div>
  );
}
