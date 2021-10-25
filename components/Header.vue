<template>
  <header>
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center py-6">
        <div class="flex-shrink-0">
          <span class="sr-only">FarmerScript</span>
          <img class="h-10 w-auto" src="~assets/img/header-logo.png" alt="" />
        </div>
        <div v-if="userHasPaid && userRessources" class="hidden md:grid grid-cols-4 w-full h-full">
          <div class="flex justify-center items-center">
            <span class="text-gray-600 font-medium mr-2">{{ userFc }}</span>
            <img class="h-8 w-8" src="~assets/img/fc.png" alt="Farmers Coin">
          </div>
          <div class="flex justify-center items-center">
            <span class="text-gray-600 font-medium mr-2">{{ userWood }}</span>
            <img class="h-8 w-8" src="~assets/img/wood.png" alt="Wood">
          </div>
          <div class="flex justify-center items-center">
            <span class="text-gray-600 font-medium mr-2">{{ userGold }}</span>
            <img class="h-8 w-8" src="~assets/img/gold.png" alt="Gold">
          </div>
          <div class="flex justify-center items-center">
            <span class="text-gray-600 font-medium mr-2">{{ userFood }}</span>
            <img class="h-8 w-8" src="~assets/img/food.png" alt="Food">
          </div>
        </div>
        <div class="flex items-center flex-shrink-0">
          <div v-if="userHasPaid && userRessources" class="hidden md:flex items-center" @mouseover="hoverNrj = true" @mouseout="hoverNrj = false">
            <span v-if="!hoverNrj || nrjToRecover === 0" class="text-xs md:text-base text-gray-600 font-medium md:mr-2">{{ userRessources.energy }} / {{ userRessources.max_energy }}</span>
            <button v-if="hoverNrj && nrjToRecover > 0" class="p-2 text-xs md:text-base text-gray-600 font-medium md:mr-2" @click="recoverNrj">RECOVER</button>
            <img class="h-8 w-8 mr-2" src="~assets/img/nrj.png" alt="Energy">
          </div>
          <span v-if="!userHasPaid && userBalance >= 0" class="text-gray-600 font-medium mr-2">{{ userBalance }} WAX</span>
          <PrimaryButton v-if="!userAccount" @click="handleLogin">Log in</PrimaryButton>
          <PrimaryButton v-else>{{ userAccount }}</PrimaryButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import CustomNotification from '~/components/CustomNotification.vue'
import { db, collection, getDocs } from '@/firebase/config'

export default {
  data() {
    return {
      hoverNrj: false
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
    userHasPaid() {
      return this.$store.state.userHasPaid
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
    }
  },
  created() {
    setInterval(async () => {
      if (this.userAccount) {
        await this.checkPayment()
      }
    }, 3600000)
  },
  methods: {
    async handleLogin() {
      await this.$store.dispatch('getUserAccount')
      if (this.userAccount) {
        const validMembership = await this.checkPayment() 

        if (validMembership) {
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
      }
    },
    async checkPayment() {
      const memberships = await this.getMembershipsFromFirebase()

      if (!memberships) {
        return null
      }

      const currentMembership = memberships.find(membership => (membership.account === this.userAccount))

      if (!currentMembership) {
        this.$store.dispatch('setUserHasPaid', false)
      } else {
        const membershipExpirationDate = new Date(currentMembership.expiration_dt.seconds * 1000)
        const validMembership = (membershipExpirationDate - new Date()) > 0

        if (validMembership) {
          this.$store.dispatch('setUserHasPaid', true)
          return true
        } else {
          this.$store.dispatch('setUserHasPaid', false)
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: 'Expired membership',
              message: `Your membership expired on the ${membershipExpirationDate.toLocaleString()}, please renew your payment to continue enjoying the services`
            }
          })
          return false
        }
      }
    },
    async getMembershipsFromFirebase() {
      try {
        const res = await getDocs(collection(db, 'memberships'))

        const membershipsWithId = res.docs.map(doc => {
          return { ...doc.data(), id: doc.id }
        })

        return membershipsWithId
      } catch {
        this.$toast.error('Error fetching memberships')
        return false
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