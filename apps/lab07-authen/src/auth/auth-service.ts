import { Capacitor } from "@capacitor/core";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";
import type { IAuthService } from "./auth-interface";

export const authService: IAuthService =
    Capacitor.isNativePlatform()
        ? new FirebaseAppAuthService()
        : new FirebaseWebAuthService();