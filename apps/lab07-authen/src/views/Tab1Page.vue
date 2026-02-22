<template>
  <ion-page>
    <ion-header>
      <ion-toolbar><ion-title>โปรไฟล์ผู้ใช้งาน</ion-title></ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="user" class="ion-text-center">
        <ion-avatar style="margin: 0 auto; width: 100px; height: 100px;">
          <img :src="user.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'" />
        </ion-avatar>
        <h2>ยินดีต้อนรับ</h2>
        <p><b>ชื่อ:</b> {{ user.displayName || 'ไม่ระบุชื่อ' }}</p>
        <p><b>อีเมล:</b> {{ user.email }}</p>
        <p><b>เบอร์โทรศัพท์:</b> {{ user.phoneNumber }}</p>
        <p><b>UID:</b> {{ user.uid }}</p>
        
        <ion-button expand="block" color="danger" @click="handleLogout">
          ออกจากระบบ
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { authService } from '@/auth/auth-service';
import { useRouter } from 'vue-router';

const user = ref<any>(null);
const router = useRouter();

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const handleLogout = async () => {
  await authService.logout();
  router.replace('/login');
};
</script>