<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input v-model="email" type="email" placeholder="example@kku.ac.th"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Password</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>

        <ion-button expand="block" class="ion-margin-top" @click="handleLogin">
          Login with Email
        </ion-button>

        <div class="separator">OR</div>

        <ion-button expand="block" color="danger" @click="handleGoogle">
          <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
          Sign in with Google
        </ion-button>

        <div class="separator">PHONE LOGIN</div>

        <div v-if="!otpSent">
          <ion-item>
            <ion-label position="stacked">Phone Number (+668xxxxxxx)</ion-label>
            <ion-input v-model="phoneNumber" type="tel" placeholder="+66"></ion-input>
          </ion-item>
          <ion-button expand="block" color="tertiary" class="ion-margin-top" @click="handlePhoneLogin">
            <ion-icon slot="start" :icon="callOutline"></ion-icon>
            Send OTP
          </ion-button>
        </div>

        <div v-else class="otp-box">
          <ion-item>
            <ion-label position="stacked">Enter OTP</ion-label>
            <ion-input v-model="otpCode" type="number" placeholder="6-digit code"></ion-input>
          </ion-item>
          <ion-button expand="block" color="success" class="ion-margin-top" @click="handleVerifyOtp">
            Verify OTP
          </ion-button>
          <ion-button fill="clear" expand="block" size="small" @click="otpSent = false">
            Change Number
          </ion-button>
        </div>
        
        <div id="recaptcha-container"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, IonIcon 
} from '@ionic/vue';
import { logoGoogle, callOutline } from 'ionicons/icons';
import { authService } from '@/auth/auth-service';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const phoneNumber = ref('');
const otpCode = ref('');
const otpSent = ref(false);
const router = useRouter();

const handleLogin = async () => {
  try {
    await authService.loginWithEmailPassword({ 
      email: email.value, 
      password: password.value 
    });
    router.replace('/tabs/tab1');
  } catch (error: any) {
    alert("Login Error: " + error.message);
  }
};

const handleGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.replace('/tabs/tab1');
  } catch (error: any) {
    alert("Google Login Error: " + error.message);
  }
};

// ฟังก์ชันใหม่: ส่ง OTP
const handlePhoneLogin = async () => {
  if (!phoneNumber.value.startsWith('+')) {
    alert("กรุณาใส่รหัสประเทศด้วย เช่น +66");
    return;
  }
  try {
    await authService.loginWithPhone(phoneNumber.value, 'recaptcha-container');
    otpSent.value = true;
    alert("OTP has been sent!");
  } catch (error: any) {
    alert("Phone Error: " + error.message);
  }
};

// ฟังก์ชันใหม่: ยืนยัน OTP
const handleVerifyOtp = async () => {
  try {
    await authService.verifyOtp(otpCode.value);
    router.replace('/tabs/tab1');
  } catch (error: any) {
    alert("OTP Error: " + error.message);
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 10%;
}
.separator {
  text-align: center;
  margin: 20px 0;
  color: #888;
  font-size: 0.8rem;
  font-weight: bold;
}
.otp-box {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
#recaptcha-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>