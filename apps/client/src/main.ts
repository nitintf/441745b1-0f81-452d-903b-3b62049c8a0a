import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import { createApp } from "vue";

import App from "./app.vue";

import "./styles.css";

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(PrimeVue, {
	unstyled: true,
});

app.mount("#app");
