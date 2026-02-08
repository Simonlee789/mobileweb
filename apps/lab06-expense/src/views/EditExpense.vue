<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input label="ชื่อ" v-model="title" />
      <ion-input label="จำนวนเงิน" type="number" v-model="amount" />

      <ion-button expand="block" @click="updateExpense($event)">
        อัปเดต
      </ion-button>

      <ion-button expand="block" color="danger" @click="deleteExpense($event)">
        ลบ
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton
} from "@ionic/vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const title = ref("");
const amount = ref(0);

onMounted(async () => {
  const snap = await getDoc(doc(db, "expenses", id));
  const data: any = snap.data();

  if (data) {
    title.value = data.title;
    amount.value = data.amount;
  }
});


// ✅ UPDATE
const updateExpense = async (event: any) => {
  (event.target as HTMLElement)?.blur();

  await updateDoc(doc(db, "expenses", id), {
    title: title.value,
    amount: Number(amount.value)
  });

  router.push("/tabs/list");
};



const deleteExpense = async (event: any) => {
  (event.target as HTMLElement)?.blur();

  if (confirm("ยืนยันการลบหรือไม่?")) {
    await deleteDoc(doc(db, "expenses", id));
    router.push("/tabs/list");
  }
};
</script>
