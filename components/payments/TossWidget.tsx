"use client";

import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

export default function TossWidget({ amount = 3 }: { amount?: number }) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const [widgets, setWidgets] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (!clientKey || !origin) return;
    (async () => {
      const tp = await loadTossPayments(clientKey);
      const w = tp.widgets({ customerKey: ANONYMOUS });
      await w.setAmount({ currency: "USD", value: amount });
      await Promise.all([
        w.renderPaymentMethods({ selector: "#payment-method" }),
        w.renderAgreement({ selector: "#agreement" }),
      ]);
      setWidgets(w);
      setReady(true);
    })().catch(console.error);
  }, [clientKey, origin, amount]);

  if (!clientKey) return <p>환경변수 누락: NEXT_PUBLIC_TOSS_CLIENT_KEY</p>;
  return (
    <div>
      <div id="payment-method" />
      <div id="agreement" />
      <button
        disabled={!ready}
        onClick={async () => {
          try {
            await widgets.requestPayment({
              orderId: crypto.randomUUID(),
              orderName: "Find AI Premium ($3)",
              successUrl: `${origin}/payments/success`,
              failUrl: `${origin}/payments/fail`,
            });
          } catch (e) {
            console.error(e);
            alert("결제 시작 중 오류가 발생했습니다.");
          }
        }}
      >
        결제하기
      </button>
    </div>
  );
}
