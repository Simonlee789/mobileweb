export interface AuthUser {
    uid: string;
    email?: string | null;
    phoneNumber?: string | null;
    displayName?: string | null;
    photoUrl?: string | null;
}

export interface EmailPasswordCredentials {
    email: string;
    password: string;
}

export interface IAuthService {
    getCurrentUser(): Promise<AuthUser | null>;
    loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser>;
    loginWithGoogle(): Promise<AuthUser>;
    logout(): Promise<void>;

    loginWithPhone(phoneNumber: string, containerId: string): Promise<void>;
    verifyOtp(otp: string): Promise<AuthUser>;
}