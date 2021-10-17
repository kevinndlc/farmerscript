<template>
  <section>
    <div class="pt-2 px-3 sm:px-6 lg:px-8 lg:pt-6">
      <div class="text-center">
        <h2 class="text-lg leading-6 font-semibold text-gray-600 uppercase tracking-wider">
          Pricing
        </h2>
        <p class="mt-2 text-3xl font-extrabold text-gray-800 sm:text-4xl lg:text-5xl">
          <span class="block md:inline">The right price for you,</span> 
           whoever you are
        </p>
        <p class="mt-3 max-w-4xl mx-auto text-base text-gray-600 sm:mt-5 sm:text-lg">
          <span class="block md:inline">In order to simplify the subscription,</span> 
          <span>&nbsp;you can pay directly with your WAX tokens</span><br>
          <span class="block mt-2 font-medium text-sm sm:text-base">1 WAX = {{ waxPrice }}$</span>
        </p>
      </div>
    </div>

    <div class="mt-8 pb-12 lg:mt-12 lg:pb-20">
      <div class="relative z-0">
        <div class="absolute inset-0 h-5/6 sm:rounded-b-xl lg:h-2/3" />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative lg:grid lg:grid-cols-7">
            <div class="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
              <div class="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg">
                <div class="flex-1 flex flex-col">
                  <div class="bg-white px-6 py-10">
                    <div>
                      <h3 id="tier-hobby" class="text-center text-2xl font-medium text-gray-600">
                        1 month
                      </h3>
                      <div class="mt-4 flex items-center justify-center">
                        <span class="px-3 flex items-start text-6xl tracking-tight text-gray-800">
                          <span class="mt-2 mr-2 text-4xl font-medium">
                            $
                          </span>
                          <span class="font-extrabold">
                            19.99
                          </span>
                        </span>
                        <span class="text-xl font-medium text-gray-500">
                          /month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                    <ul role="list" class="space-y-4">
                      <li v-for="feature in oneFeatures" :key="feature" class="flex items-start">
                        <div class="flex-shrink-0">
                          <CheckIcon class="flex-shrink-0 h-6 w-6 text-green-500" aria-hidden="true" />
                        </div>
                        <p class="ml-3 text-base font-medium text-gray-500">
                          {{ feature }}
                        </p>
                      </li>
                    </ul>
                    <div class="mt-8">
                      <div class="rounded-lg shadow-md">
                        <button v-if="waxPrice" class="block w-full text-center rounded-lg border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white hover:bg-gray-800" aria-describedby="tier-hobby" @click="sendWax(getPriceInWax(19.99), '1month_membership')">
                          Send {{ getPriceInWax(19.99) }} WAX
                        </button>
                        <DisabledButton v-else class="block w-full py-3">
                          Getting WAX price...
                        </DisabledButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
              <div class="relative z-10 rounded-lg shadow-xl">
                <div class="pointer-events-none absolute inset-0 rounded-lg border-2 border-primary" aria-hidden="true" />
                <div class="absolute inset-x-0 top-0 transform translate-y-px">
                  <div class="flex justify-center transform -translate-y-1/2">
                    <span class="inline-flex rounded-full bg-primary px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">
                      Most popular
                    </span>
                  </div>
                </div>
                <div class="bg-white rounded-t-lg px-6 pt-12 pb-10">
                  <div>
                    <h3 id="tier-growth" class="text-center text-3xl font-semibold text-gray-600 sm:-mx-6">
                      Lifetime
                    </h3>
                    <div class="mt-4 flex items-center justify-center">
                      <span class="px-3 flex items-start text-6xl tracking-tight text-gray-800 sm:text-6xl">
                        <span class="mt-2 mr-2 text-4xl font-medium">
                          $
                        </span>
                        <span class="font-extrabold">
                          99.99
                        </span>
                      </span>
                      <span class="text-2xl font-medium text-gray-500">
                        once
                      </span>
                    </div>
                  </div>
                </div>
                <div class="border-t-2 border-gray-100 rounded-b-lg pt-10 pb-8 px-6 bg-gray-50 sm:px-10 sm:py-10">
                  <ul role="list" class="space-y-4">
                    <li v-for="feature in lftmFeatures" :key="feature" class="flex items-start">
                      <div class="flex-shrink-0">
                        <CheckIcon class="flex-shrink-0 h-6 w-6 text-green-500" aria-hidden="true" />
                      </div>
                      <p class="ml-3 text-base font-medium text-gray-500">
                        {{ feature }}
                      </p>
                    </li>
                  </ul>
                  <div class="mt-10">
                    <div class="rounded-lg shadow-md">
                      <PrimaryButton v-if="waxPrice" class="block w-full px-6 py-4 text-xl" aria-describedby="tier-growth" @click="sendWax(getPriceInWax(99.99), 'lftm_membership')">
                        Send {{ getPriceInWax(99.99) }} WAX
                      </PrimaryButton>
                      <DisabledButton v-else class="block w-full py-4">
                        Getting WAX price...
                      </DisabledButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
              <div class="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg">
                <div class="flex-1 flex flex-col">
                  <div class="bg-white px-6 py-10">
                    <div>
                      <h3 id="tier-scale" class="text-center text-2xl font-medium text-gray-600">
                        3 months
                      </h3>
                      <div class="mt-4 flex items-center justify-center">
                        <span class="px-3 flex items-start text-6xl tracking-tight text-gray-800">
                          <span class="mt-2 mr-2 text-4xl font-medium">
                            $
                          </span>
                          <span class="font-extrabold">
                            14.99
                          </span>
                        </span>
                        <span class="text-xl font-medium text-gray-500">
                          /month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                    <ul role="list" class="space-y-4">
                      <li v-for="feature in threeFeatures" :key="feature" class="flex items-start">
                        <div class="flex-shrink-0">
                          <CheckIcon class="flex-shrink-0 h-6 w-6 text-green-500" aria-hidden="true" />
                        </div>
                        <p class="ml-3 text-base font-medium text-gray-500">
                          {{ feature }}
                        </p>
                      </li>
                    </ul>
                    <div class="mt-8">
                      <div class="rounded-lg shadow-md">
                        <button v-if="waxPrice" class="block w-full text-center rounded-lg border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white hover:bg-gray-800" aria-describedby="tier-scale" @click="sendWax(getPriceInWax(44.99), '3months_membership')">
                          Send {{ getPriceInWax(44.99) }} WAX
                        </button>
                        <DisabledButton v-else class="block w-full py-3">
                          Getting WAX price...
                        </DisabledButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"
import { db, doc, collection, getDocs, addDoc, updateDoc, Timestamp } from '@/firebase/config'

const oneFeatures = ['Payable with WAX', 'Updated with new content', 'Enjoy all the services']
const threeFeatures = ['Payable with WAX', 'Updated with new content', 'Enjoy all the services']
const lftmFeatures = [
  'Payable with WAX tokens',
  'Frequently updated with new content',
  'Enjoy all the services without restriction',
  '2 days money-back guarantee',
  'Priority support access',
]

export default {
  data() {
    return {
      oneFeatures,
      threeFeatures,
      lftmFeatures
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    waxPrice() {
      return this.$store.state.waxPrice
    },
    userBalance() {
      return this.$store.state.userBalance
    }
  },
  async mounted() {
    await this.$store.dispatch('getWaxPrice')
    await this.$store.dispatch('getUserBalance')
    setInterval(async () => {
      await this.$store.dispatch('getWaxPrice')
      await this.$store.dispatch('getUserBalance')
    }, 15000);
  },
  methods: {
    getPriceInWax(priceUsd) {
      return Math.round(priceUsd / this.waxPrice * 100) / 100
    },
    async sendWax(amountWax, memo) {
      if (this.userBalance > amountWax) {
        try {
          await this.wax.api.transact({
            actions: [{
              account: 'eosio.token',
              name: 'transfer',
              authorization: [{
                actor: this.wax.userAccount,
                permission: 'active',
              }],
              data: {
                from: this.wax.userAccount,
                to: 'dgzxi.wam',
                quantity: amountWax.toFixed(2) + '000000 WAX',
                memo
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30
          })
        } catch(e) {
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: 'Unexpected error',
              message: e.message
            }
          })
          return null
        }

        let newExpirationDate

        if (memo === 'lftm_membership') {
          newExpirationDate = new Date(2099, 31, 12)
        } else {
          const nowDate = new Date()
          const monthsToAdd = memo === '1month_membership' ? 1 : 3
          newExpirationDate = new Date(nowDate.setMonth(nowDate.getMonth() + monthsToAdd))
        }

        const newUserEntry = {
          account: this.wax.userAccount,
          expiration_dt: Timestamp.fromDate(newExpirationDate)
        }

        const memberships = await this.getMembershipsFromFirebase()

        if (!memberships) {
          return null
        }

        const existingUser = memberships.find(membership => (membership.account === this.wax.userAccount))

        if (existingUser) {
          const updatedMembership = await this.updateMembershipInFirebase(existingUser.id, newUserEntry)
          if (!updatedMembership) {
            this.$toast.error({
              component: CustomNotification,
              props: {
                title: 'Error updating your membership',
                message: 'Please contact us at support@farmerscript.online to resolve this issue'
              }
            })
            return null
          }
        } else {
          const createdMembership = await this.createMembershipInFirebase(newUserEntry)
          if (!createdMembership) {
            this.$toast.error({
              component: CustomNotification,
              props: {
                title: 'Error creating your account',
                message: 'Please contact us at support@farmerscript.online to resolve this issue'
              }
            })
            return null
          }
        }

        this.$store.dispatch('setUserHasPaid', true)
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Payment successful',
            message: memo === 'lftm_membership' ? 'Your membership is now active for life' : `Your membership will be active until ${newExpirationDate.toLocaleDateString()}`
          }
        })

      } else {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Insufficient balance',
            message: 'You don\'t have enough WAX in your wallet to get this membership'
          }
        })
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
    async createMembershipInFirebase(data) {
      try {
        await addDoc(collection(db, 'memberships'), data)
        return true
      } catch {
        return false
      }
    },
    async updateMembershipInFirebase(docId, data) {
      try {
        await updateDoc(doc(db, 'memberships', docId), data)
        return true
      } catch {
        return false
      }
    }
  }
}
</script>