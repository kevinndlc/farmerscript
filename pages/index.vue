<template>
  <div>
    <HomeSection v-if="!userAccount" />
    <PricingSection v-else-if="!userHasPaid" />
    <DashboardSection v-else />
  </div>
</template>

<script>
import * as waxjs from '@waxio/waxjs/dist'

export default {
  computed: {
    userAccount() {
      return this.$store.state.userAccount
    },
    userHasPaid() {
      return this.$store.state.userHasPaid
    }
  },
  created() {
    this.$store.dispatch('getWax', new waxjs.WaxJS({
      rpcEndpoint: 'https://chain.wax.io/',
      tryAutoLogin: false
    }))
  }
}
</script>