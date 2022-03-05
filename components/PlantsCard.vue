<template>
  <GlassCard v-if="userCrops.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="text-gray-600 text-xl font-semibold">
          Plants ({{ userCrops.length }})
        </h2>
      </div>
      <div>
        <MySwitch id="toggleCrops" label="Auto Claim" :checked="autoClaimCrops" @toggleSwitch="handleAutoClaimCrops"/>
      </div>
    </div>
    <div :key="nbCrops">
      <Carousel :slides="userCrops" :autoclaim="autoClaimCrops" @claimAsset="handleClaimCrop"/>
      <Spinner v-if="claiming" />
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimCrops: (localStorage.getItem('autoClaimCrops') === 'true'),
      claiming: false,
      claimingAssets: []
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userCrops() {
      return this.$store.state.userCrops
    },
    nbCrops() {
      return this.userCrops.length
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserCrops')
  },
  methods: {
    handleAutoClaimCrops() {
      this.autoClaimCrops = !this.autoClaimCrops
      localStorage.setItem('autoClaimCrops', this.autoClaimCrops)
    },
    async handleClaimCrop(asset, nbTry) {
      if (nbTry === 1) {
        this.claimingAssets.push(asset.asset_id)
        this.claiming = true
      }
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
            crop_id: asset.asset_id
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })

        if (asset.times_claimed === asset.required_claims - 1) {
          const nbRewards = res.processed.action_traces.find(e => e.receiver === 'farmersworld').inline_traces.find(e => e.act.name === 'logclaimrs').act.data.quantity

          this.$toast.success({
            component: CustomNotification,
            props: {
              title: `Successfully claimed your ${asset.name}`,
              message: `You just obtained ${nbRewards} ${asset.name.replace(' Seed', '')}s`
            }
          })
        } else {
          this.$toast.success({
            component: CustomNotification,
            props: {
              title: `Successfully claimed your ${asset.name}`,
              message: `It needs to be watered ${asset.required_claims - (asset.times_claimed + 1)} more times before you get your ${asset.name.replace(' Seed', '')}s`
            }
          })
        }
      } catch(e) {
        if (nbTry < 10) {
          setTimeout(() => {
            this.handleClaimCrop(asset, nbTry + 1)
          }, 3000)
          return null
        } else {
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: 'Unexpected error',
              message: e.message
            }
          })
        }
      }

      this.claimingAssets.splice(this.claimingAssets.indexOf(asset.asset_id), 1)

      if (this.claimingAssets.length === 0) {
        this.claiming = false
      }

      setTimeout(async () => {
        await this.$store.dispatch('getUserRessources')
        await this.$store.dispatch('getUserCrops')
      }, 1500)
    }
  }
}
</script>