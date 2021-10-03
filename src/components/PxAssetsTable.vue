<template>
  <div>
    <table>
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-400">
          <th></th>
          <th :class="{ up:this.sortOrder == 1, down: this.sortOrder == -1}">
            <span
            class="underline cursor-pointer"
            @click="changeSortOrder"
            >Ranking</span>
          </th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cap. de Mercado</th>
          <th>Variación 24hs</th>
          <td class="hidden sm:block">
            <input
              class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
              id="filter"
              placeholder="Buscar..."
              type="text"
              v-model="filter"
            />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="a in filteredAssets"
          :key="a.id"
          class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
        >
          <td>
            <img
            :src="`https://static.coincap.io/assets/icons/${a.symbol.toLowerCase()}@2x.png`"
            :alt="a.name"
            class="w-6 h-6"
            >
          </td>
          <td>
              <b>#{{ a.rank }}</b>
          </td>
          <td>
            <router-link
              class="hover:underlin text-green-600"
              :to="{ name: 'coin-detail', params: {id: a.id} }">
              {{ a.name }}
              <small class="ml-1 text-gray-500">{{ a.symbol }}</small>
            </router-link>
          </td>
          <td>
            {{ a.priceUsd | dollar }}
          </td>
          <td>
            {{ a.marketCapUsd | dollar }}
          </td>
          <td :class="a.changePercent24Hr.includes('-') ? 'text-red-600' : 'text-green-600'">
            <b>{{ a.changePercent24Hr | percent }}</b>
          </td>
          <td class="hidden sm:block">
            <px-button @click="goToCoin(a.id)">
              <span>Detalle</span>
            </px-button>
            <span
            class="ml-5 text-xl cursor-pointer"
            @click="toogleFav(a.id, a.symbol)">{{ isFav(a.id) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PxButton from '@/components/PxButton'
import { bus } from '@/main'

export default {
  name: "PxAssetsTable",

  data(){
    return {
      filter: '',
      sortOrder: 1,
      favList:[],
      favListHead: [],
    }
  },

  components: {PxButton},

  computed: {
    filteredAssets() {
      const altOrder = this.sortOrder === 1 ? - 1 : 1;

      return this.assets.filter(
        a =>
          a.symbol.toLowerCase().includes(this.filter.toLowerCase()) ||
          a.name.toLowerCase().includes(this.filter.toLowerCase())
      )
      .sort((a,b) => {
        if (parseInt(a.rank) > parseInt(b.rank)){
          return this.sortOrder
        }
        return altOrder
      })
    }
  },

  props: {
    assets: {
      type: Array,
      default: () => []
    }
  },

  methods:{
    goToCoin (id){
      this.$router.push({name:'coin-detail', params: {id}})
    },

    changeSortOrder(){
      this.sortOrder = this.sortOrder == 1 ? -1 : 1
    },

    toogleFav(id, symbol){
      if(!this.favList.includes(id)){
        this.favList.push(id)
        const obj = {
          title: symbol,
          to: { name: 'coin-detail', params: { id } }
        }
        this.favListHead.push(obj)
      }else{
        this.favList = this.favList.filter(value => value != id)
        this.favListHead = this.favListHead.filter(item => item.to.params.id != id)
      }
      bus.$emit('fav-head-list', this.favListHead);
      this.uploadLocalStorage()
    },

    uploadLocalStorage(){
      const parsedFavList = JSON.stringify(this.favList);
      localStorage.setItem('favList', parsedFavList);

      const parsedFavListHead = JSON.stringify(this.favListHead);
      localStorage.setItem('favListHead', parsedFavListHead);
    },

    isFav(id){
        return this.favList.includes(id)
        ? `❤`
        : `🤍`
    }
  },

  mounted(){
    if (localStorage.getItem('favList')) {
        try {
            this.favList = JSON.parse(localStorage.getItem('favList'))
            this.favListHead = JSON.parse(localStorage.getItem('favListHead'))
            bus.$emit('fav-head-list', this.favListHead);
        } catch(e) {
            localStorage.removeItem('favList');
        }
    }
  },
};
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
