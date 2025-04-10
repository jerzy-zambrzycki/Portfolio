<template>
  <v-app dark>
    <!-- Renderowanie komponentu HomeworkComponent w głównym widoku -->
    <HomeworkComponent :title="'Product Dashboard'" :subtitle="'Previous month'" />
  </v-app>
</template>

<script>
// Importowanie komponentu HomeworkComponent
import HomeworkComponent from './components/HomeworkComponent.vue';

export default {
  name: 'App',
  components: {
    HomeworkComponent,
  }
};
</script>

<style scoped>
/* Jeśli potrzebujesz, możesz tu dodać dodatkowe style */
</style>
