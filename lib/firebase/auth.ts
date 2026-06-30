import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { auth } from "./config";
import { UserService } from "@/services/UserService";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google using a popup.
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Initialize profile if new
    await UserService.initializeNewUser(
      user.uid,
      user.email || "",
      user.displayName || "",
      user.photoURL || ""
    );
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

/**
 * Register with Email and Password
 */
export const registerWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    await updateProfile(user, { displayName: name });
    await sendEmailVerification(user);
    
    await UserService.initializeNewUser(user.uid, email, name, "");
    
    return user;
  } catch (error) {
    console.error("Error registering with email", error);
    throw error;
  }
};

/**
 * Sign in with Email and Password
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error logging in with email", error);
    throw error;
  }
};

/**
 * Alias for loginWithEmail to support the admin login portal
 */
export const loginUser = loginWithEmail;

/**
 * Request Password Reset
 */
export const requestPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

/**
 * Sign out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
