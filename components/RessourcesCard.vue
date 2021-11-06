<template>
  <div class="rssgrid rounded-xl overflow-hidden">
    <!-- Ressource Details -->
    <div class="border-b-2 sm:border-b-0 sm:border-r-2 text-gray-600 border-primary pb-4 sm:pb-0 sm:pr-4">
      <div class="sm:flex justify-between items-center">
        <div>
          <h2 class="text-sm sm:text-lg text-gray-800 font-medium">Currently logged as <span class="font-bold text-primary">{{ userAccount }}</span></h2>
          <span class="text-xs font-medium">Balance : {{ userBalance }} WAX (${{ userBalanceInUsd }})</span><span v-if="waxPrice" class="block sm:inline-block sm:ml-14 text-xs font-medium">1 WAX = {{ waxPrice }}$</span>
        </div>
        <div class="hidden md:inline-block bg-primary rounded-lg py-2 px-3 text-white font-medium">CPU : {{ userCpuPercentage }}%</div>
      </div>
      <hr class="my-3">
      <div v-if="!currentDetails" class="text-center sm:mt-10">
        <span class="hidden sm:inline text-gray-600">Click on a resource on the right to get a detailed view</span>
        <span class="sm:hidden text-gray-600">Click on a resource below to get a detailed view</span>
      </div>
      <div v-else class="text-center text-sm sm:text-base">
        <h3 class="text-lg sm:text-2xl font-medium underline">{{ rssDetails.name }}</h3>
        <div v-if="currentDetails.type === 'PRIMARY'">
          <p class="mt-2">Price : {{ rssDetails.price }} WAX (${{ rssDetails.priceInUsd }})</p>
          <div class="flex justify-center gap-8 mt-4">
            <div>
              <p>{{ rssDetails.quantity }} {{ currentDetails.name }} in Game</p>
              <div>{{ withdrawPercentage }}%</div>
              <input v-model="withdrawPercentage" type="range" min="0" max="100" class="slider"><br>
              <PrimaryButton @click="handleWithdrawal(currentDetails.name, (rssDetails.quantity * withdrawPercentage/100))">Withdraw {{ Math.round((rssDetails.quantity * withdrawPercentage/100) * (1 - withdrawalFee/100) * 100) / 100 }} {{ rssDetails.token }} </PrimaryButton><br>
            </div>
            <div>
               <p>{{ rssDetails.tokenQuantity }} {{ rssDetails.token }} in Wallet</p>
               <div>{{ depositPercentage }}%</div>
               <input v-model="depositPercentage" type="range" min="0" max="100" class="slider"><br>
              <PrimaryButton @click="handleDeposit(rssDetails.token, (rssDetails.tokenQuantity * depositPercentage/100))">Deposit {{ Math.round((rssDetails.tokenQuantity * depositPercentage/100) * 100) / 100 }} {{ rssDetails.name }} </PrimaryButton><br>
            </div>
          </div>
          <p class="mt-4">Total : {{ (rssDetails.quantity * rssDetails.price).toFixed(2) }} WAX (${{ (rssDetails.quantity * rssDetails.priceInUsd).toFixed(2) }})</p>
          <a class="inline-block text-primary font-medium mt-4" :href="rssDetails.tradeUrl" target="_blank">Trade on Alcor Exchange</a>
        </div>
        <div v-else-if="currentDetails.type === 'FC'">
          <p>Quantity : {{ rssDetails.quantity }}</p>
          <p>Lowest Listing : {{ Math.round(rssDetails.price * 100) / 100 }} WAX (${{ rssDetails.priceInUsd }})</p>
          <p>Total : {{ (rssDetails.quantity * rssDetails.price).toFixed(2) }} WAX (${{ (rssDetails.quantity * rssDetails.priceInUsd).toFixed(2) }})</p>
          <a class="text-primary font-medium" :href="rssDetails.buyUrl" target="_blank">Buy on Atomic Hub</a>
          <span>or</span>
          <a class="text-primary font-medium" :href="rssDetails.sellUrl" target="_blank">Sell on Atomic Hub</a>
        </div>
      </div>
    </div>

    <!-- Ressources -->
    <div>
      <div class="sm:hidden">
        <h2 class="text-lg text-gray-800 font-medium underline mt-2 sm:mt-0">Energy</h2>
        <div class="flex justify-center items-center mt-2">
          <img v-if="nrjToRecover > 0" class="h-8 w-8 mr-2 cursor-pointer" src="~assets/img/plus.png" alt="Plus" @click="recoverNrj">
          <span class="text-gray-600 text-sm font-medium mr-2">{{ userRessources.energy }} / {{ userRessources.max_energy }}</span>
          <img class="h-10 w-10" src="~assets/img/nrj.png" alt="Energy">
        </div>
      </div>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2 sm:mt-0">Resources</h2>
      <dl class="grid grid-cols-2 grid-rows-2 mt-2">
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl" @click="currentDetails = {type: 'PRIMARY', name: 'WOOD'}">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userWood }}
          </dt>
          <img class="order-1 w-12 h-12" src="~assets/img/wood.png" alt="Wood">
        </div>
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl" @click="currentDetails =  {type: 'PRIMARY', name: 'FOOD'}">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userFood }}
          </dt>
          <img class="order-1 w-12 h-12" src="~assets/img/food.png" alt="Food">
        </div>
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl" @click="currentDetails =  {type: 'PRIMARY', name: 'GOLD'}">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userGold }}
          </dt>
          <img class="order-1 w-12 h-12" src="~assets/img/gold.png" alt="Gold">
        </div>
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl"  @click="currentDetails =  {type: 'FC', name: 'FC'}">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userFc }}
          </dt>
          <img class="order-1 w-12 h-12" src="~assets/img/fc.png" alt="Farmers Coin">
        </div>
      </dl>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2">Plants & Crops</h2>
      <dl class="grid grid-cols-2 mt-2">
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userBarleys }} <span v-if="userBarleySeeds">(& {{ userBarleySeeds }} seeds)</span>
          </dt>
          <img class="order-1 w-12 h-auto" src="https://mypinata.cloud/ipfs/QmZGDY4KYpK5aFqyhZJGkkZuVYsrzn2qxcQsDGihAgzcRW" alt="Barley">
        </div>
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userCorns }} <span v-if="userCornSeeds">(& {{ userCornSeeds }} seeds)</span>
          </dt>
          <img class="order-1 w-12 h-auto" src="https://mypinata.cloud/ipfs/QmQkCitYXTisq7WugjeQ5gkinCPjZpc5uk1SHiPz4Z1eVZ" alt="Corn">
        </div>
      </dl>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2">Animal Rewards</h2>
      <dl class="grid grid-cols-2 mt-2">
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userChickenEggs }}
          </dt>
          <img class="order-1 w-12 h-auto" src="https://mypinata.cloud/ipfs/QmSLbe4KRWDS81eyXS7tP3MaF8yHDU5urYdyBspzcd3JMR" alt="Chicken Eggs">
        </div>
        <div class="flex flex-col items-center p-2 sm:p-4 text-center cursor-pointer hover:bg-gray-200 rounded-xl">
          <dt class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600">
            {{ userMilks }}
          </dt>
          <img class="order-1 w-12 h-auto" src="https://mypinata.cloud/ipfs/QmYpVvcpEF2e8s6NY5QAjXmXjakZGZhZ53nJbgQWRfg1LT" alt="Milk">
        </div>
      </dl>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2">Options</h2>
      <div class="flex justify-between items-center mt-2">
        <label for="toggleAutoRecover" class="mr-2 text-gray-600 font-medium cursor-pointer">Auto recover energy</label>
        <MySwitch id="toggleAutoRecover" label="" :checked="autoRecover" @toggleSwitch="handleAutoRecover"/>
      </div>
      <hr class="mt-2">
      <div class="flex justify-between items-center mt-2">
        <label for="toggleAutoRepair" class="mr-2 text-gray-600 font-medium cursor-pointer">Auto repair tools</label>
        <MySwitch id="toggleAutoRepair" label="" :checked="autoRepairTools" @toggleSwitch="handleAutoRepairTools"/>
      </div>
      <hr class="mt-2">
      <div class="flex justify-between items-center mt-2">
        <label for="toggleAnimations" class="mr-2 text-gray-600 font-medium cursor-pointer">Enable animations</label>
        <MySwitch id="toggleAnimations" label="" :checked="enableAnimations" @toggleSwitch="handleEnableAnimations"/>
      </div>
    </div>
  </div>
</template>

<script>
import CustomNotification from '~/components/CustomNotification.vue'

export default {
  data() {
    return {
      autoRecover: (localStorage.getItem('autoRecover') === 'true'),
      autoRepairTools: (localStorage.getItem('autoRepair') === 'true'),
      enableAnimations: (localStorage.getItem('enableAnimations') === 'true'),
      recovering: false,
      repairing: false,
      marketPrices: [],
      atomicPrices: [],
      currentDetails: '',
      userTokens: [],
      withdrawPercentage: 0,
      depositPercentage: 0
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userAccount() {
      return this.$store.state.userAccount
    },
    userBalance() {
      return this.$store.state.userBalance
    },
    userBalanceInUsd() {
      return Math.round(this.userBalance * this.waxPrice * 100) / 100
    },
    userCpuPercentage() {
      return ((this.$store.state.userCpu.used / this.$store.state.userCpu.max) * 100).toFixed(0)
    },
    userRessources() {
      return this.$store.state.userRessources
    },
    withdrawalFee() {
      return this.$store.state.withdrawalFee
    },
    nrjToRecover() {
      return this.userRessources.max_energy - this.userRessources.energy
    },
    userTools() {
      return this.$store.state.userTools
    },
    sumToolsDurability() {
      let sum = 0
      this.userTools.forEach(tool => (sum += tool.durability - tool.current_durability))

      return sum
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
    },
    userBarleys() {
      return this.$store.getters.userBarleys
    },
    userBarleySeeds() {
      return this.$store.getters.userBarleySeeds
    },
    userCorns() {
      return this.$store.getters.userCorns
    },
    userCornSeeds() {
      return this.$store.getters.userCornSeeds
    },
    userChickenEggs() {
      return this.$store.getters.userChickenEggs
    },
    userMilks() {
      return this.$store.getters.userMilks
    },
    rssDetails() {
      if (this.currentDetails.name === 'WOOD') {
        const currentToken = this.marketPrices.find(pair => pair.quote_token.symbol.name === 'FWW')
        let currentPrice = 0
        if (currentToken) {
          currentPrice = Math.round(currentToken.last_price * 100) / 100
        }

        const tokenQuantityString = this.userTokens.find(token => token.balance.includes('FWW')).balance
        const tokenQuantity = parseFloat(tokenQuantityString.replace(/[^\d.-]/g, ''))

        return {
          name: 'WOOD',
          quantity: this.userWood,
          token: 'FWW',
          tokenQuantity,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          tradeUrl: 'https://wax.alcor.exchange/trade/fww-farmerstoken_wax-eosio.token'
        }
      } else if (this.currentDetails.name === 'FOOD') {
        const currentToken = this.marketPrices.find(pair => pair.quote_token.symbol.name === 'FWF')
        let currentPrice = 0
        if (currentToken) {
          currentPrice = Math.round(currentToken.last_price * 100) / 100
        }

        const tokenQuantityString = this.userTokens.find(token => token.balance.includes('FWF')).balance
        const tokenQuantity = parseFloat(tokenQuantityString.replace(/[^\d.-]/g, ''))

        return {
          name: 'FOOD',
          quantity: this.userFood,
          token: 'FWF',
          tokenQuantity,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          tradeUrl: 'https://wax.alcor.exchange/trade/fwf-farmerstoken_wax-eosio.token'
        }
      } else if (this.currentDetails.name === 'GOLD') {
        const currentToken = this.marketPrices.find(pair => pair.quote_token.symbol.name === 'FWG')
        let currentPrice = 0
        if (currentToken) {
          currentPrice = Math.round(currentToken.last_price * 100) / 100
        }

        const tokenQuantityString = this.userTokens.find(token => token.balance.includes('FWG')).balance
        const tokenQuantity = parseFloat(tokenQuantityString.replace(/[^\d.-]/g, ''))

        return {
          name: 'GOLD',
          quantity: this.userGold,
          token: 'FWG',
          tokenQuantity,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          tradeUrl: 'https://wax.alcor.exchange/trade/fwg-farmerstoken_wax-eosio.token'
        }
      } else if (this.currentDetails.name === 'FC') {
        const lowestPriceFc = this.atomicPrices.data.find(sale => sale.assets[0].template.template_id === '260676')
        let currentPrice = 0
        if (lowestPriceFc) {
          currentPrice = parseInt(lowestPriceFc.price.amount) / 10**lowestPriceFc.price.token_precision
        }

        return {
          name: 'FARMER COINS',
          quantity: this.userFc,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          buyUrl: 'https://wax.atomichub.io/market?collection_name=farmersworld&schema_name=farmercoins&template_id=260676&order=asc&sort=price&symbol=WAX',
          sellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&schema_name=farmercoins&sort=transferred`
        }
      }

      return {}
    },
    waxPrice() {
      return this.$store.state.waxPrice
    }
  },
  watch: {
    async nrjToRecover(newVal) {
      if (newVal / this.userRessources.max_energy >= 0.5 && !this.recovering && this.autoRecover) {
        this.recovering = true
        await this.recoverNrj()
        this.recovering = false
      }
    },
    async userTools() {
      if (this.userTools.find(tool => tool.current_durability / tool.durability <= 0.5) && !this.repairing && this.autoRepairTools) {
        this.repairing = true
        await this.repairAllTools()
        this.repairing = false
      }
    },
    currentDetails() {
      this.withdrawPercentage = 0
      this.depositPercentage = 0
    }
  },
  async mounted() {
    this.$store.dispatch('setAnimations', this.enableAnimations)
    await this.getMarketPrices()
    await this.getAtomicPrices()
    await this.fetchUserTokens()
    await this.$store.dispatch('getWaxPrice')
    await this.$store.dispatch('getUserBalance')
    setInterval(async () => {
      await this.getMarketPrices()
      await this.getAtomicPrices()
      await this.fetchUserTokens()
      await this.$store.dispatch('getWaxPrice')
      await this.$store.dispatch('getUserBalance')
    }, 15000)
  },
  methods: {
    async recoverNrj() {
      const priceInFood = this.nrjToRecover / 5

      if (priceInFood > this.userFood) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Not enough food',
            message: `You need ${priceInFood} FOOD to recover your energy`
          }
        })
      } else {
        try {
          await this.wax.api.transact({
          actions: [{
            account: 'farmersworld',
            name: 'recover',
            authorization: [{
              actor: this.wax.userAccount,
              permission: 'active',
            }],
            data: {
              owner: this.wax.userAccount,
              energy_recovered: this.nrjToRecover
            },
          }]},
          {
            blocksBehind: 3,
            expireSeconds: 30
          })
        } catch (e) {
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: 'Unexpected error',
              message: e.message
            }
          })
          return null
        }

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Successfully recovered your energy',
            message: `Your energy have been recovered for a total cost of ${priceInFood} FOOD`
          }
        })

        setTimeout(async () => {
          await this.$store.dispatch('getUserRessources')
        }, 1000)
      }
    },
    async repairAllTools() {
      const priceInGold = this.sumToolsDurability / 5

      if (priceInGold > this.userGold) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Not enough gold',
            message: `You need ${priceInGold} GOLD to repair all your tools`
          }
        })
      } else {
        await Promise.all(this.userTools.map(async (tool) => {
          try {
            await this.wax.api.transact({
            actions: [{
              account: 'farmersworld',
              name: 'repair',
              authorization: [{
                actor: this.wax.userAccount,
                permission: 'active',
              }],
              data: {
                asset_owner: this.wax.userAccount,
                asset_id: tool.asset_id
              },
            }]},
            {
              blocksBehind: 3,
              expireSeconds: 30
            })
          } catch (e) {
            this.$toast.error({
              component: CustomNotification,
              props: {
                title: 'Unexpected error',
                message: e.message
              }
            })
          }
        }))

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Successfully repaired your tools',
            message: `Your tools have all been repaired for a total cost of ${priceInGold} GOLD`
          }
        })

        setTimeout(async () => {
          await this.$store.dispatch('getUserRessources')
          await this.$store.dispatch('getUserTools')
        }, 1000)
      }
    },

    handleAutoRecover() {
      this.autoRecover = !this.autoRecover
      localStorage.setItem('autoRecover', this.autoRecover)

      if (this.autoRecover) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Auto Recover enabled',
            message: 'Your energy will be automatically recovered when it drops below 50%'
          }
        })
      }
    },
    handleAutoRepairTools() {
      this.autoRepairTools = !this.autoRepairTools
      localStorage.setItem('autoRepair', this.autoRepairTools)

      if (this.autoRepairTools) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Auto Repair enabled',
            message: 'Your tools will be automatically repaired when their durability drops below 50%'
          }
        })
      }
    },
    async handleWithdrawal(ressourceName, quantity) {
      const quantityString = quantity.toFixed(4) + ' ' + ressourceName
      try {
        await this.wax.api.transact({
        actions: [{
          account: 'farmersworld',
          name: 'withdraw',
          authorization: [{
            actor: this.wax.userAccount,
            permission: 'active',
          }],
          data: {
            fee: this.withdrawalFee,
            owner: this.wax.userAccount,
            quantities: [quantityString]
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })
      } catch (e) {}
      setTimeout(async () => {
        await this.fetchUserTokens()
        await this.$store.dispatch('getUserRessources')
      }, 1000)
    },
    async handleDeposit(ressourceName, quantity) {
      const quantityString = quantity.toFixed(4) + ' ' + ressourceName
      try {
        await this.wax.api.transact({
        actions: [{
          account: 'farmerstoken',
          name: 'transfers',
          authorization: [{
            actor: this.wax.userAccount,
            permission: 'active',
          }],
          data: {
            from: this.wax.userAccount,
            memo: 'deposit',
            quantities: [quantityString],
            to: 'farmersworld'
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })
      } catch (e) {}
      setTimeout(async () => {
        await this.fetchUserTokens()
        await this.$store.dispatch('getUserRessources')
      }, 1000)
    },
    handleEnableAnimations() {
      this.enableAnimations = !this.enableAnimations
      localStorage.setItem('enableAnimations', this.enableAnimations)
      this.$store.dispatch('setAnimations', this.enableAnimations)
    },

    async fetchUserTokens() {
      const userTokens = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
        json: true,
        code: "farmerstoken",
        scope: this.wax.userAccount,
        table: "accounts",
        limit: "100"
      })

      this.userTokens = userTokens.rows
    },
    async getMarketPrices() {
      this.marketPrices = await this.$axios.$get('https://wax.alcor.exchange/api/markets')
    },
    async getAtomicPrices() {
      this.atomicPrices = await this.$axios.$get('https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&collection_name=farmersworld&page=1&limit=100&order=desc&sort=price')
    }
  }
}
</script>

<style scoped>
  @media screen and (min-width: 640px) {
    .rssgrid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1rem;
    }
  }
</style>