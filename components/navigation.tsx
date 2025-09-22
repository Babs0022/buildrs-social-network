"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAuth } from "@/components/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from "lucide-react"

export function Navigation() {
  const { user, profile, signOutUser } = useAuth()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">
          BUILDRS
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
            Feed
          </Link>
          <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Leaderboard
          </Link>
          {user && (
            <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
              Create
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && profile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.displayName} />
                  <AvatarFallback>{profile.displayName?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{profile.displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/profile/${profile.username}`} className="gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOutUser} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <WalletConnectButton />
            <Button variant="ghost" asChild>
              <Link href="/auth/connect">Connect Wallet</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
