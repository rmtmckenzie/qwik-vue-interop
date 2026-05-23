<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  counter: number;
  onUpdate: (current: number) => void;
}>();

const localCount = ref(0);

// Watch for Qwik updates to sync into local count
watch(() => props.counter, (newVal) => {
  localCount.value = newVal;
}, { immediate: true });

const increment = () => {
  localCount.value++;
  props.onUpdate(localCount.value);
};
</script>

<template>
  <div class="vue-card">
    <div class="header">
      <span class="logo">Vue Component</span>
      <span class="badge">Reactive Island</span>
    </div>
    <div class="body">
      <p class="desc">This section is fully rendered and animated by <strong>Vue 3</strong>. It is instantiated inside Qwik and maintains reactive props and events.</p>
      
      <div class="metrics">
        <div class="metric">
          <span class="label">Prop from Qwik:</span>
          <span class="value number">{{ props.counter }}</span>
        </div>
        <div class="metric">
          <span class="label">Vue Local Count:</span>
          <span class="value id-vue-count highlighted">{{ localCount }}</span>
        </div>
      </div>

      <button id="vue-button" @click="increment" class="btn btn-vue">
        <span>Click to Increment Vue Counter</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.vue-card {
  background: rgba(65, 184, 131, 0.08);
  border: 1px solid rgba(65, 184, 131, 0.2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.logo {
  font-weight: 700;
  color: #41B883;
  font-size: 1.1rem;
}
.badge {
  background: #41B883;
  color: #1e1e24;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
}
.desc {
  color: #a0a0b0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
}
.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}
.metric {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.label {
  display: block;
  font-size: 0.75rem;
  color: #808090;
  margin-bottom: 4px;
}
.value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}
.highlighted {
  color: #41B883;
}
.btn-vue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  background: linear-gradient(135deg, #41B883 0%, #35495E 100%);
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-vue:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(65, 184, 131, 0.3);
}
.btn-vue:active {
  transform: translateY(0);
}
</style>
