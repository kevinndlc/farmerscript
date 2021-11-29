<template>
  <div class="flex flex-col max-w-7xl px-4 mx-auto h-full gap-4">
    <WithdrawalAlert />
    <div v-if="userTools.length > 0 || userMbs.length > 0" class="flex flex-col md:flex-row gap-4">
      <ToolsCard />
      <MembershipsCard />
    </div>
    <div v-if="true" class="flex flex-col md:flex-row gap-4">
      <PlantsCard />
      <AnimalsCard />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userTools() {
      return this.$store.state.userTools
    },
    userMbs() {
      return this.$store.state.userMbs
    }
  },
  mounted() {
    this.$store.dispatch('getUserTools')
    this.$store.dispatch('getUserMbs')

    setInterval(() => {
      this.$store.dispatch('getUserTools')
      this.$store.dispatch('getUserMbs')
      this.$store.dispatch('getUserCrops')
      this.$store.dispatch('getUserAnimals')
    }, 60000)
  }
}
</script>