<template>
  <div>
    <HomeSection v-if="!userAccount" />
    <DashboardSection v-else />
  </div>
</template>

<script>
import * as waxjs from '@waxio/waxjs/dist'

export default {
  computed: {
    userAccount() {
      return this.$store.state.userAccount
    }
  },
  created() {
    this.$store.dispatch('getWax', new waxjs.WaxJS({
      rpcEndpoint: 'https://api.wax.greeneosio.com', // https://wax.cryptolions.io
      tryAutoLogin: true
    }))
  }
}
</script>