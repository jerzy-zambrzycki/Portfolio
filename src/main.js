import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import './chart-setup';

Vue.use(Vuetify);

new Vue({
  router,
  vuetify: new Vuetify({
    theme: { dark: true },
  }),
  render: h => h(App),
}).$mount('#app');
