<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Arm Exercise Trainer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding main-container">

      <!-- REP DISPLAY -->
      <div class="rep-container">
        <p class="rep-label">REPETITIONS</p>
        <h1 class="rep-number">{{ state?.repDisplay || 0 }}</h1>
      </div>

      <!-- STATUS -->
      <ion-card class="status-card">
        <ion-card-header>
          <ion-card-title>Status</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <div class="status-box">
            <span :class="state?.stats.lastMessage === 'OK' ? 'ok-text' : 'bad-text'">
              {{ state?.stats.lastMessage || 'Press START to begin' }}
            </span>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- STATS -->
      <div class="stats-container" v-if="state?.stats.repsTotal">
        <div class="stat-box">
          <h3>{{ state.stats.repsTotal }}</h3>
          <p>Total</p>
        </div>

        <div class="stat-box success">
          <h3>{{ state.stats.repsOk }}</h3>
          <p>Correct</p>
        </div>

        <div class="stat-box danger">
          <h3>{{ state.stats.repsBad }}</h3>
          <p>Wrong</p>
        </div>
      </div>

      <div class="score-box" v-if="state?.stats.repsTotal">
        SCORE <span>{{ state.stats.score }}</span>
      </div>

      <!-- BUTTON -->
      <div class="button-area">
        <ion-button
          expand="block"
          size="large"
          color="success"
          @click="handleStart"
          v-if="state?.status !== 'RUNNING'"
        >
          START WORKOUT
        </ion-button>

        <ion-button
          expand="block"
          size="large"
          color="danger"
          @click="handleStop"
          v-else
        >
          STOP WORKOUT
        </ion-button>
      </div>

    </ion-content>

    <ion-footer class="footer">
      663380024-9 วีรภัทร แก้วคำลา
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import { ArmWorkoutEngine } from '../core/ArmWorkoutEngine';
import { MotionService } from '../core/MotionService';
import { TtsService } from '../core/TtsService';
import { HapticsService } from '../core/HapticsService';
import type { WorkoutState } from '../core/types';

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptics = new HapticsService();
const state = ref<WorkoutState | null>(null);

onMounted(() => engine.onChange((s) => (state.value = s)));

async function handleStart() {
  await tts.speak("เริ่มกายบริหารแขน ยกโทรศัพท์ขึ้นลงในแนวตั้ง");
  engine.start();
  await motion.start((s) => {
    const prevReps = state.value?.stats.repsTotal || 0;
    engine.process(s);

    if ((state.value?.stats.repsTotal || 0) > prevReps) {
      if (state.value?.stats.lastMessage === 'OK') {
        haptics.success();
        tts.speak(`${state.value?.repDisplay}`);
      } else {
        haptics.warning();
        tts.speak(state.value?.stats.lastMessage || "");
      }
    }
  });
}

async function handleStop() {
  await motion.stop();
  engine.stop();
  await tts.speak(`จบการทำงาน คะแนนของคุณคือ ${state.value?.stats.score} แต้ม`);
}
</script>

<style scoped>

.main-container{
  text-align:center;
}

.rep-container{
  margin-top:30px;
}

.rep-label{
  font-size:14px;
  color:gray;
  letter-spacing:2px;
}

.rep-number{
  font-size:90px;
  font-weight:700;
  margin:0;
  color:var(--ion-color-primary);
}

.status-card{
  margin-top:20px;
}

.status-box{
  font-size:20px;
  font-weight:bold;
}

.ok-text{
  color:#2dd36f;
}

.bad-text{
  color:#eb445a;
}

.stats-container{
  display:flex;
  justify-content:space-around;
  margin-top:25px;
}

.stat-box{
  background:#f4f4f4;
  padding:15px;
  border-radius:15px;
  width:30%;
}

.stat-box h3{
  margin:0;
  font-size:28px;
}

.success{
  background:#e8fff1;
}

.danger{
  background:#ffeaea;
}

.score-box{
  margin-top:20px;
  font-size:18px;
}

.score-box span{
  font-size:28px;
  font-weight:bold;
  color:var(--ion-color-primary);
}

.button-area{
  margin-top:30px;
}

.footer{
  text-align:center;
  font-size:14px;
}

</style>