import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore with custom databaseId from config
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  storeName?: string;
  role: "owner" | "manager" | "staff" | "guest";
  createdAt: string;
  lastLoginAt: string;
}

export interface UserGeneratedWork {
  id: string;
  userId: string;
  title: string;
  moduleType:
    | "omnistar_10x"
    | "superbrain"
    | "omni_gpt"
    | "growth"
    | "content"
    | "crm"
    | "voice_rep"
    | "geogrid"
    | "business"
    | "code_widget"
    | "deep_research"
    | "batch_engine";
  promptOrInput: string;
  generatedOutput: string;
  favorite?: boolean;
  createdAt: string;
}

// Test Connection on Initial Boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDoc = doc(db, "_health", "probe");
    await getDocFromServer(testDoc);
    return true;
  } catch (err: any) {
    // Permission denied or not-found still confirms server reached
    if (err?.code === "permission-denied" || err?.code === "not-found") {
      return true;
    }
    console.warn("Firestore connection check note:", err?.message || err);
    return false;
  }
}

// Save or Update User Profile in Firestore
export async function saveUserProfile(user: FirebaseUser, storeName?: string, role: UserProfile["role"] = "owner") {
  try {
    const userRef = doc(db, "users", user.uid);
    const profile: UserProfile = {
      id: user.uid,
      email: user.email || `${user.uid.slice(0, 8)}@localbiz.guest`,
      displayName: user.displayName || storeName || "Store Merchant",
      storeName: storeName || "Main Branch",
      role: user.isAnonymous ? "guest" : role,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    await setDoc(userRef, profile, { merge: true });
    return profile;
  } catch (err) {
    console.warn("Could not save user profile to Firestore:", err);
    return null;
  }
}

// Save Work to User's History (Firestore + LocalStorage Mirror)
export async function saveUserGeneratedWork(
  userId: string,
  workData: Omit<UserGeneratedWork, "id" | "userId" | "createdAt">
): Promise<UserGeneratedWork> {
  const newId = `work-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const record: UserGeneratedWork = {
    id: newId,
    userId,
    title: workData.title || "AI Generated Work",
    moduleType: workData.moduleType,
    promptOrInput: workData.promptOrInput || "",
    generatedOutput: workData.generatedOutput,
    favorite: !!workData.favorite,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to LocalStorage mirror immediately for zero latency
  try {
    const localKey = `lbs_user_history_${userId}`;
    const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
    localStorage.setItem(localKey, JSON.stringify([record, ...existing].slice(0, 100)));
  } catch {}

  // 2. Persist to Firestore under /users/{userId}/history/{historyId}
  try {
    const historyDocRef = doc(db, "users", userId, "history", newId);
    await setDoc(historyDocRef, record);
  } catch (err) {
    console.warn("Firestore save note:", err);
  }

  return record;
}

// Load Work History for a User (Firestore with LocalStorage Fallback)
export async function loadUserHistory(userId: string): Promise<UserGeneratedWork[]> {
  try {
    const historyCol = collection(db, "users", userId, "history");
    const q = query(historyCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const records = snapshot.docs.map((d) => d.data() as UserGeneratedWork);
      // update local mirror
      try {
        localStorage.setItem(`lbs_user_history_${userId}`, JSON.stringify(records));
      } catch {}
      return records;
    }
  } catch (err) {
    console.warn("Could not fetch remote history, using local cache:", err);
  }

  // Fallback to local storage mirror
  try {
    const localKey = `lbs_user_history_${userId}`;
    return JSON.parse(localStorage.getItem(localKey) || "[]");
  } catch {
    return [];
  }
}

// Delete a generated work item
export async function deleteUserWork(userId: string, workId: string): Promise<void> {
  // Update local storage
  try {
    const localKey = `lbs_user_history_${userId}`;
    const existing: UserGeneratedWork[] = JSON.parse(localStorage.getItem(localKey) || "[]");
    const filtered = existing.filter((item) => item.id !== workId);
    localStorage.setItem(localKey, JSON.stringify(filtered));
  } catch {}

  // Delete from Firestore
  try {
    const historyDocRef = doc(db, "users", userId, "history", workId);
    await deleteDoc(historyDocRef);
  } catch (err) {
    console.warn("Could not delete from Firestore:", err);
  }
}

// Google Sign-In with Popup (Standard Provisioned Firebase Provider)
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await saveUserProfile(userCredential.user);
  return userCredential.user;
}

export interface LocalMerchantSession {
  uid: string;
  email: string;
  displayName: string;
  isAnonymous: boolean;
}

export function saveLocalMerchantSession(session: LocalMerchantSession) {
  try {
    localStorage.setItem("lbs_local_merchant_session", JSON.stringify(session));
    window.dispatchEvent(new Event("lbs_auth_state_changed"));
  } catch {}
}

export function getLocalMerchantSession(): LocalMerchantSession | null {
  try {
    const saved = localStorage.getItem("lbs_local_merchant_session");
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function clearLocalMerchantSession() {
  try {
    localStorage.removeItem("lbs_local_merchant_session");
    window.dispatchEvent(new Event("lbs_auth_state_changed"));
  } catch {}
}
