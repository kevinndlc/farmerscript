<template>
  <header>
    <div class="max-w-7xl mx-auto px-4">
      <div class="relative flex justify-between items-center py-6">
        <div class="flex-shrink-0">
          <span class="sr-only">FarmerScript</span>
          <img class="h-10 w-auto" src="~assets/img/header-logo.png" alt="" />
        </div>
        <div class="flex items-center flex-shrink-0">
          <div v-if="userAccount && userRessources" class="hidden sm:flex items-center">
            <img v-if="nrjToRecover > 0" class="h-6 w-6 mr-2 cursor-pointer" src="~assets/img/plus.png" alt="Plus" @click="recoverNrj">
            <span class="text-gray-600 font-medium mr-2">{{ userRessources.energy }} / {{ userRessources.max_energy }}</span>
            <img class="h-8 w-8 mr-2" src="~assets/img/nrj.png" alt="Energy">
          </div>
          <PrimaryButton v-if="!userAccount" @click="handleLogin">Log in</PrimaryButton>
          <PrimaryButton v-else @click="showRessources = !showRessources">{{ showRessourcesText }}</PrimaryButton>
        </div>
        <transition v-if="userAccount" name="fade">
          <RessourcesCard v-show="showRessources && userRessources" class="absolute w-full bg-gray-100 border-2 p-4 border-primary z-50 right-0 top-20" />
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import CustomNotification from '~/components/CustomNotification.vue'

export default {
  data() {
    return {
      showRessources: false
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
    userRessources() {
      return this.$store.state.userRessources
    },
    nrjToRecover() {
      return this.userRessources.max_energy - this.userRessources.energy
    },
    showRessourcesText() {
      return this.showRessources ? 'Close' : this.userAccount
    }
  },
  methods: {
    async handleLogin() {
      await this.$store.dispatch('getUserAccount')
      if (this.userAccount) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Login success',
            message: `You're now logged as ${this.userAccount}`
          }
        }, {
          timeout: 3000
        })
      }
    },

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
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>