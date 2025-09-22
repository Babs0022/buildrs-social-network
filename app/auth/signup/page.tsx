"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAccount } from "wagmi"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Wallet, Trophy, Zap } from "lucide-react"

export default function SignUpPage() {
  const { isConnected } = useAccount()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isConnected && user && !isLoading) {
      router.push("/feed")
    }
  }, [isConnected, user, isLoading, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join BUILDRS</CardTitle>
          <CardDescription>
            Connect your wallet to create your builder profile and start showcasing your projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <WalletConnectButton />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sm">What you get with BUILDRS:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Showcase your builds and projects</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Build your reputation with builder scores</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="w-5 h-5 text-blue-500" />
                <span>Get discovered by the community</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Wallet className="w-5 h-5 text-purple-500" />
                <span>Own your identity with Web3</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have a wallet connected?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
