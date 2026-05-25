# qwik-vue-interop

A high-performance bridge allowing you to render **Vue 3** components inside **Qwik** applications with seamless reactivity, props/events synchronization, and selective island hydration.

Targeted for **Qwik 1.x** and **Vue 3.x**.

## Features

- ⚡️ **Selective Hydration**: Choose when to hydrate your Vue component islands (`load`, `visible`, `idle`, or `hover`).
- 🔄 **Bidirectional Reactivity**: Pass Qwik signals as props into Vue components and have them react instantaneously.
- 💬 **Event Propagation**: Bind Vue custom events directly in Qwik using Qwik's standard `$`-wrapped handlers (e.g. `onUpdate$`).
- 🌐 **SSR Support**: Pre-renders your Vue components on the server for fast initial loading (fully SEO friendly), or opt for client-only rendering when needed.
- 🎨 **Type-Safe**: Complete TypeScript & TSX support for seamless developer experience.

---

## Installation

Install `qwik-vue-interop` along with its peer dependencies (`vue` and `@builder.io/qwik`):

```bash
npm install qwik-vue-interop vue
```

Ensure your project is configured with a Vue plugin if you want to import `.vue` files directly. Add `@vitejs/plugin-vue` to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    qwikVite(),
    vue(), // Enable Vue SFC compilation
  ],
});
```

---

## Usage

### 1. Create a Vue Component

Here is a standard Vue Single File Component (`Counter.vue`):

```vue
<!-- Counter.vue -->
<template>
  <div class="vue-card">
    <h3>Vue Component Island</h3>
    <p>Counter prop from Qwik: {{ counter }}</p>
    <button @click="increment">Increment from Vue</button>
  </div>
</template>

<script setup>
const props = defineProps({
  counter: { type: Number, required: true }
});
const emit = defineEmits(['update']);

const increment = () => {
  emit('update', props.counter + 1);
};
</script>

<style scoped>
.vue-card {
  border: 1px solid #41b883;
  padding: 1rem;
  border-radius: 8px;
}
</style>
```

### 2. Wrap it with `qwikifyVue$` and Render in Qwik

Import the helper and your Vue component inside your Qwik route/component:

```tsx
import { component$, useSignal, $ } from "@builder.io/qwik";
import { qwikifyVue$ } from "qwik-vue-interop";
import VueCounter from "./Counter.vue";

// Wrap the Vue component, defining its prop types
const QVueCounter = qwikifyVue$<{
  counter: number;
  onUpdate: (current: number) => void;
}>(VueCounter, { eagerness: 'load' }); // Hydrate as soon as the library loads

export default component$(() => {
  const counter = useSignal(0);

  return (
    <div>
      <h2>Qwik Application Host</h2>
      <p>Qwik Counter Signal: {counter.value}</p>
      
      <button onClick$={() => counter.value++}>
        Increment Qwik
      </button>

      {/* Render the Vue Component as a reactive island */}
      <QVueCounter
        counter={counter.value}
        onUpdate$={(current) => {
          // Sync changes from Vue back to Qwik!
          counter.value = current;
        }}
      />
    </div>
  );
});
```

---

## Eagerness & Selective Hydration

By default, components are pre-rendered on the server and hydrated on the client. You can control the hydration strategy using the options argument:

```typescript
const QComponent = qwikifyVue$(VueComponent, { eagerness: 'visible' });
```

Available strategies:
- `'load'`: Hydrate immediately when the script executes.
- `'visible'`: Hydrate only when the component scrolls into the viewport.
- `'hover'`: Hydrate when the user hovers over the component.
- `'idle'`: Hydrate when the browser is idle (via `requestIdleCallback`).

### Client-Only Island

To disable SSR pre-rendering for a specific instance, pass `client:only={true}` when rendering:

```tsx
<QVueCounter
  counter={counter.value}
  client:only={true}
/>
```

---

## TypeScript Declarations

To resolve imports for `.vue` files in a TypeScript project, make sure you have a shim declaration file (e.g. `src/shims-vue.d.ts`):

```typescript
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

## License

MIT
