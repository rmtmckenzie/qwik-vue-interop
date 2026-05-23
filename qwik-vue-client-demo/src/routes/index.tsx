import { component$, useSignal, $ } from "@builder.io/qwik";
import { qwikifyVue$ } from "@keepsta/qwik-vue-interop";
import VueCounter from "../components/Counter.vue";

const QVueCounter = qwikifyVue$<{
  counter: number;
  onUpdate: (current: number) => void;
}>(VueCounter);

export default component$(() => {
  const counter = useSignal(20);
  const logs = useSignal<string[]>(["[Qwik] Client-Only System initialized"]);

  const addLog = $((msg: string) => {
    const time = new Date().toLocaleTimeString();
    logs.value = [...logs.value, `[${time}] ${msg}`];
  });

  return (
    <div class="app-container">
      <div class="hero">
        <h1>Qwik ⇄ Vue Interop (Client-Only)</h1>
        <p>A high-performance bridge showcasing reactive islands and selective hydration, targeting modern Qwik 1.x.</p>
      </div>

      <div class="grid">
        {/* Qwik Native Card */}
        <div class="qwik-card">
          <div class="card-header">
            <span class="card-title">Qwik Native Host</span>
            <span class="badge-qwik">Modern Framework</span>
          </div>
          <div>
            <p class="card-desc">This card is rendered natively by <strong>Qwik</strong>. It maintains a signal representing the global counter state.</p>
            <div class="metrics">
              <div class="metric">
                <span class="label">Qwik Counter Signal:</span>
                <span class="value id-qwik-count highlighted">{counter.value}</span>
              </div>
            </div>
          </div>
          <button id="qwik-button" onClick$={() => {
            counter.value++;
            addLog(`Qwik incremented counter to ${counter.value}`);
          }} class="btn btn-qwik">
            <span>Increment Qwik Counter</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
            </svg>
          </button>
        </div>

        {/* Vue Reactive Island (Client-Only strategy) */}
        <QVueCounter
          counter={counter.value}
          onUpdate$={(current) => {
            addLog(`Vue component updated local count to ${current}`);
            // Sync it back to Qwik
            counter.value = current;
          }}
          client:only={true}
        />
      </div>

      {/* Terminal Log Console */}
      <div class="console-card">
        <div class="console-header">
          <span class="console-title">Reactive Event Console</span>
          <div class="console-dot"></div>
        </div>
        <div class="console-body" id="console-logs">
          {logs.value.map((log, i) => (
            <div key={i} class="log-entry">
              <span class="log-time">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      <div class="footer">
        <p>Built with ❤️ using <a href="https://qwik.dev" target="_blank">Qwik 1.x</a> and <a href="https://vuejs.org" target="_blank">Vue 3</a>. Dual-framework interop layer.</p>
      </div>
    </div>
  );
});
