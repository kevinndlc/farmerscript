<template>
  <div>
    <HomeSection v-if="!userAccount" />
    <DashboardSection v-else />
  </div>
</template>

<script>
export default {
  computed: {
    userAccount() {
      return this.$store.state.userAccount
    }
  },
  mounted() {
    setTimeout(() => {
      location.reload()
    }, 20 * 60 * 1000);
  },
}
</script>