import Vuex from 'vuex'

const createStore = () => {
  // eslint-disable-next-line import/no-named-as-default-member
  return new Vuex.Store({
    state: {
      wax: '',
      waxPrice: '',
      userAccount: '',
      userBalance: null,
      userHasPaid: true,
      withdrawalFee: '',

      userRessources: '',
      userTools: [],
      userMbs: [],
      userCrops: [],
      userAnimals: []
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
      setUserHasPaid(state, userHasPaid) {
        state.userHasPaid = userHasPaid
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

        const balance = Math.floor(parseFloat((data.core_liquid_balance).replace(/[^\d.-]/g, '')) * 100) / 100

        commit('setUserBalance', balance)
      },
      setUserHasPaid({ commit }, userHasPaid) {
        commit('setUserHasPaid', userHasPaid)
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

        if (fcTemplate) {
            nbFarmerCoins = fcTemplate.assets
        }

        ressources.balances.push(nbFarmerCoins + ' FC')

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
          tool.img_url = 'https://mypinata.cloud/ipfs/' + toolConf.img
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
          mb.img_url = 'https://mypinata.cloud/ipfs/' + mbsConf.img
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
          crop.img_url = 'https://mypinata.cloud/ipfs/' + cropConf.img
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

        animals.forEach(animal => {
          const animalConf = animalConfs.find(animalConf => animalConf.template_id === animal.template_id)
          animal.name = animalConf.name
          animal.img_url = 'https://mypinata.cloud/ipfs/' + animalConf.img
          animal.required_claims = animalConf.required_claims
        });

        commit('setUserAnimals', animals)
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
      }
    }
  })
}

export default createStore