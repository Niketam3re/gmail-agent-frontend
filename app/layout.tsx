import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Email Assistant - Smart Gmail Replies',
  description: 'Automatically generate intelligent email replies with AI-powered assistance',
  keywords: ['email', 'gmail', 'ai', 'assistant', 'productivity'],
  authors: [{ name: 'AI Email Assistant Team' }],
  creator: 'AI Email Assistant',
  publisher: 'AI Email Assistant',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gmail-assistant.com',
    title: 'AI Email Assistant - Smart Gmail Replies',
    description: 'Automatically generate intelligent email replies with AI-powered assistance',
    siteName: 'AI Email Assistant',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Email Assistant - Smart Gmail Replies',
    description: 'Automatically generate intelligent email replies with AI-powered assistance',
    creator: '@aiemailassist',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}