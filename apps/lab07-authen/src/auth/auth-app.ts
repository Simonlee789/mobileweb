import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import type { IAuthService, AuthUser, EmailPasswordCredentials } from "./auth-interface";

export class FirebaseAppAuthService implements IAuthService {
    async getCurrentUser(): Promise<AuthUser | null> {
        const { user } = await FirebaseAuthentication.getCurrentUser();
        return user ? { uid: user.uid, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl } : null;
    }

    async loginWithEmailPassword(creds: EmailPasswordCredentials) {
        const { user } = await FirebaseAuthentication.signInWithEmailAndPassword(creds);
        return { uid: user.uid, email: user.email };
    }

    async loginWithGoogle() {
        const { user } = await FirebaseAuthentication.signInWithGoogle();
        return { uid: user.uid, email: user.email, displayName: user.displayName };
    }
    async loginWithPhone(phoneNumber: string): Promise<void> {
        // Native SDK จะจัดการ ReCAPTCHA ให้เองผ่าน SafetyNet/Play Integrity
        await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber });
    }

    async verifyOtp(otp: string): Promise<AuthUser> {
        const result = await FirebaseAuthentication.confirmSignInWithPhoneNumber({
            verificationCode: otp
        });
        const user = result.user;
        return {
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoUrl: user.photoUrl
        };
    }

    async logout() { await FirebaseAuthentication.signOut(); }
}