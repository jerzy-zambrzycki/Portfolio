<template>
  <v-app theme="dark">
    <!-- Tytuł na górze -->
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="title-card modern-card" outlined>
            <v-card-title class="headline white--text">{{ title }}</v-card-title>
            <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Układ produktów po lewej stronie, artykuł po prawej -->
      <v-row>
        <!-- Kolumna dla produktów -->
        <v-col cols="10" md="5">
  <v-card class="products light-card">
    <v-card-actions class="d-flex justify-end">
      <v-btn @click="addNewProductDialog = true">Add new product +</v-btn>
    </v-card-actions>

    <!-- Kontener dla listy produktów, który ma stałą wysokość i suwak -->
    <v-card class="product-list">
      <v-card
        class="ma-3 pa-2 d-flex justify-space-between align-center product-card"
        v-for="product in products"
        :key="product.id"
      >
        <div class="d-flex align-center">
          <v-card class="pa-2 mx-1">{{ product.name }}</v-card>
          <v-card class="pa-2 mx-1">count: {{ product.count }}</v-card>
          <v-card class="pa-2 mx-1">price: {{ product.price }}$</v-card>
          <v-card class="pa-2 mx-1">
            total: {{ product.price * product.count }}$
          </v-card>
        </div>
        <div>
          <v-btn @click="openEditDialog(product)">Edit</v-btn>
          <v-btn color="error" @click="removeProduct(product.id)">Delete</v-btn>
        </div>
      </v-card>
    </v-card>
  </v-card>
</v-col>



       <!-- Kolumna dla wykresu (Diagram) -->
<v-col cols="12" md="7">
  <v-card class="chart-card" outlined>
    <v-card-title class="headline">Diagram</v-card-title>
    <v-card-text style="min-height: 200px">
      <Pie :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</v-col>


        <!-- Kolumna dla artykułu po prawej stronie -->
         
        <!-- Kolumna dla artykułu -->
        <v-col cols="12" md="6" class="position-relative">
        <v-card class="article-container" v-if="article && article.title && article.text">
          <v-card-title>{{ article.title }}</v-card-title>
          <v-card-text>{{ article.text }}</v-card-text>
        </v-card>

        <!-- Jeśli brak artykułu -->
        <v-card v-else class="no-article">
          <v-card-text>
            <p>Brak artykułu do wyświetlenia.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>



    

    <!-- Dialog dodawania nowego produktu -->
    <v-dialog v-model="addNewProductDialog" width="600">
      <v-card width="100%" height="100%">
        <v-card-title class="d-flex justify-center"
          >Add new product</v-card-title
        >
        <v-card-text>
          <v-text-field
            label="New product name"
            v-model="newProductName"
          ></v-text-field>
          <v-text-field
            label="New product count"
            v-model="newProductCount"
            type="number"
          ></v-text-field>
          <v-text-field
            label="New product price"
            v-model="newProductPrice"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn @click="addNewProduct">Save</v-btn>
          <v-btn @click="addNewProductDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog edycji produktów -->
    <v-dialog v-model="editProductDialog" width="600">
      <v-card width="100%" height="100%">
        <v-card-title class="d-flex justify-center">Edit product</v-card-title>
        <v-card-text>
          <v-text-field
            label="Product name"
            v-model="editProductName"
          ></v-text-field>
          <v-text-field
            label="Product count"
            v-model="editProductCount"
            type="number"
          ></v-text-field>
          <v-text-field
            label="Product price"
            v-model="editProductPrice"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn @click="updateProduct">Update</v-btn>
          <v-btn @click="editProductDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { db } from "../config/firebase"; // Upewnij się, że ścieżka jest poprawna
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    article: {
      type: Object,
      default: () => ({
        title: "Monthly Cost Summary",
        text: "Here will be a list of expenses for the current month.lol"
      }),
    },
  },
  components: {
    Pie,
  },
  data() {
    return {
      addNewProductDialog: false,
      editProductDialog: false,
      newProductName: "",
      newProductCount: 0,
      newProductPrice: 0,
      listener: null,

      // Dane do edycji
      editProductId: null,
      editProductName: "",
      editProductCount: 0,
      editProductPrice: 0,
      products: [],
      // chartData: {
      //   labels: [],
      //   datasets: [
      //     {
      //       label: "Products",y
      //       data: [],
      //       backgroundColor: ["#42A5F5", "#66BB6A", "#FF7043"],
      //       hoverBackgroundColor: ["#42A5F5", "#66BB6A", "#FF7043"],
      //     },
      //   ],
      // },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    chartData() {
      const chartData = {
        labels: [],
        datasets: [
          {
            label: "Products",
            data: [],
            backgroundColor: [
              "#42A5F5",
              "#66BB6A",
              "#FF7043",
              "#FFC107",
              "#8E24AA",
              "#00BCD4",
            ],
            hoverBackgroundColor: [
              "#42A5F5",
              "#66BB6A",
              "#FF7043",
              "#FFC107",
              "#8E24AA",
              "#00BCD4",
            ],
          },
        ],
      };
      chartData.labels = Array.from(
        new Set(this.products.map((product) => product.name))
      ); // Array from new set pozwala na wyciagniecie unikatów z listy zawierajacej powtarzajace sie wartości - sprawdzić
      chartData.datasets[0].data = [];
      for (let label of chartData.labels) {
        const matchingProducts = this.products.filter(
          (product) => product.name === label
        );
        let totalCost = 0;
        for (let matchingProduct of matchingProducts) {
          totalCost += matchingProduct.count * matchingProduct.price;
        }
        chartData.datasets[0].data.push(totalCost);
      }
      return chartData;
    },
  },
  mounted() {
    try {
      this.listener = db.collection("products").onSnapshot((snapshot) => {
        // przeanalizować
        this.products = snapshot.docs.map((doc) => ({
          id: doc.ref.id,
          ...doc.data(),
        }));
        // this.updateChartData();
        console.log(this.chartData);
      });
      console.log("Pobrane produkty:", this.products);
    } catch (error) {
      console.error("Błąd podczas pobierania danych z Firestore:", error);
    }
  },
  beforeDestroy() {
    if (this.listener) this.listener();
  },
  methods: {
    updateChartData() {
      this.chartData.labels = Array.from(
        new Set(this.products.map((product) => product.name))
      ); // Array from new set pozwala na wyciagniecie unikatów z listy zawierajacej powtarzajace sie wartości - sprawdzić
      this.chartData.datasets[0].data = [];
      for (let label of this.chartData.labels) {
        const matchingProducts = this.products.filter(
          (product) => product.name === label
        );
        let totalCost = 0;
        for (let matchingProduct of matchingProducts) {
          totalCost += matchingProduct.count * matchingProduct.price;
        }
        this.chartData.datasets[0].data.push(totalCost);
      }
      // this.chartData.datasets[0].data = this.products.map(

      //   (product) => product.count
      // );
    },
    async addNewProduct() {
      if (
        !this.newProductName ||
        this.newProductCount <= 0 ||
        this.newProductPrice <= 0
      ) {
        alert("Proszę podać poprawne dane.");
        return;
      }

      const newProduct = {
        name: this.newProductName,
        count: this.newProductCount,
        price: this.newProductPrice,
      };

      try {
        // Dodanie nowego produktu do Firestore
        await db.collection("products").add(newProduct);
        // newProduct.id = docRef.id; // Dodajemy id dokumentu

        // // Dodanie nowej produktówi lokalnie, aby natychmiast pojawiła się na ekranie - TO ZA NAS ROBI ONSNAPSHOT
        // this.products.push(newProduct);

        // // Zaktualizowanie wykresu
        // this.updateChartData();          - SNAPSHOT ROBI TO ZA NAS

        // Resetowanie pól formularza
        this.newProductName = "";
        this.newProductCount = 0;
        this.newProductPrice = 0;
        this.addNewProductDialog = false;
      } catch (error) {
        console.error("Błąd przy dodawaniu nowej produktówi:", error);
      }
    },

    openChartWindow() {
      // Otwórz wykres na tej samej stronie (jeśli chcesz to zrobić bez nawigacji)
      // Zmiana wykresu lub jego wyświetlanie
      this.updateChartData();
    },

    async removeProduct(productId) {
      try {
        await db.collection("products").doc(productId).delete();
        // this.products = this.products.filter(
        //   (product) => product.id !== productId                  TO ZA NAS ROBI ONSNAPSHOT
        // );
        // this.updateChartData(); // Zaktualizowanie wykresu po usunięciu
        console.log(`Product o id ${productId} została usunięta.`);
      } catch (error) {
        console.error("Błąd przy usuwaniu produktówi:", error);
      }
    },

    openEditDialog(product) {
      this.editProductId = product.id;
      this.editProductName = product.name;
      this.editProductCount = product.count;
      this.editProductPrice = product.price;
      this.editProductDialog = true;
    },

    async updateProduct() {
      if (
        !this.editProductName ||
        this.editProductCount <= 0 ||
        this.editProductPrice <= 0
      ) {
        alert("Proszę podać poprawne dane.");
        return;
      }
      const updatedData = {
        name: this.editProductName,
        count: this.editProductCount,
        price: this.editProductPrice,
      };
      try {
        await db
          .collection("products")
          .doc(this.editProductId)
          .update(updatedData);
        // const index = this.products.findIndex(
        //   (product) => product.id === this.editProductId
        // );
        // if (index !== -1) {
        //   this.products.splice(index, 1, {   to za nas robi ONSNAPSHOT
        //     id: this.editProductId,
        //     ...updatedData,
        //   });
        // }
        // this.updateChartData();
        this.editProductDialog = false;
      } catch (error) {
        console.error("Błąd przy aktualizacji produktu:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Styl nagłówka */
/* Styl nagłówka */
.title-card {
  background-color: #333;
  color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); /* Cień dla głębi */
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.title-card:hover {
  transform: translateY(-5px); /* Mała animacja na hover */
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3); /* Większy cień na hover */
}

/* Styl kontenera produktów */
/* Styl dla kontenera z suwakami */
.products {
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: background-color 0.3s ease;
  max-height: 500px;
  overflow-y: auto;
}

/* Stylizacja suwaka dla WebKit (Chrome, Safari, Opera) */
.products::-webkit-scrollbar {
  width: 8px; /* Szerokość suwaka - zmniejszono do 8px, co daje "krótszy" wygląd */
}

.products::-webkit-scrollbar-track {
  background-color: #e0e0e0; /* Kolor tła ścieżki suwaka */
  border-radius: 6px;
}

.products::-webkit-scrollbar-thumb {
  background-color: #9e9e9e; /* Kolor suwaka - szary */
  border-radius: 6px;
  height: 50px; /* Wysokość suwaka - zmniejszono do połowy poprzedniej */
  border: 3px solid #e0e0e0; /* Border wokół suwaka */
  transition: background-color 0.3s ease; /* Dodanie płynnej zmiany koloru */
}

.products::-webkit-scrollbar-thumb:hover {
  background-color: #757575; /* Kolor suwaka po najechaniu myszką */
}

/* Stylizowanie suwaka w Firefox */
.products {
  scrollbar-width: thin; /* Cienki suwak */
  scrollbar-color: #9e9e9e #e0e0e0; /* Kolor suwaka i tła - szary suwak */
}

/* Styl pojedynczego produktu */
.product-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Styl informacji o produkcie */
.product-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.product-detail {
  background-color: #e3f2fd;
  color: #0d47a1;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Styl przycisków */
.add-btn,
.edit-btn,
.delete-btn {
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  
}

.add-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Kolory przycisków */
.add-btn {
  background-color: #42a5f5;
  color: white;
}

.add-btn:hover {
  background-color: #2196f3;
}

.edit-btn {
  background-color: #26a69a;
  color: white;
}

.edit-btn:hover {
  background-color: #00796b;
}

.delete-btn {
  background-color: #ff7043;
  color: white;
}

.delete-btn:hover {
  background-color: #f4511e;
}

.chart-card {
  background-color: #ffffff; /* Tło białe, by pasowało do reszty projektu */
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px); /* Animacja na hover */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2); /* Większy cień na hover */
}

.v-card-title {
  font-weight: 600;
  font-size: 20px;
  color: #333; /* Kolor tekstu tytułu */
}

.v-card-text {
  padding: 0;
  min-height: 200px; /* Zapewnia minimalną wysokość wykresu */
}

/* Stylizacja samej karty artykułu */
.article-container {
  background-color: #ffffff; /* Białe tło */
  border-radius: 16px; /* Zaokrąglone rogi */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Cień */
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animacja */
}

/* Dodanie animacji na hover */
.article-container:hover {
  transform: translateY(-5px); /* Podniesienie karty */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2); /* Większy cień na hover */
}

/* Styl tytułu artykułu */
.article-title {
  font-size: 24px; /* Większy rozmiar czcionki */
  font-weight: bold;
  color: #333; /* Ciemny kolor tekstu */
  margin-bottom: 10px;
}

/* Styl tekstu artykułu */
.article-text {
  font-size: 16px; /* Rozmiar czcionki */
  line-height: 1.6; /* Wysokość linii dla lepszej czytelności */
  color: #555; /* Jaśniejszy odcień szarości */
}

/* Stylizacja karty, gdy brak artykułu */
.no-article {
  background-color: #f4f6f8; /* Jasnoszare tło */
  border-radius: 16px; /* Zaokrąglone rogi */
  padding: 20px;
  text-align: center; /* Wyśrodkowanie tekstu */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Cień */
}

.no-article p {
  font-size: 18px; /* Większy rozmiar czcionki */
  color: #888; /* Szary kolor tekstu */
}




</style>
