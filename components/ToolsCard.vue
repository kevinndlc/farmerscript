<template>
  <GlassCard v-if="userTools.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="text-gray-600 text-xl font-semibold">
          Tools ({{ userTools.length }})
        </h2>
        <button v-if="sumToolsDurability" class="ml-2 text-xs sm:text-sm text-primary hover:text-secondary font-bold" @click="repairAllTools">REPAIR ALL</button>
      </div>
      <div>
        <MySwitch id="toggleTools" label="Auto Claim" :checked="autoClaimTools" @toggleSwitch="handleAutoClaimTools"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userTools" :autoclaim="autoClaimTools" @claimAsset="handleClaimTool"/>
      <Spinner v-if="claiming" />
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimTools: (localStorage.getItem('autoClaimTools') === 'true'),
      claiming: false,
      claimingAssets: []
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userTools() {
      return this.$store.state.userTools
    },
    userGold() {
      return this.$store.getters.userGold
    },
    sumToolsDurability() {
      let sum = 0
      this.userTools.forEach(tool => (sum += tool.durability - tool.current_durability))

      return sum
    }
  },
  async mounted() {
    await this.$store.dispatch('getUserTools')
  },
  methods: {
    handleAutoClaimTools() {
      this.autoClaimTools = !this.autoClaimTools
      localStorage.setItem('autoClaimTools', this.autoClaimTools)
    },
    async handleClaimTool(asset, nbTry) {
      if (nbTry === 1) {
        this.claimingAssets.push(asset.asset_id)
        this.claiming = true
      }
      try {
        const res = await this.wax.api.transact({
        actions: [{
          account: 'farmersworld',
          name: 'claim',
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

        const miningTool = this.$store.state.userTools.find(tool => tool.asset_id === asset.asset_id)

        const transactionId = res.transaction_id

        let logClaim
        let logBonus
        try {
          const result = await this.$axios.$get(`https://wax.eosphere.io/v2/history/get_transaction?id=${transactionId}`)
          logClaim = result.actions.find(e => e.act.name === 'logclaim').act.data.rewards
          logBonus = result.actions.find(e => e.act.name === 'logbonus').act.data.bonus_rewards
        } catch {
          logClaim = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logclaim')[0].act.data.rewards
          logBonus = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logbonus')[0].act.data.bonus_rewards
        }

        logClaim.forEach((log, index) => {
          this.$toast.success({
            component: CustomNotification,
            props: {
              title: `Successfully claimed your ${miningTool.name}`,
              message: `You've mined ${log} + ${logBonus[index]} in bonus rewards`
            }
          })
        })
      } catch(e) {
        if (nbTry < 10) {
          setTimeout(() => {
            this.handleClaimTool(asset, nbTry + 1)
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

      setTimeout(() => {
        this.$store.dispatch('getUserRessources')
        this.$store.dispatch('getUserTools')
      }, 1500)
    },
    async repairAllTools() {
      const priceInGold = this.sumToolsDurability / 5

      if (priceInGold > this.userGold) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Not enough gold',
            message: `You need ${priceInGold} GOLD to repair all your tools`
          }
        })
      } else {
        await Promise.all(this.userTools.map(async (tool) => {
          if (tool.durability - tool.current_durability > 0) {
            try {
              await this.wax.api.transact({
              actions: [{
                account: 'farmersworld',
                name: 'repair',
                authorization: [{
                  actor: this.wax.userAccount,
                  permission: 'active',
                }],
                data: {
                  asset_owner: this.wax.userAccount,
                  asset_id: tool.asset_id
                },
              }]},
              {
                blocksBehind: 3,
                expireSeconds: 30
              })
            } catch (e) {
              this.$toast.error({
                component: CustomNotification,
                props: {
                  title: 'Unexpected error',
                  message: e.message
                }
              })
            }
          }
        }))

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Successfully repaired your tools',
            message: `Your tools have all been repaired for a total cost of ${priceInGold} GOLD`
          }
        })

        setTimeout(async () => {
          await this.$store.dispatch('getUserRessources')
          await this.$store.dispatch('getUserTools')
        }, 1500)
      }
    }
  }
}
</script>