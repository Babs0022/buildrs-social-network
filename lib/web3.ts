import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// Helper to format wallet address for display
export function formatWalletAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Helper to validate wallet address format
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Simple signature verification placeholder
export function verifyWalletSignature(message: string, signature: string, address: string): boolean {
  // In a real app, you would verify the signature properly
  // For now, just return true if all parameters are provided
  return !!(message && signature && address && isValidWalletAddress(address))
}

// ENS resolution helper (placeholder)
export async function resolveENS(address: string): Promise<string | null> {
  try {
    // ENS resolution would go here
    return null
  } catch (error) {
    console.error("ENS resolution failed:", error)
    return null
  }
}
