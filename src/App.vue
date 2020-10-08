<template>
  <div id="app">
    <Home />
    <Interiors />
  </div>
</template>

<script>
import Home from './components/Home/Home.vue'
import Interiors from "./components/Interiors/Interiors.vue";

export default {
  name: 'App',
  components: {
    Home,
    Interiors
  },
  data() {
    return {
      component: 'Interiors'
    }
  }
}
</script>
