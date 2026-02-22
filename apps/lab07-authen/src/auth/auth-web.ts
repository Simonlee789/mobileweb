// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAjMSllMURub-egestm6YqsZA14dgdkYt0",
    authDomain: "lab07-1a6e8.firebaseapp.com",
    projectId: "lab07-1a6e8",
    storageBucket: "lab07-1a6e8.firebasestorage.app",
    messagingSenderId: "628399798765",
    appId: "1:628399798765:web:b36b6b8d59605ad71c4fe4",
    measurementId: "G-BXCYRLM339"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
import {
    getAuth,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
    signOut,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

import { IAuthService } from "./auth-interface";

export class FirebaseWebAuthService implements IAuthService {
    // ประกาศตัวแปรเก็บสถานะภายใน Class
    private confirmationResult: ConfirmationResult | null = null;
    private recaptchaVerifier: RecaptchaVerifier | null = null;

    async getCurrentUser(): Promise<AuthUser | null> {
        const u = auth.currentUser;
        return u ? {
            uid: u.uid,
            email: u.email,
            phoneNumber: u.phoneNumber, // เพิ่มอันนี้ด้วย
            displayName: u.displayName,
            photoUrl: u.photoURL
        } : null;
    }

    async loginWithEmailPassword(creds: EmailPasswordCredentials) {
        const r = await signInWithEmailAndPassword(auth, creds.email, creds.password);
        return { uid: r.user.uid, email: r.user.email, displayName: r.user.displayName };
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const r = await signInWithPopup(auth, provider);
        return { uid: r.user.uid, email: r.user.email, displayName: r.user.displayName };
    }

    async loginWithPhone(phoneNumber: string, containerId: string): Promise<void> {
        // --- ส่วน Cleanup ที่เวิร์กที่สุด ---
        if (this.recaptchaVerifier) {
            this.recaptchaVerifier.clear();
            const element = document.getElementById(containerId);
            if (element) element.innerHTML = '';
        }

        try {
            this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                size: 'invisible'
            });

            this.confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                this.recaptchaVerifier
            );
        } catch (error) {
            if (this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;
            }
            throw error;
        }
    }

    async verifyOtp(otp: string): Promise<AuthUser> {
        if (!this.confirmationResult) throw new Error("กรุณาส่ง OTP ก่อน");

        const result = await this.confirmationResult.confirm(otp);
        const user = result.user;

        return {
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoUrl: user.photoURL
        };
    }

    async logout() {
        await signOut(auth);
        // ล้างค่าสถานะเมื่อ logout
        this.confirmationResult = null;
        if (this.recaptchaVerifier) {
            this.recaptchaVerifier.clear();
            this.recaptchaVerifier = null;
        }
    }
}