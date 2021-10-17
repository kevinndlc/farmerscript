<template>
  <GlassCard class="rounded-xl overflow-hidden">
    <dl class="flex justify-evenly items-end">
      <div class="flex flex-col items-center p-2 sm:p-4 text-center">
        <dt class="order-2 sm:mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-600">
          {{ userFc }}
        </dt>
        <img class="order-1 w-8 h-8 sm:w-12 sm:h-12" src="~assets/img/fc.png" alt="Farmers Coin">
      </div>
      <div class="flex flex-col items-center p-2 sm:p-4 text-center">
        <dt class="order-2 sm:mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-600">
          {{ userRessources.energy }} / {{ userRessources.max_energy }}
        </dt>
        <img class="order-1 h-8 w-8 sm:w-12 sm:h-12" src="~assets/img/nrj.png" alt="Energy">
      </div>
    </dl>
    <hr>
    <dl class="grid grid-cols-3">
      <a href="https://wax.alcor.exchange/trade/FWF-farmerstoken_wax-eosio.token" target="_blank">
        <div class="flex flex-col p-2 sm:p-4 text-center">
          <dt class="order-2 sm:mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-600">
            Food
          </dt>
          <dd class="order-1 text-3xl sm:text-5xl font-extrabold text-food">
            {{ userFood }}
          </dd>
        </div>
      </a>
      <a href="https://wax.alcor.exchange/trade/FWW-farmerstoken_wax-eosio.token" target="_blank">
        <div class="flex flex-col p-2 sm:p-4 text-center">
          <dt class="order-2 sm:mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-600">
            Wood
          </dt>
          <dd class="order-1 text-3xl sm:text-5xl font-extrabold text-wood">
            {{ userWood }}
          </dd>
        </div>
      </a>
      <a href="https://wax.alcor.exchange/trade/FWG-farmerstoken_wax-eosio.token" target="_blank">
        <div class="flex flex-col p-2 sm:p-4 text-center">
          <dt class="order-2 sm:mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-600">
            Gold
          </dt>
          <dd class="order-1 text-3xl sm:text-5xl font-extrabold text-gold">
            {{ userGold }}
          </dd>
        </div>
      </a>
    </dl>
  </GlassCard>
</template>

<script>
export default {
  computed: {
    userRessources() {
      return this.$store.state.userRessources
    },
    userFc() {
      return this.$store.getters.userFc
    },
    userFood() {
      return parseInt(this.$store.getters.userFood)
    },
    userWood() {
      return parseInt(this.$store.getters.userWood)
    },
    userGold() {
      return parseInt(this.$store.getters.userGold)
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserRessources')

    setInterval(async () => {
      await this.$store.dispatch('getUserRessources')
    }, 60000)
  }
}
</script>