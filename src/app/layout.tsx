import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css'
import Header from '@/components/header/Header';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: ' WIGs ',
  description: ' WIGs  ',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="en" dir='ltr'>
      <body className={`h-full  ${inter.className}`}>
        <Header />
        <ToastContainer theme='colored' position='top-center' />
        
      
        <main >
         {children}
        </main>
 
      </body>
    </html>
  )
}
