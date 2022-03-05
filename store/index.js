import Vuex from 'vuex'

const createStore = () => {
  // eslint-disable-next-line import/no-named-as-default-member
  return new Vuex.Store({
    state: {
      wax: '',
      waxPrice: '',
      userAccount: '',
      userBalance: null,
      userCpu: {},
      withdrawalFee: '',

      userRessources: '',
      userTools: [],
      userMbs: [],
      userCrops: [],
      userAnimals: [],
      userBuildings: [],
      animations: false
    },
    mutations: {
      setWax(state, wax) {
        state.wax = wax
      },
      setWaxPrice(state, waxPrice) {
        state.waxPrice = waxPrice
      },
      setUserAccount(state, account) {
        state.userAccount = account
      },
      setUserBalance(state, balance) {
        state.userBalance = balance
      },
      setUserCpu(state, cpu) {
        state.userCpu = cpu
      },
      setWithdrawalFee(state, fee) {
        state.withdrawalFee = fee
      },

      setUserRessources(state, ressources) {        
        state.userRessources = ressources
      },
      setUserTools(state, tools) {        
        state.userTools = tools
      },
      setUserMbs(state, mbs) {        
        state.userMbs = mbs
      },
      setUserCrops(state, crops) {        
        state.userCrops = crops
      },
      setUserAnimals(state, animals) {
        state.userAnimals = animals
      },
      setUserBuildings(state, buildings) {
        state.userBuildings = buildings
      },

      setAnimations(state, animations) {        
        state.animations = animations
      }
    },
    actions: {
      getWax(vuexContext, wax) {
        vuexContext.commit('setWax', wax)
      },
      async getWaxPrice({ commit }) {
        const myHeaders = new Headers();
        myHeaders.append('pragma', 'no-cache');
        myHeaders.append('cache-control', 'no-cache');

        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd', {
          method: 'GET',
          headers: myHeaders
        })

        if (!response.ok) {
          return `An error has occured: ${response.status}`
        }

        const data = await response.json()

        commit('setWaxPrice', data.wax.usd)
      },
      async getUserAccount({ commit, getters }) {
        const userAccount = await getters.wax.login()
        commit('setUserAccount', userAccount)
      },
      async getUserBalance({ commit, getters }) {
        const data = await this.$axios.$post('https://chain.wax.io/v1/chain/get_account', {
          account_name: getters.userAccount
        })

        commit('setUserCpu', data.cpu_limit)

        const balance = Math.floor(parseFloat((data.core_liquid_balance).replace(/[^\d.-]/g, '')) * 100) / 100

        commit('setUserBalance', balance)
      },
      async getWithdrawalFee({ commit }) {
        const data = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "config",
          lower_bound: '',
          upper_bound: '',
          index_position: 1,
          key_type: "",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const fee = data.rows[0].fee

        commit('setWithdrawalFee', fee)
      },

      async getUserRessources({ commit, getters }) {
        const data = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "accounts",
          lower_bound: getters.userAccount,
          upper_bound: getters.userAccount,
          index_position: 1,
          key_type: "i64",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const ressources = data.rows[0]

        const userTemplates = (await this.$axios.$get('https://wax.api.atomicassets.io/atomicassets/v1/accounts/' + getters.userAccount)).data.templates
        const fcTemplate = userTemplates.find(template => template.template_id === '260676')
        let nbFarmerCoins = 0
        const barleySeedTemplate = userTemplates.find(template => template.template_id === '298595')
        let nbBarleySeeds = 0
        const barleyTemplate = userTemplates.find(template => template.template_id === '318606')
        let nbBarleys = 0
        const cornSeedTemplate = userTemplates.find(template => template.template_id === '298596')
        let nbCornSeeds = 0
        const cornTemplate = userTemplates.find(template => template.template_id === '318607')
        let nbCorns = 0
        const chickenEggsTemplate = userTemplates.find(template => template.template_id === '298612')
        let nbChickenEggs = 0
        const milkTemplate = userTemplates.find(template => template.template_id === '298593')
        let nbMilks = 0

        if (fcTemplate) {
            nbFarmerCoins = fcTemplate.assets
        }

        if (barleySeedTemplate) {
            nbBarleySeeds = barleySeedTemplate.assets
        }

        if (barleyTemplate) {
            nbBarleys = barleyTemplate.assets
        }

        if (cornSeedTemplate) {
            nbCornSeeds = cornSeedTemplate.assets
        }

        if (cornTemplate) {
            nbCorns = cornTemplate.assets
        }

        if (chickenEggsTemplate) {
            nbChickenEggs = chickenEggsTemplate.assets
        }

        if (milkTemplate) {
            nbMilks = milkTemplate.assets
        }

        ressources.balances.push(nbFarmerCoins + ' FC')
        ressources.balances.push(nbBarleySeeds + ' BARLEY SEEDS')
        ressources.balances.push(nbBarleys + ' BARLEYS')
        ressources.balances.push(nbCornSeeds + ' CORN SEEDS')
        ressources.balances.push(nbCorns + ' CORNS')
        ressources.balances.push(nbChickenEggs + ' CHICKEN EGGS')
        ressources.balances.push(nbMilks + ' MILKS')

        commit('setUserRessources', ressources)
      },

      async getUserTools({ commit, getters }) {
        const toolsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "tools",
          lower_bound: getters.userAccount,
          upper_bound: getters.userAccount,
          index_position: 2,
          key_type: "i64",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const toolConfsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "toolconfs",
          lower_bound: "",
          upper_bound: "",
          index_position: 1,
          key_type: "",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const tools = toolsData.rows
        const toolConfs = toolConfsData.rows

        tools.forEach(tool => {
          const toolConf = toolConfs.find(toolConf => toolConf.template_id === tool.template_id)
          tool.name = toolConf.template_name
          tool.img_url = 'https://ipfs.atomichub.io/ipfs/' + toolConf.img
        });

        commit('setUserTools', tools)
      },

      async getUserMbs({ commit, getters }) {
        const mbsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "mbs",
          lower_bound: getters.userAccount,
          upper_bound: getters.userAccount,
          index_position: 2,
          key_type: "i64",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const mbsConfsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "mbsconf",
          lower_bound: "",
          upper_bound: "",
          index_position: 1,
          key_type: "",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const mbs = mbsData.rows
        const mbsConfs = mbsConfsData.rows

        mbs.forEach(mb => {
          const mbsConf = mbsConfs.find(mbConf => mbConf.template_id === mb.template_id)
          mb.name = `${mbsConf.name} (${mbsConf.type})`
          mb.img_url = 'https://ipfs.atomichub.io/ipfs/' + mbsConf.img
        });

        commit('setUserMbs', mbs)
      },
      async getUserCrops({ commit, getters }) {
        const cropsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "crops",
          lower_bound: getters.userAccount,
          upper_bound: getters.userAccount,
          index_position: 2,
          key_type: "i64",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const cropConfsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "cropconf",
          lower_bound: "",
          upper_bound: "",
          index_position: 1,
          key_type: "",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const crops = cropsData.rows
        const cropConfs = cropConfsData.rows

        crops.forEach(crop => {
          const cropConf = cropConfs.find(cropConf => cropConf.template_id === crop.template_id)
          crop.name = cropConf.name
          crop.img_url = 'https://ipfs.atomichub.io/ipfs/' + cropConf.img
          crop.required_claims = cropConf.required_claims
        });

        commit('setUserCrops', crops)
      },
      async getUserAnimals({ commit, getters }) {
        const animalsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "animals",
          lower_bound: getters.userAccount,
          upper_bound: getters.userAccount,
          index_position: 2,
          key_type: "i64",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const animalConfsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "anmconf",
          lower_bound: "",
          upper_bound: "",
          index_position: 1,
          key_type: "",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const animals = animalsData.rows
        const animalConfs = animalConfsData.rows

        const fwTemplates = (await this.$axios.$get('https://wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=farmersworld&page=1&limit=500&order=desc&sort=created')).data

        animals.forEach(animal => {
          const animalConf = animalConfs.find(animalConf => animalConf.template_id === animal.template_id)
          animal.name = animalConf.name
          animal.img_url = 'https://ipfs.atomichub.io/ipfs/' + animalConf.img
          animal.required_claims = animalConf.required_claims
          animal.consumed_card = animalConf.consumed_card
          animal.consumed_card_name = animalConf.consumed_card === 0 ? '' : (fwTemplates.find(tpl => tpl.template_id === animal.consumed_card.toString())).name
          animal.consumed_quantity = animalConf.consumed_quantity
          animal.daily_claim_limit = animalConf.daily_claim_limit
          animal.reward_card_name = animalConf.reward_card === 0 ? '' : (fwTemplates.find(tpl => tpl.template_id === animalConf.reward_card.toString())).name

          if (animal.day_claims_at) {
            if (animal.day_claims_at.length === animal.daily_claim_limit && animal.next_availability < Math.min(...animal.day_claims_at) + 3600 * 24) {
              animal.next_availability = Math.min(...animal.day_claims_at) + 3600 * 24
            }
          }
        });

        commit('setUserAnimals', animals)
      },
      async getUserBuildings({ commit, getters }) {
        const buildingsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "buildings",
          lower_bound: getters.userAccount,
          upper_bound: getters.userAccount,
          index_position: 2,
          key_type: "i64",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const buildingConfsData = await this.$axios.$post('https://chain.wax.io/v1/chain/get_table_rows', {
          json: true,
          code: "farmersworld",
          scope: "farmersworld",
          table: "bldconf",
          lower_bound: "",
          upper_bound: "",
          index_position: 1,
          key_type: "",
          limit: "100",
          reverse: false,
          show_payer: false
        })

        const buildings = buildingsData.rows
        const buildingConfs = buildingConfsData.rows

        buildings.forEach(building => {
          const buildingConf = buildingConfs.find(buildingConf => buildingConf.template_id === building.template_id)
          building.name = buildingConf.name
          building.img_url = 'https://ipfs.atomichub.io/ipfs/' + buildingConf.img
          building.nb_slots = buildingConf.num_slots
          building.required_claims = buildingConf.required_claims
        });

        commit('setUserBuildings', buildings)
      },

      setAnimations({ commit }, animations) {
        commit('setAnimations', animations)
      }
    },
    getters: {
      wax(state) {
        return state.wax
      },
      userAccount(state) {
        return state.userAccount
      },

      userRessources(state) {
        return state.userRessources
      },
      userWood(state) {
        if (state.userRessources) {
          const woodRss = state.userRessources.balances.find(rss => rss.includes('WOOD'))
          if (!woodRss) {
            return 0
          }
          return parseFloat(woodRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userFood(state) {
        if (state.userRessources) {
          const foodRss = state.userRessources.balances.find(rss => rss.includes('FOOD'))
          if (!foodRss) {
            return 0
          }
          return parseFloat(foodRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userGold(state) {
        if (state.userRessources) {
          const goldRss = state.userRessources.balances.find(rss => rss.includes('GOLD'))
          if (!goldRss) {
            return 0
          }
          return parseFloat(goldRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userFc(state) {
        if (state.userRessources) {
          const fcRss = state.userRessources.balances.find(rss => rss.includes('FC'))
          if (!fcRss) {
            return 0
          }
          return parseInt(fcRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userBarleys(state) {
        if (state.userRessources) {
          const barleyRss = state.userRessources.balances.find(rss => rss.includes('BARLEYS'))
          if (!barleyRss) {
            return 0
          }
          return parseInt(barleyRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userBarleySeeds(state) {
        if (state.userRessources) {
          const barleySeedRss = state.userRessources.balances.find(rss => rss.includes('BARLEY SEEDS'))
          if (!barleySeedRss) {
            return 0
          }
          return parseInt(barleySeedRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userCorns(state) {
        if (state.userRessources) {
          const cornRss = state.userRessources.balances.find(rss => rss.includes('CORNS'))
          if (!cornRss) {
            return 0
          }
          return parseInt(cornRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userCornSeeds(state) {
        if (state.userRessources) {
          const cornSeedRss = state.userRessources.balances.find(rss => rss.includes('CORN SEEDS'))
          if (!cornSeedRss) {
            return 0
          }
          return parseInt(cornSeedRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userChickenEggs(state) {
        if (state.userRessources) {
          const chickenEggRss = state.userRessources.balances.find(rss => rss.includes('CHICKEN EGGS'))
          if (!chickenEggRss) {
            return 0
          }
          return parseInt(chickenEggRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userMilks(state) {
        if (state.userRessources) {
          const MilkRss = state.userRessources.balances.find(rss => rss.includes('MILKS'))
          if (!MilkRss) {
            return 0
          }
          return parseInt(MilkRss.replace(/[^\d.-]/g, ''))
        } else {
          return 0
        }
      },
      userFarmPlots(state) {
        if (state.userBuildings) {
          const farmPlots = state.userBuildings.filter(bld => bld.template_id === 298592)
          if (!farmPlots) {
            return []
          }
          farmPlots.forEach(farmPlot => {
            farmPlot.remaining_slots = farmPlot.nb_slots - farmPlot.slots_used
          })
          return farmPlots
        } else {
          return []
        }
      }
    }
  })
}

export default createStore