<template>
  <GlassCard v-if="userAnimals.length > 0" class="rounded-xl w-full h-full p-4 pt-3 overflow-hidden">
    <div class="flex justify-between items-center border-b-2 border-gray-400 mb-2 pb-2">
      <div class="flex items-center">
        <h2 class="flex items-end text-gray-600 text-xl font-semibold">
          Animals ({{ userAnimals.length }})
        </h2>
      </div>
      <div>
        <MySwitch id="toggleAnimals" label="Auto Claim" :checked="autoClaimAnimals" @toggleSwitch="handleAutoClaimAnimals"/>
      </div>
    </div>
    <div>
      <Carousel :slides="userAnimals" :autoclaim="autoClaimAnimals" @claimAsset="handleClaimAnimal"/>
      <Spinner v-if="claiming" />
    </div>
  </GlassCard>
</template>

<script>
import CustomNotification from "~/components/CustomNotification.vue"

export default {
  data() {
    return {
      autoClaimAnimals: (localStorage.getItem('autoClaimAnimals') === 'true'),
      claiming: false,
      claimingAssets: [],
      usedFoodAssetsId: []
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
    handleAutoClaimAnimals() {
      this.autoClaimAnimals = !this.autoClaimAnimals
      localStorage.setItem('autoClaimAnimals', this.autoClaimAnimals)
    },
    async handleClaimAnimal(asset, nbTry) {
      if (nbTry === 1) {
        this.claimingAssets.push(asset.asset_id)
        this.claiming = true
      }
      const userTemplates = (await this.$axios.$get('https://wax.api.atomicassets.io/atomicassets/v1/accounts/' + this.wax.userAccount)).data.templates
      const foodTemplate = userTemplates.find(tpl => tpl.template_id === asset.consumed_card.toString())
      let nbFood

      if (!foodTemplate) {
        nbFood = 0
      } else {
        nbFood = parseInt(foodTemplate.assets)
      }
      
      if (nbFood < asset.consumed_quantity && asset.consumed_card !== 0) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: `Your ${asset.name} needs some food`,
            message: `You need ${asset.consumed_quantity} ${asset.consumed_card_name} to feed your ${asset.name}`
          }
        })
      } else {
        let usedFoodAssetsId
        try {
          if (asset.consumed_card === 0) {
            await this.wax.api.transact({
            actions: [{
              account: 'farmersworld',
              name: 'anmclaim',
              authorization: [{
                actor: this.wax.userAccount,
                permission: 'active',
              }],
              data: {
                animal_id: asset.asset_id,
                owner: this.wax.userAccount
              },
            }]},
            {
              blocksBehind: 3,
              expireSeconds: 30
            })

            if (asset.times_claimed === asset.required_claims - 1) {
              this.$toast.success({
                component: CustomNotification,
                props: {
                  title: `Successfully claimed your ${asset.name}`,
                  message: `It has just grown`
                }
              })
            } else {
              this.$toast.success({
                component: CustomNotification,
                props: {
                  title: `Successfully claimed your ${asset.name}`,
                  message: `It needs to be claimed ${asset.required_claims - (asset.times_claimed + 1)} more times`
                }
              })
            }
          } else {
            const userFoodAssets = (await this.$axios.$get(`https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=farmersworld&template_id=${asset.consumed_card}&owner=${this.wax.userAccount}&limit=100&order=desc&sort=asset_id`)).data
            
            const userFoodAssetsId = userFoodAssets.map(asset => asset.asset_id)

            let nbUsedFood = 0
            usedFoodAssetsId = userFoodAssetsId.filter(assetId => {
              if (!this.usedFoodAssetsId.includes(assetId) && nbUsedFood < asset.consumed_quantity) {
                this.usedFoodAssetsId.push(assetId)
                nbUsedFood++
                return true
              } else {
                return false
              }
            })

            if (usedFoodAssetsId.length === 0) {
              throw new Error(`You need ${asset.consumed_quantity} ${asset.consumed_card_name} to feed your ${asset.name}`)
            }

            const res = await this.wax.api.transact({
            actions: [{
              account: 'atomicassets',
              name: 'transfer',
              authorization: [{
                actor: this.wax.userAccount,
                permission: 'active',
              }],
              data: {
                asset_ids: usedFoodAssetsId,
                from: this.wax.userAccount,
                memo: `feed_animal:${asset.asset_id}`,
                to: 'farmersworld'
              },
            }]},
            {
              blocksBehind: 3,
              expireSeconds: 30
            })

            if (asset.times_claimed === asset.required_claims - 1) {
              const nbRewards = res.processed.action_traces.filter(e => e.receiver === 'atomicassets')[0].inline_traces.filter(e => e.act.name === 'logclaimrs')[0].act.data.quantity
              this.$toast.success({
                component: CustomNotification,
                props: {
                  title: `Successfully fed your ${asset.name} with ${asset.consumed_card_name}`,
                  message: `You just obtained ${nbRewards} ${asset.reward_card_name}s`
                }
              })
            } else {
              this.$toast.success({
                component: CustomNotification,
                props: {
                  title: `Successfully fed your ${asset.name} with ${asset.consumed_card_name}`,
                  message: `It needs to be fed ${asset.required_claims - (asset.times_claimed + 1)} more times before you get your ${asset.reward_card_name}s`
                }
              })
            }
          }
        } catch (e) {
          usedFoodAssetsId.forEach(assetId => {
            this.usedFoodAssetsId.splice(this.usedFoodAssetsId.indexOf(assetId), 1)
          })
          if (nbTry < 10) {
            setTimeout(() => {
              this.handleClaimAnimal(asset, nbTry + 1)
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
      }

      this.claimingAssets.splice(this.claimingAssets.indexOf(asset.asset_id), 1)

      if (this.claimingAssets.length === 0) {
        this.claiming = false
      }

      setTimeout(() => {
        this.$store.dispatch('getUserRessources')
        this.$store.dispatch('getUserAnimals')
      }, 1500)
    }
  }
}
</script>