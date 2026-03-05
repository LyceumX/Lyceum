import { ClerkProvider } from '@clerk/nextjs'
import { Cormorant_Garamond, EB_Garamond } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

export const dynamic = 'force-dynamic'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const proxyUrl = `${protocol}://${host}/api/clerk`

  return (
    <ClerkProvider
      proxyUrl={proxyUrl}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className={`${cormorant.variable} ${ebGaramond.variable}`}>
        <body className="bg-[#FAF9F6] text-[#1C1917] font-serif min-h-screen antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
