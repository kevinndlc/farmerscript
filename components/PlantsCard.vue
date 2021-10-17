<template>
  <GlassCard v-if="userCrops.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="flex items-end text-gray-600 text-xl font-semibold">
          <span>Plants ({{ userCrops.length }})</span>
        </h2>
      </div>
      <div>
        <MySwitch id="toggleCrops" label="Auto Claim" :checked="autoClaimCrops" @toggleSwitch="autoClaimCrops = !autoClaimCrops"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userCrops" :autoclaim="autoClaimCrops" @claimAsset="handleClaimCrop"/>
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimCrops: false
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userCrops() {
      return this.$store.state.userCrops
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserCrops')
  },
  methods: {
    async handleClaimCrop(assetId, nbTry) {
      try {
        const res = await this.wax.api.transact({
        actions: [{
          account: 'farmersworld',
          name: 'cropclaim',
          authorization: [{
            actor: this.wax.userAccount,
            permission: 'active',
          }],
          data: {
            owner: this.wax.userAccount,
            crop_id: assetId
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })

        console.log(res, assetId, nbTry);

        const claimingCrop = this.$store.state.userCrops.find(crop => crop.asset_id === assetId)

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: `Successfully claimed your ${claimingCrop.name}`,
            message: `It needs to be watered ${claimingCrop.required_claims - (claimingCrop.times_claimed + 1)} more times before you get your ${claimingCrop.name.replace(' Seed', '')}s`
          }
        })
      } catch(e) {
        if (nbTry < 3) {
          await this.handleClaimCrop(assetId, nbTry + 1)
        } else {
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: 'Unexpected error',
              message: e.message
            }
          })
        }
        return null
      }

      setTimeout(async () => {
        await this.$store.dispatch('getUserRessources')
        await this.$store.dispatch('getUserCrops')
      }, 1000)
    }
  }
}
</script>