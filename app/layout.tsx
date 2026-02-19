import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* 使用 #FAF9F6 作为古典米白底色，字体默认 serif */}
        <body className="bg-[#FAF9F6] text-slate-800 font-serif min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
