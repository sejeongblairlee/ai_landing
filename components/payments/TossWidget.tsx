"use client";

import { useEffect, useState } from "react";

export default function TossWidget({ amount = 3 }: { amount?: number }) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const [widgets, setWidgets] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(1300); // 기본 환율
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
        
        // 환율 조회
        try {
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          const data = await response.json();
          const rate = data.rates.KRW || 1300;
          setExchangeRate(rate);
          console.log('현재 환율 (USD to KRW):', rate);
        } catch (err) {
          console.warn('환율 API 호출 실패, 기본값 사용:', err);
        }
        
        // 스크립트 태그로 TossPayments SDK 로드
        const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v1';
        
        script.onload = () => {
          try {
            // @ts-ignore
            const tp = window.TossPayments(clientKey);
            console.log("TossPayments 인스턴스:", tp);
            console.log("사용 가능한 메서드:", Object.keys(tp));
            
            // requestPayment 메서드가 있는지 확인
            if (typeof tp.requestPayment !== 'function') {
              throw new Error(`tp.requestPayment is not a function. Available methods: ${Object.keys(tp)}`);
            }
            
            setWidgets(tp);
            setReady(true);
            setLoading(false);
            console.log("TossWidget 초기화 완료");
          } catch (err) {
            console.error("TossWidget 초기화 오류:", err);
            setError(`결제 위젯 초기화에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            setLoading(false);
          }
        };
        
        script.onerror = () => {
          console.error("TossPayments SDK 로드 실패");
          setError("결제 위젯 초기화에 실패했습니다: SDK 로드 실패");
          setLoading(false);
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error("TossWidget 초기화 오류:", err);
        setError(`결제 위젯 초기화에 실패했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
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
          Premium 플랜 - ₩{Math.round(amount * exchangeRate).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          15회 추가 검색 크레딧 • 환율: 1 USD = ₩{exchangeRate.toLocaleString()}
        </p>
      </div>
      
      <button
        disabled={!ready}
        className="w-full h-12 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        style={{ backgroundColor: '#B0FF01', color: '#000000' }}
        onClick={async () => {
          try {
            console.log("결제 요청 시작:", { widgets, ready });
            
            const amountInKRW = Math.round(amount * exchangeRate);
            console.log('결제 금액:', { USD: amount, KRW: amountInKRW, exchangeRate });
            
            await widgets.requestPayment('카드', {
              orderId: crypto.randomUUID(),
              orderName: "Find AI Premium ($3)",
              amount: amountInKRW, // 원화 금액
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
