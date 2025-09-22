"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAccount } from "wagmi"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Shield, Key, Users } from "lucide-react"

export default function SignInPage() {
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
          <CardTitle className="text-2xl font-bold">Welcome back to BUILDRS</CardTitle>
          <CardDescription>
            Connect your wallet to access your builder profile and showcase your projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <WalletConnectButton />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-primary" />
              <span>Secure wallet-based authentication</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Key className="w-5 h-5 text-primary" />
              <span>Your wallet address is your identity</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-5 h-5 text-primary" />
              <span>Build your reputation on-chain</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            New to BUILDRS?{" "}
            <Link href="/auth/connect" className="text-primary hover:underline inline-flex items-center gap-1">
              Get started <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
