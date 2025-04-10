<template>
  <v-app theme="dark">
    <!-- Tytuł na górze -->
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="title-card" outlined>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- Układ productystyk po lewej stronie, artykuł po prawej -->
      <v-row>
        <!-- Kolumna dla productystyk -->
        <v-col cols="12" md="5">
          <v-card class="products">
            <v-card-actions class="d-flex justify-end">
              <v-btn @click="addNewProductDialog = true"
                >Add new product +</v-btn
              >
            </v-card-actions>
            <v-card
              class="ma-3 pa-1 d-flex justify-space-between align-center"
              v-for="product in products"
              :key="product.id"
            >
              <div class="d-flex align-center">
                <v-card height="100%" class="ma-1 pa-1">{{
                  product.name
                }}</v-card>
                <v-card height="100%" class="ma-1 pa-1">
                  count: {{ product.count }}</v-card
                >
                <v-card height="100%" class="ma-1 pa-1">
                  price: {{ product.price }}$</v-card
                >
                <v-card height="100%" class="ma-1 pa-1">
                  total: {{ product.price * product.count }}$</v-card
                >
              </div>
              <div>
                <v-btn @click="openEditDialog(product)">Edit</v-btn>
                <v-btn color="error" @click="removeProduct(product.id)"
                  >Delete</v-btn
                >
              </div>
            </v-card>

            <!-- Przycisk Show in Diagram (productyczny) -->
            <!-- <v-card-actions class="d-flex justify-end">
              <v-btn @click="openChartWindow">Show in diagram</v-btn>
            </v-card-actions> -->
          </v-card>
        </v-col>

        <!-- Kolumna dla wykresu (Diagram) -->
        <v-col cols="12" md="7">
          <v-card class="chart-card">
            <v-card-title>Diagram</v-card-title>
            <v-card-text style="min-height: 200px">
              <Pie :data="chartData" :options="chartOptions" />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Kolumna dla artykułu po prawej stronie -->
        <v-col cols="12" md="">
          <v-card
            class="article-container"
            v-if="article && article.title && article.text"
          >
            <v-card-title>{{ article.title }}</v-card-title>
            <v-card-text>{{ article.text }}</v-card-text>
          </v-card>

          <!-- Jeśli brak artykułu -->
          <v-card v-else>
            <v-card-text>
              <p>Brak artykułu do wyświetlenia.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog dodawania nowej productystyki -->
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
        title: "Brak tytułu",
        text: "Brak treści",
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
      //       label: "Products",
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
            backgroundColor: ["#42A5F5", "#66BB6A", "#FF7043"],
            hoverBackgroundColor: ["#42A5F5", "#66BB6A", "#FF7043"],
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

        // // Dodanie nowej productystyki lokalnie, aby natychmiast pojawiła się na ekranie - TO ZA NAS ROBI ONSNAPSHOT
        // this.products.push(newProduct);

        // // Zaktualizowanie wykresu
        // this.updateChartData();          - SNAPSHOT ROBI TO ZA NAS

        // Resetowanie pól formularza
        this.newProductName = "";
        this.newProductCount = 0;
        this.newProductPrice = 0;
        this.addNewProductDialog = false;
      } catch (error) {
        console.error("Błąd przy dodawaniu nowej productystyki:", error);
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
        console.error("Błąd przy usuwaniu productystyki:", error);
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
/* Stylowanie dla tła */
.title-card {
  background-color: #333;
  color: white;
}

/* Wyrównanie kart */
.products {
  background-color: #333;
  color: white;
}

.article-container {
  background-color: #121212;
  color: white;
}

.chart-card {
  background-color: #333;
  color: white;
  min-height: 300px;
}
</style>
