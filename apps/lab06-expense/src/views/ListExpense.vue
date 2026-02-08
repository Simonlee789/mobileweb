<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการทั้งหมด</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- summary -->
      <ion-card>
        <ion-card-content>
          รายรับ: {{ totalIncome }} บาท<br />
          รายจ่าย: {{ totalExpense }} บาท
        </ion-card-content>
      </ion-card>

      <!-- list -->
      <ion-list>
        <ion-item
          v-for="item in expenses"
          :key="item.id"
          button
          @click="goEdit($event, item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.amount }} บาท ({{ item.type }})</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent
} from "@ionic/vue";

const router = useRouter();
const expenses = ref<any[]>([]);

let unsubscribe: any = null;


// ✅ realtime read
onMounted(() => {
  unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});


// ✅ ป้องกัน memory leak
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});


// ✅ คำนวณรวม
const totalIncome = computed(() =>
  expenses.value
    .filter(e => e.type === "income")
    .reduce((s, e) => s + Number(e.amount), 0)
);

const totalExpense = computed(() =>
  expenses.value
    .filter(e => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount), 0)
);



const goEdit = (event: any, id: string) => {
  (event.target as HTMLElement)?.blur();
  router.push(`/tabs/edit/${id}`);
};
</script>
