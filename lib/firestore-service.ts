import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserConfig {
  uid: string
  repoUrl: string
  branch: string
  commitMessage: string
  interval: number
  githubToken: string
  commitType: string
  customFilePath: string
  customFileContent: string
  scheduleType: string
  cronExpression: string
  smartScheduling: boolean
  batchSize: number
  repositories: any[]
  updatedAt: string
}

export interface CommitLog {
  id?: string
  uid: string
  message: string
  timestamp: string
  sha: string
  status: "success" | "error"
  url?: string
  type: string
  repository?: string
  createdAt: any
}

export interface Template {
  id?: string
  uid: string
  name: string
  message: string
  type: string
  content: string
  createdAt: any
}

// User Configuration
export const saveUserConfig = async (uid: string, config: Omit<UserConfig, "uid" | "updatedAt">) => {
  const configData: UserConfig = {
    ...config,
    uid,
    updatedAt: new Date().toISOString(),
  }
  await setDoc(doc(db, "userConfigs", uid), configData)
}

export const getUserConfig = async (uid: string): Promise<UserConfig | null> => {
  const docSnap = await getDoc(doc(db, "userConfigs", uid))
  return docSnap.exists() ? (docSnap.data() as UserConfig) : null
}

// Commit Logs
export const addCommitLog = async (uid: string, log: Omit<CommitLog, "uid" | "createdAt">) => {
  const logData: Omit<CommitLog, "id"> = {
    ...log,
    uid,
    createdAt: serverTimestamp(),
  }
  await addDoc(collection(db, "commitLogs"), logData)
}

export const getUserCommitLogs = async (uid: string, limitCount = 100): Promise<CommitLog[]> => {
  const q = query(
    collection(db, "commitLogs"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as CommitLog)
}

export const clearUserCommitLogs = async (uid: string) => {
  const q = query(collection(db, "commitLogs"), where("uid", "==", uid))
  const querySnapshot = await getDocs(q)
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref))
  await Promise.all(deletePromises)
}

// Templates
export const saveTemplate = async (uid: string, template: Omit<Template, "uid" | "createdAt">) => {
  const templateData: Omit<Template, "id"> = {
    ...template,
    uid,
    createdAt: serverTimestamp(),
  }
  await addDoc(collection(db, "templates"), templateData)
}

export const getUserTemplates = async (uid: string): Promise<Template[]> => {
  const q = query(collection(db, "templates"), where("uid", "==", uid), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Template)
}

export const deleteTemplate = async (templateId: string) => {
  await deleteDoc(doc(db, "templates", templateId))
}

// Analytics
export const updateUserStats = async (
  uid: string,
  stats: {
    totalCommits?: number
    successfulCommits?: number
    failedCommits?: number
    repositoriesManaged?: number
    averageCommitTime?: number
  },
) => {
  await updateDoc(doc(db, "users", uid), stats)
}
