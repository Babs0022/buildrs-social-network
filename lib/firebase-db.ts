import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// Types for Firebase collections
export interface FirebaseProfile {
  id: string // wallet address
  walletAddress: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  skills?: string[] // Added skills array for onboarding
  builderScore: number
  totalUpvotes: number
  buildStreak: number
  socialLinks: {
    github?: string
    twitter?: string
    farcaster?: string
  }
  onboardingCompleted?: boolean // Added onboarding completion flag
  createdAt: string
  updatedAt: string
}

export interface FirebaseBuild {
  id: string
  userId: string // wallet address
  type: "launch" | "update" | "experiment"
  title: string
  description: string
  tags: string[]
  links: {
    demo?: string
    github?: string
    website?: string
  }
  media: string[]
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface FirebaseVote {
  id: string
  userId: string // wallet address
  buildId: string
  voteType: "upvote" | "downvote"
  createdAt: string
}

export interface FirebaseComment {
  id: string
  userId: string // wallet address
  buildId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface FirebaseFollow {
  id: string
  followerId: string // wallet address
  followingId: string // wallet address
  createdAt: string
}

// Profile operations
export async function createProfile(profile: Omit<FirebaseProfile, "createdAt" | "updatedAt">) {
  const now = new Date().toISOString()
  const profileData = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(doc(db, "profiles", profile.id), profileData)
  return profileData
}

export async function getProfile(walletAddress: string): Promise<FirebaseProfile | null> {
  const docRef = doc(db, "profiles", walletAddress)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as FirebaseProfile
  }
  return null
}

export async function getProfileByUsername(username: string): Promise<FirebaseProfile | null> {
  const q = query(collection(db, "profiles"), where("username", "==", username), limit(1))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as FirebaseProfile
  }
  return null
}

export async function updateProfile(walletAddress: string, updates: Partial<FirebaseProfile>) {
  const docRef = doc(db, "profiles", walletAddress)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

// Build operations
export async function createBuild(build: Omit<FirebaseBuild, "id" | "createdAt" | "updatedAt">) {
  const buildRef = doc(collection(db, "builds"))
  const now = new Date().toISOString()

  const buildData = {
    ...build,
    id: buildRef.id,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(buildRef, buildData)
  return buildData
}

export async function getBuild(buildId: string): Promise<FirebaseBuild | null> {
  const docRef = doc(db, "builds", buildId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as FirebaseBuild
  }
  return null
}

export async function getBuildsByUser(userId: string): Promise<FirebaseBuild[]> {
  const q = query(collection(db, "builds"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data() as FirebaseBuild)
}

export async function getAllBuilds(limitCount = 50): Promise<FirebaseBuild[]> {
  const q = query(collection(db, "builds"), orderBy("createdAt", "desc"), limit(limitCount))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data() as FirebaseBuild)
}

export async function updateBuild(buildId: string, updates: Partial<FirebaseBuild>) {
  const docRef = doc(db, "builds", buildId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

// Vote operations
export async function createVote(vote: Omit<FirebaseVote, "id" | "createdAt">) {
  const voteRef = doc(collection(db, "votes"))
  const voteData = {
    ...vote,
    id: voteRef.id,
    createdAt: new Date().toISOString(),
  }

  await setDoc(voteRef, voteData)

  // Update build vote counts
  const buildRef = doc(db, "builds", vote.buildId)
  if (vote.voteType === "upvote") {
    await updateDoc(buildRef, { upvotes: increment(1) })
  } else {
    await updateDoc(buildRef, { downvotes: increment(1) })
  }

  return voteData
}

export async function getUserVote(userId: string, buildId: string): Promise<FirebaseVote | null> {
  const q = query(collection(db, "votes"), where("userId", "==", userId), where("buildId", "==", buildId), limit(1))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as FirebaseVote
  }
  return null
}

export async function removeVote(voteId: string, buildId: string, voteType: "upvote" | "downvote") {
  await deleteDoc(doc(db, "votes", voteId))

  // Update build vote counts
  const buildRef = doc(db, "builds", buildId)
  if (voteType === "upvote") {
    await updateDoc(buildRef, { upvotes: increment(-1) })
  } else {
    await updateDoc(buildRef, { downvotes: increment(-1) })
  }
}

// Comment operations
export async function createComment(comment: Omit<FirebaseComment, "id" | "createdAt" | "updatedAt">) {
  const commentRef = doc(collection(db, "comments"))
  const now = new Date().toISOString()

  const commentData = {
    ...comment,
    id: commentRef.id,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(commentRef, commentData)

  // Update build comment count
  const buildRef = doc(db, "builds", comment.buildId)
  await updateDoc(buildRef, { commentCount: increment(1) })

  return commentData
}

export async function getCommentsByBuild(buildId: string): Promise<FirebaseComment[]> {
  const q = query(collection(db, "comments"), where("buildId", "==", buildId), orderBy("createdAt", "asc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data() as FirebaseComment)
}

// Follow operations
export async function createFollow(followerId: string, followingId: string) {
  const followRef = doc(collection(db, "follows"))
  const followData = {
    id: followRef.id,
    followerId,
    followingId,
    createdAt: new Date().toISOString(),
  }

  await setDoc(followRef, followData)
  return followData
}

export async function removeFollow(followerId: string, followingId: string) {
  const q = query(
    collection(db, "follows"),
    where("followerId", "==", followerId),
    where("followingId", "==", followingId),
    limit(1),
  )
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    await deleteDoc(querySnapshot.docs[0].ref)
  }
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const q = query(
    collection(db, "follows"),
    where("followerId", "==", followerId),
    where("followingId", "==", followingId),
    limit(1),
  )
  const querySnapshot = await getDocs(q)

  return !querySnapshot.empty
}

export async function getFollowers(userId: string): Promise<string[]> {
  const q = query(collection(db, "follows"), where("followingId", "==", userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data().followerId)
}

export async function getFollowing(userId: string): Promise<string[]> {
  const q = query(collection(db, "follows"), where("followerId", "==", userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => doc.data().followingId)
}
