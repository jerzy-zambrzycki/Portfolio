<template>
    <v-row>
      <!-- Kolumna na formularz -->
      <v-col cols="12" md="6">
        <v-form @submit.prevent="addStatistic">
          <v-text-field v-model="newStatName" label="Nazwa statystyki" required></v-text-field>
          <v-text-field v-model="newStatValue" label="Wartość statystyki" type="number" required></v-text-field>
          <v-btn type="submit">Dodaj statystykę</v-btn>
        </v-form>
      </v-col>
  
      <!-- Kolumna na diagram -->
      <v-col cols="12" md="6">
        <!-- Wykres kołowy -->
        <Bar id="wykres_kołowy" :data="chartData" :options="chartOptions" />
      </v-col>
    </v-row>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale
  } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);
  
  export default {
    name: 'StatisticsChart',
    components: {
      Bar,
    },
    data() {
      return {
        // Dane wykresu
        chartData: {
          labels: ['A', 'B', 'C'],  // Nazwy segmentów wykresu
          datasets: [
            {
            //   label: 'Statystyki',
              data: [40, 20, 80],  // Wartości odpowiadające segmentom
            //   backgroundColor: ['#42A5F5', '#66BB6A', '#FF7043'],  // Kolory segmentów
            //   hoverBackgroundColor: ['#42A5F5', '#66BB6A', '#FF7043'],  // Kolory po najechaniu
            },
          ],
        },
        chartOptions: {
          responsive: true,
        //   maintainAspectRatio: false,
        //   plugins: {
        //     datalabels: {
        //       formatter: function (value, context) {
        //         // Pokaż nazwę statystyki w miejscu danego segmentu wykresu
        //         return context.chart.data.labels[context.dataIndex];
        //       },
        //       color: 'white',
        //       font: {
        //         weight: 'bold',
        //         size: 14,
        //       },
        //       align: 'center',
        //       anchor: 'center',
        //     },
        //   },
        },
        newStatName: '',  // Zmienna na nazwę nowej statystyki
        newStatValue: '', // Zmienna na wartość nowej statystyki
      };
    },
    methods: {
      // Funkcja do dodawania statystyki
      addStatistic() {
        if (this.newStatName && this.newStatValue) {
          // Dodajemy nową statystykę do chartData
          this.chartData.labels.push(this.newStatName); // Dodajemy nazwę do etykiet
          this.chartData.datasets[0].data.push(parseFloat(this.newStatValue)); // Dodajemy wartość do danych
          // Dodajemy nowy kolor dla segmentu
          this.chartData.datasets[0].backgroundColor.push(this.generateRandomColor());
          this.chartData.datasets[0].hoverBackgroundColor.push(this.generateRandomColor());
          
          // Czyścimy pola formularza
          this.newStatName = '';
          this.newStatValue = '';
        }
      },
      // Funkcja do generowania losowego koloru
      generateRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
      }
    },
  };
  </script>
  
  <style scoped>
  /* Styl dla layoutu */
  .v-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .v-col {
    padding: 10px;
  }
  
  .pie-chart-container {
    height: 300px;  /* Ustawiamy wysokość wykresu */
  }
  </style>
  