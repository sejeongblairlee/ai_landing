import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { TossPaymentsScript } from "@/components/toss-payments-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Find AI - AI 툴 추천 서비스",
  description: "사용자의 작업에 맞는 최적의 AI 툴을 추천해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TossPaymentsScript />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
