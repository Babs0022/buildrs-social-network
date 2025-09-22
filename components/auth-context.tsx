"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { isValidWalletAddress } from "@/lib/web3"

interface AuthContextType {
  user: any | null
  profile: any | null
  isLoading: boolean
  signInWithWallet: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const signInWithWallet = async () => {
    if (!address || !signMessageAsync || !isValidWalletAddress(address)) return

    try {
      setIsLoading(true)

      // Create a message to sign
      const message = `Sign in to BUILDRS with your wallet: ${address}\nTimestamp: ${Date.now()}`

      // Sign the message
      const signature = await signMessageAsync({ message })

      // Check if profile exists in Firestore
      const profileRef = doc(db, "profiles", address)
      const profileSnap = await getDoc(profileRef)

      if (!profileSnap.exists()) {
        const newProfile = {
          id: address,
          walletAddress: address,
          username: `builder_${address.slice(-6)}`,
          displayName: `Builder ${address.slice(-6)}`,
          bio: "",
          avatar: "",
          skills: [],
          builderScore: 0,
          totalUpvotes: 0,
          buildStreak: 0,
          socialLinks: {},
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await setDoc(profileRef, newProfile)
        setProfile(newProfile)
      } else {
        setProfile(profileSnap.data())
      }

      // Set user as authenticated
      setUser({ address, signature })
    } catch (error) {
      console.error("Wallet sign-in failed:", error)
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  useEffect(() => {
    if (isConnected && address && !user) {
      signInWithWallet()
    } else if (!isConnected && user) {
      signOutUser()
    }
  }, [isConnected, address])

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signInWithWallet,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
