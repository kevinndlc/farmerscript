<template>
  <GlassCard v-if="userMbs.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="flex items-end text-gray-600 text-xl font-semibold">
          Memberships ({{ userMbs.length }})
        </h2>
      </div>
      <div>
        <MySwitch id="toggleMbs" label="Auto Claim" :checked="autoClaimMbs" @toggleSwitch="handleAutoClaimMbs"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userMbs" :autoclaim="autoClaimMbs" @claimAsset="handleClaimMbs"/>
      <Spinner v-if="claiming" />
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimMbs: (localStorage.getItem('autoClaimMbs') === 'true'),
      claiming: false,
      claimingAssets: []
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
    handleAutoClaimMbs() {
      this.autoClaimMbs = !this.autoClaimMbs
      localStorage.setItem('autoClaimMbs', this.autoClaimMbs)
    },
    async handleClaimMbs(asset, nbTry) {
      if (nbTry === 1) {
        this.claimingAssets.push(asset.asset_id)
        this.claiming = true
      }
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
            asset_id: asset.asset_id
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })

        const miningMbs = this.$store.state.userMbs.find(mbs => mbs.asset_id === asset.asset_id)

        const transactionId = res.transaction_id

        let logClaim
        let logBonus
        try {
          const result = await this.$axios.$get(`https://wax.eosphere.io/v2/history/get_transaction?id=${transactionId}`)
          logClaim = result.actions.find(e => e.act.name === 'logmbsclaim').act.data.data.amounts
          logBonus = result.actions.find(e => e.act.name === 'logbonus').act.data.bonus_rewards
        } catch {
          logClaim = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logmbsclaim')[0].act.data.amounts
          logBonus = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logbonus')[0].act.data.bonus_rewards
        }

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
        if (nbTry < 10) {
          setTimeout(() => {
            this.handleClaimMbs(asset, nbTry + 1)
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
        await this.$store.dispatch('getUserMbs')
      }, 1500)
    }
  }
}
</script>