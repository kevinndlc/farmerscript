<template>
  <GlassCard v-if="userAnimals.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="flex items-end text-gray-600 text-xl font-semibold">
          <span>Animals ({{ userAnimals.length }})</span>
        </h2>
      </div>
      <div>
        <MySwitch id="toggleAnimals" label="Auto Claim" :checked="autoClaimAnimals" @toggleSwitch="autoClaimAnimals = !autoClaimAnimals"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userAnimals" :autoclaim="autoClaimAnimals" @claimAsset="handleClaimAnimal"/>
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimAnimals: false
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userAnimals() {
      return this.$store.state.userAnimals
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserAnimals')
  },
  methods: {
    handleClaimAnimal(assetId, nbTry) {
      this.$toast.success({
        component: CustomNotification,
        props: {
          title: `Successfully claimed your Animal (${assetId})`,
          message: `You've mined in bonus rewards`
        }
      })
    }
  }
}
</script>