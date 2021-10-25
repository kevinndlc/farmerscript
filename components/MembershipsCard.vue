<template>
  <GlassCard v-if="userMbs.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="flex items-end text-gray-600 text-xl font-semibold">
          <span>Memberships ({{ userMbs.length }})</span>
        </h2>
      </div>
      <div>
        <MySwitch id="toggleMbs" label="Auto Claim" :checked="autoClaimMbs" @toggleSwitch="autoClaimMbs = !autoClaimMbs"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userMbs" :autoclaim="autoClaimMbs" @claimAsset="handleClaimMbs"/>
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimMbs: false
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userMbs() {
      return this.$store.state.userMbs
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserMbs')
  },
  methods: {
    async handleClaimMbs(assetId, nbTry) {
      try {
        const res = await this.wax.api.transact({
        actions: [{
          account: 'farmersworld',
          name: 'mbsclaim',
          authorization: [{
            actor: this.wax.userAccount,
            permission: 'active',
          }],
          data: {
            owner: this.wax.userAccount,
            asset_id: assetId
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })

        const miningMbs = this.$store.state.userMbs.find(mbs => mbs.asset_id === assetId)

        const logClaim = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logmbsclaim')[0].act.data.amounts
        const logBonus = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logbonus')[0].act.data.bonus_rewards

        logClaim.forEach((log, index) => {
          this.$toast.success({
            component: CustomNotification,
            props: {
              title: `Successfully claimed your ${miningMbs.name}`,
              message: `You've mined ${log} Farmer Coin${log > 0 ? 's' : ''} + ${logBonus[index]} in bonus rewards`
            }
          })
        })
      } catch(e) {
        if (nbTry < 3) {
          await this.handleClaimMbs(assetId, nbTry + 1)
        } 
        return null
      }

      setTimeout(async () => {
        await this.$store.dispatch('getUserRessources')
        await this.$store.dispatch('getUserMbs')
      }, 500)
    }
  }
}
</script>