<template>
  <main>
    <px-header :links="links" />
    <router-view class="container px-5 sm:px-20 py-20 flex justify-center" />
  </main>
</template>

<script>
import PxHeader from "@/components/PxHeader";
import { bus } from '@/main'

export default {
  name: "App",
  components: {
    PxHeader
  },
  data(){
    return{
      links: []
    }
  },
  created(){
    bus.$on('fav-head-list', data => {
      this.links = data
    })
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
