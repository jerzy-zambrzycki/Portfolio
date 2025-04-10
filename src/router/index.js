import Vue from 'vue';
import Router from 'vue-router';
import HomeworkComponent from '../components/HomeworkComponent.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeworkComponent, // Główny komponent wyświetlany na stronie głównej
    },
    // Możesz dodać inne trasy, np. dla wykresu
    {
      path: '/statistics-chart',
      name: 'StatisticsChart',
      component: () => import('../components/StatisticsChart.vue'),
    },
  ],
});
