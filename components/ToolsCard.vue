<template>
  <GlassCard v-if="userTools.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="text-gray-600 text-xl font-semibold">
          <span>Tools ({{ userTools.length }})</span>
        </h2>
        <button v-if="sumToolsDurability" class="ml-2 text-sm text-primary hover:text-secondary font-bold" @click="repairAllTools">REPAIR ALL</button>
      </div>
      <div>
        <MySwitch id="toggleTools" label="Auto Claim" :checked="autoClaimTools" @toggleSwitch="autoClaimTools = !autoClaimTools"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userTools" :autoclaim="autoClaimTools" @claimAsset="handleClaimTool"/>
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimTools: false
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
    async handleClaimTool(assetId, nbTry) {
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
            asset_id: assetId
          },
        }]},
        {
          blocksBehind: 3,
          expireSeconds: 30
        })

        const miningTool = this.$store.state.userTools.find(tool => tool.asset_id === assetId)
        
        const logClaim = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logclaim')[0].act.data.rewards
        const logBonus = res.processed.action_traces.filter(e => e.receiver === 'farmersworld')[0].inline_traces.filter(e => e.receiver === 'farmersworld').filter(e => e.act.name === 'logbonus')[0].act.data.bonus_rewards

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
        if (nbTry < 3) {
          setTimeout(async () => {
            await this.handleClaimTool(assetId, nbTry + 1)
          }, 500)
        } 
        return null
      }

      setTimeout(async () => {
        await this.$store.dispatch('getUserRessources')
        await this.$store.dispatch('getUserTools')
      }, 1000)
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
        }, 1000)
      }
    }
  }
}
</script>