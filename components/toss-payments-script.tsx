'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    TossPayments: any
  }
}

export function TossPaymentsScript() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1/payment-widget'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
