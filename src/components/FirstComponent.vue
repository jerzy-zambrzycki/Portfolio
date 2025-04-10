<template>
  <div :style="{ color: localColor }">
    <v-btn @click="kliknij">kliknij</v-btn>
    <br />
    <transition name="fade">
      <span :key="counter">licznik: {{ counter }}</span>
    </transition>
  </div>
</template>


<script>
export default {
  props: {
    napis: String,
    color: {
      type: String,
      default: "black",
    },
  },
  data() {
    return {
      counter: 0,
      localColor: this.color, // ✅ Tworzymy kopię props
    };
  },
  methods: {
    kliknij() {
      this.counter++;
      this.localColor = this.losowyKolor(); // ✅ Zmieniamy lokalną zmienną
    },
    losowyKolor() {
      const litery = "0123456789ABCDEF";
      let kolor = "#";
      for (let i = 0; i < 6; i++) {
        kolor += litery[Math.floor(Math.random() * 16)];
      }
      return kolor;
    },
  },
};
</script>
