"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAccount } from "wagmi"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ConnectWalletPage() {
  const { isConnected } = useAccount()
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Connect page state:", { isConnected, user: !!user, profile: !!profile, isLoading })

    if (isConnected && user && profile && !isLoading) {
      console.log("[v0] Redirecting user, onboarding completed:", profile.onboardingCompleted)
      if (profile.onboardingCompleted === false) {
        router.push("/onboarding")
      } else {
        router.push("/feed")
      }
    }
  }, [isConnected, user, profile, isLoading, router])

  if (isConnected && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Setting up your account...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
          <CardDescription>
            Sign in to BUILDRS using your Web3 wallet. Your wallet address will be your unique identity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <WalletConnectButton />
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Why connect your wallet?</p>
            <ul className="space-y-1 text-xs">
              <li>• Your wallet address is your unique identity</li>
              <li>• No passwords to remember</li>
              <li>• Secure authentication via cryptographic signatures</li>
              <li>• Own your data and reputation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
