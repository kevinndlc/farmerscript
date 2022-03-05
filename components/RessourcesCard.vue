<template>
  <div class="rssgrid rounded-xl overflow-hidden">
    <!-- Ressource Details -->
    <div
      class="
        rssdetail
        border-b-2
        sm:border-b-0 sm:border-r-2
        text-gray-600
        border-primary
        pb-4
        sm:pb-0 sm:pr-4
      "
    >
      <div>
        <div class="sm:flex justify-between items-center">
          <div>
            <h2 class="text-sm sm:text-lg text-gray-800 font-medium">
              Currently logged as
              <span class="font-bold text-primary">{{ userAccount }}</span>
            </h2>
            <span class="text-xs font-medium"
              >Balance: {{ userBalance }} WAX (${{ userBalanceInUsd }})</span
            >
          </div>
          <div
            class="
              hidden
              md:inline-block
              bg-primary
              rounded-lg
              py-2
              px-3
              text-white
              font-medium
            "
          >
            CPU: {{ userCpuPercentage }}%
          </div>
        </div>
        <hr class="my-3 sm:mb-0" />
      </div>
      <div
        v-if="!currentDetails"
        class="text-center sm:text-lg grid place-content-center"
      >
        <span class="hidden sm:inline text-gray-600"
          >Click on a resource on the right to get a detailed view</span
        >
        <span class="sm:hidden text-gray-600"
          >Click on a resource below to get a detailed view</span
        >
      </div>
      <div
        v-else
        class="text-center text-sm sm:text-base grid place-content-center"
      >
        <div v-if="currentDetails.type === 'PRIMARY'">
          <h3
            v-if="rssDetails.name"
            class="text-lg sm:text-2xl font-medium underline"
          >
            {{ rssDetails.name.toUpperCase() }}
          </h3>
          <p class="mt-2">
            Price : {{ rssDetails.price }} WAX (${{ rssDetails.priceInUsd }})
          </p>
          <div class="md:flex justify-center gap-8">
            <div v-if="rssDetails.quantity" class="mt-4">
              <p>
                {{ rssDetails.quantity }} {{ rssDetails.name.toUpperCase() }} in
                Game
              </p>
              <div>{{ withdrawPercentage }}%</div>
              <div class="flex justify-center items-center gap-2">
                <button
                  class="
                    text-xs
                    font-medium
                    bg-gray-600
                    text-white
                    hover:bg-secondary
                    rounded-lg
                    px-2
                    py-1
                  "
                  @click="withdrawPercentage = 1"
                >
                  MIN
                </button>
                <input
                  v-model="withdrawPercentage"
                  type="range"
                  min="0"
                  max="100"
                  class="slider"
                />
                <button
                  class="
                    text-xs
                    font-medium
                    bg-gray-600
                    text-white
                    hover:bg-secondary
                    rounded-lg
                    px-2
                    py-1
                  "
                  @click="withdrawPercentage = 100"
                >
                  MAX
                </button>
              </div>
              <PrimaryButton
                class="mt-2 w-full"
                @click="
                  handleWithdrawal(
                    currentDetails.name,
                    (rssDetails.quantity * withdrawPercentage) / 100
                  )
                "
                >Withdraw
                {{
                  Math.round(
                    ((rssDetails.quantity * withdrawPercentage) / 100) *
                      (1 - withdrawalFee / 100) *
                      100
                  ) / 100
                }}
                {{ rssDetails.token }} </PrimaryButton
              ><br />
            </div>
            <div v-if="rssDetails.tokenQuantity" class="mt-4">
              <p>
                {{ rssDetails.tokenQuantity }} {{ rssDetails.token }} in Wallet
              </p>
              <div>{{ depositPercentage }}%</div>
              <div class="flex justify-center items-center gap-2">
                <button
                  class="
                    text-xs
                    font-medium
                    bg-gray-600
                    text-white
                    hover:bg-secondary
                    rounded-lg
                    px-2
                    py-1
                  "
                  @click="depositPercentage = 1"
                >
                  MIN
                </button>
                <input
                  v-model="depositPercentage"
                  type="range"
                  min="0"
                  max="100"
                  class="slider"
                />
                <button
                  class="
                    text-xs
                    font-medium
                    bg-gray-600
                    text-white
                    hover:bg-secondary
                    rounded-lg
                    px-2
                    py-1
                  "
                  @click="depositPercentage = 100"
                >
                  MAX
                </button>
              </div>
              <PrimaryButton
                class="mt-2 w-full"
                @click="
                  handleDeposit(
                    rssDetails.token,
                    (rssDetails.tokenQuantity * depositPercentage) / 100
                  )
                "
                >Deposit
                {{
                  Math.round(
                    ((rssDetails.tokenQuantity * depositPercentage) / 100) * 100
                  ) / 100
                }}
                {{ rssDetails.name.toUpperCase() }} </PrimaryButton
              ><br />
            </div>
          </div>
          <div class="flex justify-center items-end gap-2">
            <label
              for="toggleAutoDeposit"
              class="sm:hidden font-medium text-gray-800 text-sm"
              >Auto deposit {{ rssDetails.token }}</label
            >
            <MySwitch
              id="toggleAutoDeposit"
              class="mt-2"
              :label="'Auto deposit ' + rssDetails.token + ' tokens in game'"
              :checked="rssDetails.autoDeposit"
              @toggleSwitch="handleAutoDeposit(rssDetails.token)"
            />
          </div>
          <p class="mt-4">
            Total :
            {{ (rssDetails.quantity * rssDetails.price).toFixed(2) }} WAX (${{
              (rssDetails.quantity * rssDetails.priceInUsd).toFixed(2)
            }})
          </p>
          <a
            class="inline-block text-primary font-medium mt-4"
            :href="rssDetails.tradeUrl"
            target="_blank"
            >Trade on Alcor Exchange</a
          >
        </div>
        <div v-else-if="currentDetails.type === 'FC'">
          <h3
            v-if="rssDetails.name"
            class="text-lg sm:text-2xl font-medium underline"
          >
            {{ rssDetails.name.toUpperCase() }}
          </h3>
          <p>Quantity : {{ rssDetails.quantity }}</p>
          <p>
            Lowest Listing : {{ Math.round(rssDetails.price * 100) / 100 }} WAX
            (${{ rssDetails.priceInUsd }})
          </p>
          <p>
            Total :
            {{ (rssDetails.quantity * rssDetails.price).toFixed(2) }} WAX (${{
              (rssDetails.quantity * rssDetails.priceInUsd).toFixed(2)
            }})
          </p>
          <a
            class="text-primary font-medium"
            :href="rssDetails.buyUrl"
            target="_blank"
            >Buy</a
          >
          <span v-if="userFc"
            >or
            <a
              class="text-primary font-medium"
              :href="rssDetails.sellUrl"
              target="_blank"
              >Sell</a
            ></span
          >
          <span>on AtomicHub</span>
          <div
            v-if="userAccount === 'coagm.wam' || userAccount === 'spkvu.wam'"
            class="mt-4"
          >
            <span>Buy</span>
            <input
              v-model="nbAssetsAutoBuy"
              type="number"
              class="w-8 text-center bg-transparent border-b-2 border-primary"
              min="1"
              max="50"
            />
            <span
              >Lowest Listing{{ nbAssetsAutoBuy > 1 ? 's' : '' }} on AH</span
            >
            <button
              class="bg-primary text-white font-medium px-2 py-1 rounded-lg"
              @click="
                handleAutoBuyAssets(nbAssetsAutoBuy, rssDetails.templateId)
              "
            >
              GO
            </button>
          </div>
        </div>
        <div
          v-else-if="currentDetails.type === 'CROPS'"
          class="flex flex-col items-center"
        >
          <h3
            v-if="rssDetails.name"
            class="text-lg sm:text-2xl font-medium underline"
          >
            {{ rssDetails.name.toUpperCase() + ' SEEDS' }}
          </h3>
          <p>Quantity : {{ rssDetails.seedQuantity }}</p>
          <p>
            Lowest Listing :
            {{ Math.round(rssDetails.seedPrice * 100) / 100 }} WAX (${{
              rssDetails.seedPriceInUsd
            }})
          </p>
          <p>
            Total :
            {{ (rssDetails.seedQuantity * rssDetails.seedPrice).toFixed(2) }}
            WAX (${{
              (rssDetails.seedQuantity * rssDetails.seedPriceInUsd).toFixed(2)
            }})
          </p>
          <div>
            <a
              class="text-primary font-medium"
              :href="rssDetails.seedBuyUrl"
              target="_blank"
              >Buy</a
            >
            <span v-if="rssDetails.showSeedSellLink"
              >or
              <a
                class="text-primary font-medium"
                :href="rssDetails.seedSellUrl"
                target="_blank"
                >Sell</a
              ></span
            >
            <span>on AtomicHub</span>
          </div>
          <div
            v-if="userFarmPlots.length > 0"
            class="flex flex-col justify-center items-center mt-4"
          >
            <span
              >Remaining slots in your Farm Plot{{
                userFarmPlots.length > 1 ? 's' : ''
              }}
              : {{ remainingSlotsInFarmPlots }}</span
            >
            <div
              v-if="
                remainingSlotsInFarmPlots > 0 && rssDetails.seedQuantity > 0
              "
              class="mt-4 w-min"
            >
              <h4 class="text-lg font-medium">Planting some seeds</h4>
              <div class="flex justify-center items-center gap-2">
                <button
                  class="
                    text-xs
                    font-medium
                    bg-gray-600
                    text-white
                    hover:bg-secondary
                    rounded-lg
                    px-2
                    py-1
                  "
                  @click="nbSeedsToPlant = 1"
                >
                  MIN
                </button>
                <input
                  v-model="nbSeedsToPlant"
                  type="range"
                  min="1"
                  :max="
                    Math.min(remainingSlotsInFarmPlots, rssDetails.seedQuantity)
                  "
                  class="slider"
                />
                <button
                  class="
                    text-xs
                    font-medium
                    bg-gray-600
                    text-white
                    hover:bg-secondary
                    rounded-lg
                    px-2
                    py-1
                  "
                  @click="
                    nbSeedsToPlant = Math.min(
                      remainingSlotsInFarmPlots,
                      rssDetails.seedQuantity
                    )
                  "
                >
                  MAX
                </button>
              </div>
              <PrimaryButton
                class="mt-2 w-full"
                @click="
                  handlePlantingSeeds(nbSeedsToPlant, rssDetails.seedTemplateId)
                "
                >Plant {{ nbSeedsToPlant }} seed{{
                  nbSeedsToPlant > 1 ? 's' : ''
                }}</PrimaryButton
              >
            </div>
          </div>
          <h3
            v-if="rssDetails.name"
            class="text-lg sm:text-2xl font-medium underline mt-4 sm:mt-8"
          >
            {{ rssDetails.name.toUpperCase() }}S
          </h3>
          <p>Quantity : {{ rssDetails.quantity }}</p>
          <p>
            Lowest Listing : {{ Math.round(rssDetails.price * 100) / 100 }} WAX
            (${{ rssDetails.priceInUsd }})
          </p>
          <p>
            Total :
            {{ (rssDetails.quantity * rssDetails.price).toFixed(2) }} WAX (${{
              (rssDetails.quantity * rssDetails.priceInUsd).toFixed(2)
            }})
          </p>
          <div>
            <a
              class="text-primary font-medium"
              :href="rssDetails.buyUrl"
              target="_blank"
              >Buy</a
            >
            <span v-if="rssDetails.showSellLink"
              >or
              <a
                class="text-primary font-medium"
                :href="rssDetails.sellUrl"
                target="_blank"
                >Sell</a
              ></span
            >
            <span>on AtomicHub</span>
          </div>
          <div
            v-if="userAccount === 'coagm.wam' || userAccount === 'spkvu.wam'"
            class="mt-4"
          >
            <span>Buy</span>
            <input
              v-model="nbAssetsAutoBuy"
              type="number"
              class="w-8 text-center bg-transparent border-b-2 border-primary"
              min="1"
              max="50"
            />
            <span
              >Lowest Listing{{ nbAssetsAutoBuy > 1 ? 's' : '' }} on AH</span
            >
            <button
              class="bg-primary text-white font-medium px-2 py-1 rounded-lg"
              @click="
                handleAutoBuyAssets(nbAssetsAutoBuy, rssDetails.templateId)
              "
            >
              GO
            </button>
          </div>
          <div v-if="rssDetails.quantity" class="mt-4 w-min">
            <h4 class="text-lg font-medium">Exchange for rewards</h4>
            <div class="flex justify-center items-center gap-2">
              <button
                class="
                  text-xs
                  font-medium
                  bg-gray-600
                  text-white
                  hover:bg-secondary
                  rounded-lg
                  px-2
                  py-1
                "
                @click="nbAssetsToBurn = 1"
              >
                MIN
              </button>
              <input
                v-model="nbAssetsToBurn"
                type="range"
                min="1"
                :max="rssDetails.quantity"
                class="slider"
              />
              <button
                class="
                  text-xs
                  font-medium
                  bg-gray-600
                  text-white
                  hover:bg-secondary
                  rounded-lg
                  px-2
                  py-1
                "
                @click="nbAssetsToBurn = rssDetails.quantity"
              >
                MAX
              </button>
            </div>
            <PrimaryButton
              class="mt-2 w-full"
              @click="handleBurnAssets(nbAssetsToBurn, rssDetails.templateId)"
              >Burn {{ nbAssetsToBurn }} {{ rssDetails.name.toLowerCase()
              }}{{ nbAssetsToBurn > 1 ? 's' : '' }}</PrimaryButton
            >
          </div>
        </div>
        <div
          v-else-if="currentDetails.type === 'ANM_REWARDS'"
          class="flex flex-col items-center"
        >
          <h3
            v-if="rssDetails.name"
            class="text-lg sm:text-2xl font-medium underline"
          >
            {{ rssDetails.name.toUpperCase() }}
          </h3>
          <p>Quantity : {{ rssDetails.quantity }}</p>
          <p>
            Lowest Listing : {{ Math.round(rssDetails.price * 100) / 100 }} WAX
            (${{ rssDetails.priceInUsd }})
          </p>
          <p>
            Total :
            {{ (rssDetails.quantity * rssDetails.price).toFixed(2) }} WAX (${{
              (rssDetails.quantity * rssDetails.priceInUsd).toFixed(2)
            }})
          </p>
          <div>
            <a
              class="text-primary font-medium"
              :href="rssDetails.buyUrl"
              target="_blank"
              >Buy</a
            >
            <span v-if="rssDetails.showSellLink"
              >or
              <a
                class="text-primary font-medium"
                :href="rssDetails.sellUrl"
                target="_blank"
                >Sell</a
              ></span
            >
            <span>on AtomicHub</span>
          </div>
          <div v-if="rssDetails.quantity" class="mt-4 w-min">
            <h4 class="text-lg font-medium">Exchange for rewards</h4>
            <div class="flex justify-center items-center gap-2">
              <button
                class="
                  text-xs
                  font-medium
                  bg-gray-600
                  text-white
                  hover:bg-secondary
                  rounded-lg
                  px-2
                  py-1
                "
                @click="nbAssetsToBurn = 1"
              >
                MIN
              </button>
              <input
                v-model="nbAssetsToBurn"
                type="range"
                min="1"
                :max="rssDetails.quantity"
                class="slider"
              /><br />
              <button
                class="
                  text-xs
                  font-medium
                  bg-gray-600
                  text-white
                  hover:bg-secondary
                  rounded-lg
                  px-2
                  py-1
                "
                @click="nbAssetsToBurn = rssDetails.quantity"
              >
                MAX
              </button>
            </div>
            <PrimaryButton
              class="mt-2 w-full"
              @click="handleBurnAssets(nbAssetsToBurn, rssDetails.templateId)"
              >Burn {{ nbAssetsToBurn }} {{ rssDetails.name.toLowerCase()
              }}{{ nbAssetsToBurn > 1 ? 's' : '' }}</PrimaryButton
            >
          </div>
        </div>
        <div class="relative h-6">
          <Spinner v-if="loading" />
        </div>
      </div>
      <div class="mt-3 sm:mt-0 flex justify-between">
        <span v-if="withdrawalFee" class="text-xs font-medium"
          >Withdrawal fee: {{ withdrawalFee }}%</span
        >
        <span v-if="waxPrice" class="text-xs font-medium"
          >1 WAX ≈ {{ waxPrice.toFixed(5) }}$</span
        >
      </div>
    </div>

    <!-- Ressources -->
    <div>
      <div class="sm:hidden">
        <h2 class="text-lg text-gray-800 font-medium underline mt-2 sm:mt-0">
          Energy
        </h2>
        <div class="flex justify-center items-center mt-2">
          <img
            v-if="nrjToRecover > 0"
            class="h-8 w-8 mr-2 cursor-pointer"
            src="~assets/img/plus.png"
            alt="Plus"
            @click="recoverNrj"
          />
          <span class="text-gray-600 text-sm font-medium mr-2"
            >{{ userRessources.energy }} / {{ userRessources.max_energy }}</span
          >
          <img class="h-10 w-10" src="~assets/img/nrj.png" alt="Energy" />
        </div>
      </div>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2 sm:mt-0">
        Resources
      </h2>
      <dl class="grid grid-cols-2 grid-rows-2 mt-2">
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'PRIMARY', name: 'WOOD' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userWood }}
          </dt>
          <img
            class="order-1 w-12 h-12"
            src="~assets/img/wood.png"
            alt="Wood"
          />
        </div>
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'PRIMARY', name: 'FOOD' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userFood }}
          </dt>
          <img
            class="order-1 w-12 h-12"
            src="~assets/img/food.png"
            alt="Food"
          />
        </div>
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'PRIMARY', name: 'GOLD' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userGold }}
          </dt>
          <img
            class="order-1 w-12 h-12"
            src="~assets/img/gold.png"
            alt="Gold"
          />
        </div>
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'FC', name: 'FC' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userFc }}
          </dt>
          <img
            class="order-1 w-12 h-12"
            src="~assets/img/fc.png"
            alt="Farmers Coin"
          />
        </div>
      </dl>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2">
        Plants & Crops
      </h2>
      <dl class="grid grid-cols-2 mt-2">
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'CROPS', name: 'BARLEY' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userBarleys }}
            <span v-if="userBarleySeeds">(& {{ userBarleySeeds }} seeds)</span>
          </dt>
          <img
            class="order-1 w-12 h-auto"
            src="https://ipfs.atomichub.io/ipfs/QmZGDY4KYpK5aFqyhZJGkkZuVYsrzn2qxcQsDGihAgzcRW"
            alt="Barley"
            referrerpolicy="no-referrer"
          />
        </div>
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'CROPS', name: 'CORN' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userCorns }}
            <span v-if="userCornSeeds">(& {{ userCornSeeds }} seeds)</span>
          </dt>
          <img
            class="order-1 w-12 h-auto"
            src="https://ipfs.atomichub.io/ipfs/QmQkCitYXTisq7WugjeQ5gkinCPjZpc5uk1SHiPz4Z1eVZ"
            alt="Corn"
            referrerpolicy="no-referrer"
          />
        </div>
      </dl>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2">
        Animal Rewards
      </h2>
      <dl class="grid grid-cols-2 mt-2">
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'ANM_REWARDS', name: 'EGG' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userChickenEggs }}
          </dt>
          <img
            class="order-1 w-12 h-auto"
            src="https://ipfs.atomichub.io/ipfs/QmSLbe4KRWDS81eyXS7tP3MaF8yHDU5urYdyBspzcd3JMR"
            alt="Chicken Eggs"
            referrerpolicy="no-referrer"
          />
        </div>
        <div
          class="
            flex flex-col
            items-center
            p-2
            sm:p-4
            text-center
            cursor-pointer
            hover:bg-gray-200
            rounded-xl
          "
          @click="currentDetails = { type: 'ANM_REWARDS', name: 'MILK' }"
        >
          <dt
            class="order-2 sm:mt-2 text-sm leading-6 font-medium text-gray-600"
          >
            {{ userMilks }}
          </dt>
          <img
            class="order-1 w-12 h-auto"
            src="https://ipfs.atomichub.io/ipfs/QmYpVvcpEF2e8s6NY5QAjXmXjakZGZhZ53nJbgQWRfg1LT"
            alt="Milk"
            referrerpolicy="no-referrer"
          />
        </div>
      </dl>
      <h2 class="text-lg text-gray-800 font-medium underline mt-2">Options</h2>
      <div class="flex justify-between items-center mt-2">
        <label
          for="toggleAutoRecover"
          class="mr-2 text-gray-600 font-medium cursor-pointer"
          >Auto recover energy</label
        >
        <MySwitch
          id="toggleAutoRecover"
          label=""
          :checked="autoRecover"
          @toggleSwitch="handleAutoRecover"
        />
      </div>
      <hr class="mt-2" />
      <div class="flex justify-between items-center mt-2">
        <label
          for="toggleAutoRepair"
          class="mr-2 text-gray-600 font-medium cursor-pointer"
          >Auto repair tools</label
        >
        <MySwitch
          id="toggleAutoRepair"
          label=""
          :checked="autoRepairTools"
          @toggleSwitch="handleAutoRepairTools"
        />
      </div>
      <hr class="mt-2" />
      <div class="flex justify-between items-center mt-2">
        <label
          for="toggleAnimations"
          class="mr-2 text-gray-600 font-medium cursor-pointer"
          >Enable animations</label
        >
        <MySwitch
          id="toggleAnimations"
          label=""
          :checked="enableAnimations"
          @toggleSwitch="handleEnableAnimations"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CustomNotification from '~/components/CustomNotification.vue'

export default {
  data() {
    return {
      autoRecover: localStorage.getItem('autoRecover') === 'true',
      autoRepairTools: localStorage.getItem('autoRepair') === 'true',
      enableAnimations: localStorage.getItem('enableAnimations') === 'true',
      autoDepositWood: localStorage.getItem('autoDepositWood') === 'true',
      autoDepositFood: localStorage.getItem('autoDepositFood') === 'true',
      autoDepositGold: localStorage.getItem('autoDepositGold') === 'true',
      recovering: false,
      repairing: false,
      loading: false,
      marketPrices: [],
      atomicPrices: [],
      currentDetails: '',
      userTokens: [],
      withdrawPercentage: 0,
      depositPercentage: 0,
      nbSeedsToPlant: 1,
      nbAssetsToBurn: 1,
      nbAssetsAutoBuy: 1,
    }
  },
  computed: {
    wax() {
      return this.$store.state.wax
    },
    userAccount() {
      return this.$store.state.userAccount
    },
    userBalance() {
      return this.$store.state.userBalance
    },
    userBalanceInUsd() {
      return Math.round(this.userBalance * this.waxPrice * 100) / 100
    },
    userCpuPercentage() {
      return (
        (this.$store.state.userCpu.used / this.$store.state.userCpu.max) *
        100
      ).toFixed(0)
    },
    userRessources() {
      return this.$store.state.userRessources
    },
    withdrawalFee() {
      return this.$store.state.withdrawalFee
    },
    nrjToRecover() {
      return this.userRessources.max_energy - this.userRessources.energy
    },
    userTools() {
      return this.$store.state.userTools
    },
    sumToolsDurability() {
      let sum = 0
      this.userTools.forEach(
        (tool) => (sum += tool.durability - tool.current_durability)
      )

      return sum
    },
    userFc() {
      return this.$store.getters.userFc
    },
    userFood() {
      return parseInt(this.$store.getters.userFood)
    },
    userFWF() {
      return this.userTokens.length > 0
        ? parseFloat(
            this.userTokens
              .find((token) => token.balance.includes('FWF'))
              .balance.replace(/[^\d.-]/g, '')
          )
        : 0
    },
    userWood() {
      return parseInt(this.$store.getters.userWood)
    },
    userFWW() {
      return this.userTokens.length > 0
        ? parseFloat(
            this.userTokens
              .find((token) => token.balance.includes('FWW'))
              .balance.replace(/[^\d.-]/g, '')
          )
        : 0
    },
    userGold() {
      return parseInt(this.$store.getters.userGold)
    },
    userFWG() {
      return this.userTokens.length > 0
        ? parseFloat(
            this.userTokens
              .find((token) => token.balance.includes('FWG'))
              .balance.replace(/[^\d.-]/g, '')
          )
        : 0
    },
    userBarleys() {
      return this.$store.getters.userBarleys
    },
    userBarleySeeds() {
      return this.$store.getters.userBarleySeeds
    },
    userCorns() {
      return this.$store.getters.userCorns
    },
    userCornSeeds() {
      return this.$store.getters.userCornSeeds
    },
    userChickenEggs() {
      return this.$store.getters.userChickenEggs
    },
    userMilks() {
      return this.$store.getters.userMilks
    },
    userFarmPlots() {
      return this.$store.getters.userFarmPlots
    },
    remainingSlotsInFarmPlots() {
      let remainingSlots = 0

      this.userFarmPlots.forEach((fp) => {
        remainingSlots += fp.remaining_slots
      })

      return remainingSlots
    },
    rssDetails() {
      if (this.currentDetails.name === 'WOOD') {
        const currentToken = this.marketPrices.find(
          (pair) => pair.quote_token.symbol.name === 'FWW'
        )
        let currentPrice = 0
        if (currentToken) {
          currentPrice = Math.round(currentToken.last_price * 100) / 100
        }

        const tokenQuantityString = this.userTokens.find((token) =>
          token.balance.includes('FWW')
        ).balance
        const tokenQuantity = parseFloat(
          tokenQuantityString.replace(/[^\d.-]/g, '')
        )

        return {
          name: 'Wood',
          quantity: this.userWood,
          token: 'FWW',
          tokenQuantity,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          tradeUrl:
            'https://wax.alcor.exchange/trade/fww-farmerstoken_wax-eosio.token',
          autoDeposit: this.autoDepositWood,
        }
      } else if (this.currentDetails.name === 'FOOD') {
        const currentToken = this.marketPrices.find(
          (pair) => pair.quote_token.symbol.name === 'FWF'
        )
        let currentPrice = 0
        if (currentToken) {
          currentPrice = Math.round(currentToken.last_price * 100) / 100
        }

        const tokenQuantityString = this.userTokens.find((token) =>
          token.balance.includes('FWF')
        ).balance
        const tokenQuantity = parseFloat(
          tokenQuantityString.replace(/[^\d.-]/g, '')
        )

        return {
          name: 'Food',
          quantity: this.userFood,
          token: 'FWF',
          tokenQuantity,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          tradeUrl:
            'https://wax.alcor.exchange/trade/fwf-farmerstoken_wax-eosio.token',
          autoDeposit: this.autoDepositFood,
        }
      } else if (this.currentDetails.name === 'GOLD') {
        const currentToken = this.marketPrices.find(
          (pair) => pair.quote_token.symbol.name === 'FWG'
        )
        let currentPrice = 0
        if (currentToken) {
          currentPrice = Math.round(currentToken.last_price * 100) / 100
        }

        const tokenQuantityString = this.userTokens.find((token) =>
          token.balance.includes('FWG')
        ).balance
        const tokenQuantity = parseFloat(
          tokenQuantityString.replace(/[^\d.-]/g, '')
        )

        return {
          name: 'Gold',
          quantity: this.userGold,
          token: 'FWG',
          tokenQuantity,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          tradeUrl:
            'https://wax.alcor.exchange/trade/fwg-farmerstoken_wax-eosio.token',
          autoDeposit: this.autoDepositGold,
        }
      } else if (this.currentDetails.name === 'FC') {
        const fcTemplateId = '260676'
        const lowestPriceFc = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === fcTemplateId
        )
        let currentPrice = 0
        if (lowestPriceFc) {
          currentPrice =
            parseInt(lowestPriceFc.price.amount) /
            10 ** lowestPriceFc.price.token_precision
        }

        return {
          name: 'Farmer Coins',
          quantity: this.userFc,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          templateId: fcTemplateId,
          buyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${fcTemplateId}&order=asc&sort=price&symbol=WAX`,
          sellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${fcTemplateId}&sort=transferred`,
        }
      } else if (this.currentDetails.name === 'BARLEY') {
        const barleyTemplateId = '318606'
        const barleySeedTemplateId = '298595'
        const lowestPriceBarley = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === barleyTemplateId
        )
        const lowestPriceBarleySeed = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === barleySeedTemplateId
        )
        let currentPrice = 0
        let seedPrice = 0
        if (lowestPriceBarley) {
          currentPrice =
            parseInt(lowestPriceBarley.price.amount) /
            10 ** lowestPriceBarley.price.token_precision
        }
        if (lowestPriceBarleySeed) {
          seedPrice =
            parseInt(lowestPriceBarleySeed.price.amount) /
            10 ** lowestPriceBarleySeed.price.token_precision
        }

        return {
          name: 'Barley',
          quantity: this.userBarleys,
          seedQuantity: this.userBarleySeeds,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          seedPrice,
          seedPriceInUsd: Math.round(seedPrice * this.waxPrice * 100) / 100,
          buyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${barleyTemplateId}&order=asc&sort=price&symbol=WAX`,
          sellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${barleyTemplateId}&sort=transferred`,
          seedBuyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${barleySeedTemplateId}&order=asc&sort=price&symbol=WAX`,
          seedSellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${barleySeedTemplateId}&sort=transferred`,
          showSellLink: this.userBarleys > 0,
          showSeedSellLink: this.userBarleySeeds > 0,
          templateId: barleyTemplateId,
          seedTemplateId: barleySeedTemplateId,
        }
      } else if (this.currentDetails.name === 'CORN') {
        const cornTemplateId = '318607'
        const cornSeedTemplateId = '298596'
        const lowestPriceCorn = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === cornTemplateId
        )
        const lowestPriceCornSeed = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === cornSeedTemplateId
        )
        let currentPrice = 0
        let seedPrice = 0
        if (lowestPriceCorn) {
          currentPrice =
            parseInt(lowestPriceCorn.price.amount) /
            10 ** lowestPriceCorn.price.token_precision
        }
        if (lowestPriceCornSeed) {
          seedPrice =
            parseInt(lowestPriceCornSeed.price.amount) /
            10 ** lowestPriceCornSeed.price.token_precision
        }

        return {
          name: 'Corn',
          quantity: this.userCorns,
          seedQuantity: this.userCornSeeds,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          seedPrice,
          seedPriceInUsd: Math.round(seedPrice * this.waxPrice * 100) / 100,
          buyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${cornTemplateId}&order=asc&sort=price&symbol=WAX`,
          sellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${cornTemplateId}&sort=transferred`,
          seedBuyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${cornSeedTemplateId}&order=asc&sort=price&symbol=WAX`,
          seedSellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${cornSeedTemplateId}&sort=transferred`,
          showSellLink: this.userCorns > 0,
          showSeedSellLink: this.userCornSeeds > 0,
          templateId: cornTemplateId,
          seedTemplateId: cornSeedTemplateId,
        }
      } else if (this.currentDetails.name === 'EGG') {
        const eggTemplateId = '298612'
        const lowestPriceEgg = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === eggTemplateId
        )
        let currentPrice = 0
        if (lowestPriceEgg) {
          currentPrice =
            parseInt(lowestPriceEgg.price.amount) /
            10 ** lowestPriceEgg.price.token_precision
        }

        return {
          name: 'Chicken Egg',
          quantity: this.userChickenEggs,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          buyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${eggTemplateId}&order=asc&sort=price&symbol=WAX`,
          sellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${eggTemplateId}&sort=transferred`,
          showSellLink: this.userChickenEggs > 0,
          templateId: eggTemplateId,
        }
      } else if (this.currentDetails.name === 'MILK') {
        const milkTemplateId = '298593'
        const lowestPriceMilk = this.atomicPrices.data.find(
          (sale) => sale.assets[0].template.template_id === milkTemplateId
        )
        let currentPrice = 0
        if (lowestPriceMilk) {
          currentPrice =
            parseInt(lowestPriceMilk.price.amount) /
            10 ** lowestPriceMilk.price.token_precision
        }

        return {
          name: 'Milk',
          quantity: this.userMilks,
          price: currentPrice,
          priceInUsd: Math.round(currentPrice * this.waxPrice * 100) / 100,
          buyUrl: `https://wax.atomichub.io/market?collection_name=farmersworld&template_id=${milkTemplateId}&order=asc&sort=price&symbol=WAX`,
          sellUrl: `https://wax.atomichub.io/profile/${this.userAccount}?collection_name=farmersworld&order=desc&template_id=${milkTemplateId}&sort=transferred`,
          showSellLink: this.userMilks > 0,
          templateId: milkTemplateId,
        }
      }

      return {}
    },
    waxPrice() {
      return this.$store.state.waxPrice
    },
  },
  watch: {
    async nrjToRecover(newVal) {
      if (
        newVal / this.userRessources.max_energy >= 0.5 &&
        !this.recovering &&
        this.autoRecover
      ) {
        this.recovering = true
        await this.recoverNrj()
        this.recovering = false
      }
    },
    async userTools() {
      if (
        this.userTools.find(
          (tool) => tool.current_durability / tool.durability <= 0.5
        ) &&
        !this.repairing &&
        this.autoRepairTools
      ) {
        this.repairing = true
        await this.repairAllTools()
        this.repairing = false
      }
    },
    currentDetails() {
      this.withdrawPercentage = 0
      this.depositPercentage = 0
      this.nbSeedsToPlant = 1
      this.nbAssetsToBurn = 1
      this.nbAssetsAutoBuy = 1
    },
    userFWF(newVal) {
      if (this.autoDepositFood && newVal > 0) {
        this.handleDeposit('FWF', newVal)
      }
    },
    userFWW(newVal) {
      if (this.autoDepositWood && newVal > 0) {
        this.handleDeposit('FWW', newVal)
      }
    },
    userFWG(newVal) {
      if (this.autoDepositGold && newVal > 0) {
        this.handleDeposit('FWG', newVal)
      }
    },
  },
  mounted() {
    this.$store.dispatch('setAnimations', this.enableAnimations)
    this.getMarketPrices()
    this.getAtomicPrices()
    this.fetchUserTokens()
    this.$store.dispatch('getWaxPrice')
    this.$store.dispatch('getUserBalance')
    this.$store.dispatch('getUserRessources')
    this.$store.dispatch('getUserBuildings')
    setInterval(() => {
      this.getMarketPrices()
      this.getAtomicPrices()
      this.fetchUserTokens()
      this.$store.dispatch('getWaxPrice')
      this.$store.dispatch('getUserBalance')
      this.$store.dispatch('getUserRessources')
      this.$store.dispatch('getUserBuildings')
    }, 15000)
  },
  methods: {
    async recoverNrj() {
      const priceInFood = this.nrjToRecover / 5

      if (priceInFood > this.userFood) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Not enough food',
            message: `You need ${priceInFood} FOOD to recover your energy`,
          },
        })
      } else {
        try {
          await this.wax.api.transact(
            {
              actions: [
                {
                  account: 'farmersworld',
                  name: 'recover',
                  authorization: [
                    {
                      actor: this.wax.userAccount,
                      permission: 'active',
                    },
                  ],
                  data: {
                    owner: this.wax.userAccount,
                    energy_recovered: this.nrjToRecover,
                  },
                },
              ],
            },
            {
              blocksBehind: 3,
              expireSeconds: 30,
            }
          )
        } catch (e) {
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: 'Unexpected error',
              message: e.message,
            },
          })
          return null
        }

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Successfully recovered your energy',
            message: `Your energy have been recovered for a total cost of ${priceInFood} FOOD`,
          },
        })

        setTimeout(async () => {
          await this.$store.dispatch('getUserRessources')
        }, 1000)
      }
    },
    async repairAllTools() {
      const priceInGold = this.sumToolsDurability / 5

      if (priceInGold > this.userGold) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Not enough gold',
            message: `You need ${priceInGold} GOLD to repair all your tools`,
          },
        })
      } else {
        await Promise.all(
          this.userTools.map(async (tool) => {
            if (tool.durability - tool.current_durability > 0) {
              try {
                await this.wax.api.transact(
                  {
                    actions: [
                      {
                        account: 'farmersworld',
                        name: 'repair',
                        authorization: [
                          {
                            actor: this.wax.userAccount,
                            permission: 'active',
                          },
                        ],
                        data: {
                          asset_owner: this.wax.userAccount,
                          asset_id: tool.asset_id,
                        },
                      },
                    ],
                  },
                  {
                    blocksBehind: 3,
                    expireSeconds: 30,
                  }
                )
              } catch (e) {
                this.$toast.error({
                  component: CustomNotification,
                  props: {
                    title: 'Unexpected error',
                    message: e.message,
                  },
                })
              }
            }
          })
        )

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Successfully repaired your tools',
            message: `Your tools have all been repaired for a total cost of ${priceInGold} GOLD`,
          },
        })

        setTimeout(async () => {
          await this.$store.dispatch('getUserRessources')
          await this.$store.dispatch('getUserTools')
        }, 1000)
      }
    },

    handleAutoRecover() {
      this.autoRecover = !this.autoRecover
      localStorage.setItem('autoRecover', this.autoRecover)

      if (this.autoRecover) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Auto Recover enabled',
            message:
              'Your energy will be automatically recovered when it drops below 50%',
          },
        })
      }
    },
    handleAutoRepairTools() {
      this.autoRepairTools = !this.autoRepairTools
      localStorage.setItem('autoRepair', this.autoRepairTools)

      if (this.autoRepairTools) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Auto Repair enabled',
            message:
              'Your tools will be automatically repaired when their durability drops below 50%',
          },
        })
      }
    },
    handleAutoDeposit(token) {
      if (token === 'FWW') {
        this.autoDepositWood = !this.autoDepositWood
        localStorage.setItem('autoDepositWood', this.autoDepositWood)
        if (this.autoDepositWood && this.userFWW > 0) {
          this.handleDeposit('FWW', this.userFWW)
        }
      } else if (token === 'FWF') {
        this.autoDepositFood = !this.autoDepositFood
        localStorage.setItem('autoDepositFood', this.autoDepositFood)
        if (this.autoDepositFood && this.userFWF > 0) {
          this.handleDeposit('FWF', this.userFWF)
        }
      } else if (token === 'FWG') {
        this.autoDepositGold = !this.autoDepositGold
        localStorage.setItem('autoDepositGold', this.autoDepositGold)
        if (this.autoDepositGold && this.userFWG > 0) {
          this.handleDeposit('FWG', this.userFWG)
        }
      }
    },
    async handleWithdrawal(ressourceName, quantity) {
      if (quantity === 0) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: "Can't withdraw nothing",
            message: 'Please enter the amount to be withdrawn',
          },
        })

        return null
      }

      this.loading = true

      if (ressourceName === 'WOOD' && this.autoDepositWood) {
        this.autoDepositWood = false
        localStorage.setItem('autoDepositWood', this.autoDepositWood)
      } else if (ressourceName === 'FOOD' && this.autoDepositFood) {
        this.autoDepositFood = false
        localStorage.setItem('autoDepositFood', this.autoDepositFood)
      } else if (ressourceName === 'GOLD' && this.autoDepositGold) {
        this.autoDepositGold = false
        localStorage.setItem('autoDepositGold', this.autoDepositGold)
      }

      const quantityString = quantity.toFixed(4) + ' ' + ressourceName
      try {
        await this.wax.api.transact(
          {
            actions: [
              {
                account: 'farmersworld',
                name: 'withdraw',
                authorization: [
                  {
                    actor: this.wax.userAccount,
                    permission: 'active',
                  },
                ],
                data: {
                  fee: this.withdrawalFee,
                  owner: this.wax.userAccount,
                  quantities: [quantityString],
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        )

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Withdrawal Success',
            message: `You successfully withdrew ${(
              quantity *
              (1 - this.withdrawalFee / 100)
            ).toFixed(4)} ${ressourceName} in your wallet`,
          },
        })
      } catch (e) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Unexpected error',
            message: e.message,
          },
        })
      }

      this.loading = false

      setTimeout(async () => {
        await this.fetchUserTokens()
        await this.$store.dispatch('getUserRessources')
      }, 1500)
    },
    async handleDeposit(ressourceName, quantity) {
      if (quantity === 0) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: "Can't deposit nothing",
            message: 'Please enter the amount to be deposited',
          },
        })

        return null
      }

      this.loading = true

      const quantityString = quantity.toFixed(4) + ' ' + ressourceName
      try {
        await this.wax.api.transact(
          {
            actions: [
              {
                account: 'farmerstoken',
                name: 'transfers',
                authorization: [
                  {
                    actor: this.wax.userAccount,
                    permission: 'active',
                  },
                ],
                data: {
                  from: this.wax.userAccount,
                  memo: 'deposit',
                  quantities: [quantityString],
                  to: 'farmersworld',
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        )

        this.$toast.success({
          component: CustomNotification,
          props: {
            title: 'Deposit Success',
            message: `You successfully deposited ${quantityString} in game`,
          },
        })
      } catch (e) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Unexpected error',
            message: e.message,
          },
        })
      }

      this.loading = false

      setTimeout(async () => {
        await this.fetchUserTokens()
        await this.$store.dispatch('getUserRessources')
      }, 1500)
    },

    async handlePlantingSeeds(nbSeeds, seedTemplateId) {
      this.loading = true

      const userSeeds = (
        await this.$axios.$get(
          `https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=farmersworld&template_id=${seedTemplateId}&owner=${this.wax.userAccount}&limit=${nbSeeds}&order=desc&sort=asset_id`
        )
      ).data

      let nbSuccess = 0

      await Promise.all(
        userSeeds.map(async (seed) => {
          try {
            await this.wax.api.transact(
              {
                actions: [
                  {
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [
                      {
                        actor: this.wax.userAccount,
                        permission: 'active',
                      },
                    ],
                    data: {
                      asset_ids: [seed.asset_id],
                      from: this.wax.userAccount,
                      memo: 'stake',
                      to: 'farmersworld',
                    },
                  },
                ],
              },
              {
                blocksBehind: 3,
                expireSeconds: 30,
              }
            )

            nbSuccess += 1
          } catch (e) {
            this.$toast.error({
              component: CustomNotification,
              props: {
                title: 'Unexpected error',
                message: e.message,
              },
            })
          }
        })
      )

      if (nbSuccess > 0) {
        this.$toast.success(
          `Successfully planted ${nbSeeds} ${userSeeds[0].name}${
            nbSeeds > 1 ? 's' : ''
          }`
        )
      }

      this.loading = false

      setTimeout(async () => {
        await this.$store.dispatch('getUserRessources')
        await this.$store.dispatch('getUserCrops')
      }, 3000)
    },

    async handleBurnAssets(nbAssets, templateId) {
      this.loading = true

      const userAssets = (
        await this.$axios.$get(
          `https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=farmersworld&template_id=${templateId}&owner=${this.wax.userAccount}&limit=${nbAssets}&order=desc&sort=asset_id`
        )
      ).data

      let sumRewards = 0

      await Promise.all(
        userAssets.map(async (asset) => {
          try {
            const res = await this.wax.api.transact(
              {
                actions: [
                  {
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [
                      {
                        actor: this.wax.userAccount,
                        permission: 'active',
                      },
                    ],
                    data: {
                      asset_ids: [asset.asset_id],
                      from: this.wax.userAccount,
                      memo: 'burn',
                      to: 'farmersworld',
                    },
                  },
                ],
              },
              {
                blocksBehind: 3,
                expireSeconds: 30,
              }
            )

            const transactionId = res.transaction_id

            let nbRewards
            try {
              const result = await this.$axios.$get(
                `https://wax.eosphere.io/v2/history/get_transaction?id=${transactionId}`
              )
              nbRewards = result.actions.find((e) => e.act.name === 'logburnrs')
                .act.data.rewards[0]
            } catch {
              nbRewards = res.processed.action_traces
                .filter((e) => e.receiver === 'atomicassets')[0]
                .inline_traces.filter((e) => e.act.name === 'logburnrs')[0].act
                .data.rewards[0]
            }

            sumRewards += parseFloat(nbRewards.replace(/[^\d.-]/g, ''))
          } catch (e) {
            this.$toast.error({
              component: CustomNotification,
              props: {
                title: 'Unexpected error',
                message: e.message,
              },
            })
          }
        })
      )

      if (sumRewards > 0) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: `Successfully burned ${nbAssets} ${userAssets[0].name}${
              nbAssets > 1 ? 's' : ''
            }`,
            message: `You just obtained ${sumRewards.toFixed(2)} GOLD`,
          },
        })
      }

      this.loading = false

      setTimeout(async () => {
        await this.$store.dispatch('getUserRessources')
      }, 1500)
    },

    async handleAutoBuyAssets(nbAssets, templateId) {
      this.loading = true

      let sales
      try {
        sales = await this.$axios.$get(
          `https://wax.api.atomicassets.io/atomicmarket/v1/sales?state=1&max_assets=1&collection_name=farmersworld&template_id=${templateId}&limit=${nbAssets}&order=asc&sort=price`
        )
      } catch (e) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: 'Unexpected error',
            message: e.message,
          },
        })
        this.loading = false
        return null
      }

      sales = sales.data

      let nbBoughtAssets = 0
      let totalCost = 0
      let nbErrors = 0

      for (const sale of sales) {
        if (
          parseInt(sale.price.amount) >
          1.1 * parseInt(sales[0].price.amount)
        ) {
          this.$toast.error({
            component: CustomNotification,
            props: {
              title: `Price has exceeded the lowest listing price by 10%`,
              message: 'Please try again',
            },
          })
          break
        }

        const res = await this.buyAssetAH(sale)

        if (res) {
          nbBoughtAssets++
          totalCost += parseInt(sale.price.amount)
          this.$toast.success({
            component: CustomNotification,
            props: {
              title: `Successfully bought 1 ${sales[0].assets[0].name}`,
              message: `For a price of ${(
                parseInt(sale.price.amount) *
                10 ** -sale.price.token_precision
              ).toFixed(3)} WAX`,
            },
          })
        } else {
          nbErrors++
        }
      }

      const totalPriceWax =
        totalCost * 10 ** (sales[0].price.token_precision * -1)
      const totalPriceUsd = totalPriceWax * this.waxPrice
      const avgPriceWax = totalPriceWax / nbBoughtAssets
      const avgPriceUsd = avgPriceWax * this.waxPrice

      if (nbBoughtAssets > 0) {
        this.$toast.success({
          component: CustomNotification,
          props: {
            title: `Successfully bought ${nbBoughtAssets} ${
              sales[0].assets[0].name
            }${nbBoughtAssets > 1 ? 's' : ''} for ${totalPriceWax.toFixed(
              3
            )} WAX ($${totalPriceUsd.toFixed(2)})`,
            message: `For an average price of ${avgPriceWax.toFixed(
              3
            )} WAX ($${avgPriceUsd.toFixed(2)}) per item`,
          },
        })
      }

      if (nbErrors > 0) {
        this.$toast.error({
          component: CustomNotification,
          props: {
            title: `Problem with ${nbErrors} sales`,
            message: 'Please try again',
          },
        })
      }

      this.loading = false

      setTimeout(() => {
        this.$store.dispatch('getUserRessources')
        this.$store.dispatch('getUserBalance')
      }, 1500)
    },
    async buyAssetAH(sale) {
      const saleId = sale.sale_id
      const assetIdsToAssert = [sale.assets[0].asset_id]
      const tokenPrecision = sale.listing_symbol === 'USD' ? 2 : 8
      const listingPriceToAssertOne =
        (parseInt(sale.listing_price) * 10 ** -tokenPrecision).toFixed(
          tokenPrecision
        ) +
        ' ' +
        sale.listing_symbol
      const listingPriceToAssertTwo =
        (
          parseInt(sale.price.amount) *
          10 ** -sale.price.token_precision
        ).toFixed(sale.price.token_precision) +
        ' ' +
        sale.price.token_symbol
      const settlementSymbolToAssert = '8,WAX'
      let intendedDelphiMedian = 0

      if (sale.listing_symbol !== 'WAX') {
        const delphiMedian = await this.$axios.$post(
          'https://chain.wax.io/v1/chain/get_table_rows',
          {
            json: true,
            code: 'delphioracle',
            scope: 'waxpusd',
            table: 'datapoints',
            limit: '100',
          }
        )

        const delphiMedianTimestamps = delphiMedian.rows.map((delphi) =>
          Date.parse(delphi.timestamp)
        )
        const maxTimestamp = Math.max(...delphiMedianTimestamps)
        const newestDelphiMedian = delphiMedian.rows.find(
          (delphi) => Date.parse(delphi.timestamp) === maxTimestamp
        )

        intendedDelphiMedian = newestDelphiMedian.median
      }

      try {
        await this.wax.api.transact(
          {
            actions: [
              {
                account: 'atomicmarket',
                name: 'assertsale',
                authorization: [
                  {
                    actor: this.wax.userAccount,
                    permission: 'active',
                  },
                ],
                data: {
                  sale_id: saleId,
                  asset_ids_to_assert: assetIdsToAssert,
                  listing_price_to_assert: listingPriceToAssertOne,
                  settlement_symbol_to_assert: settlementSymbolToAssert,
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        )

        await this.wax.api.transact(
          {
            actions: [
              {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [
                  {
                    actor: this.wax.userAccount,
                    permission: 'active',
                  },
                ],
                data: {
                  from: this.wax.userAccount,
                  to: 'atomicmarket',
                  quantity: listingPriceToAssertTwo,
                  memo: 'deposit',
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        )

        await this.wax.api.transact(
          {
            actions: [
              {
                account: 'atomicmarket',
                name: 'purchasesale',
                authorization: [
                  {
                    actor: this.wax.userAccount,
                    permission: 'active',
                  },
                ],
                data: {
                  buyer: this.wax.userAccount,
                  sale_id: saleId,
                  intended_delphi_median: intendedDelphiMedian,
                  taker_marketplace: '',
                },
              },
            ],
          },
          {
            blocksBehind: 3,
            expireSeconds: 30,
          }
        )
        return true
      } catch (e) {
        return false
      }
    },

    handleEnableAnimations() {
      this.enableAnimations = !this.enableAnimations
      localStorage.setItem('enableAnimations', this.enableAnimations)
      this.$store.dispatch('setAnimations', this.enableAnimations)
    },

    async fetchUserTokens() {
      const userTokens = await this.$axios.$post(
        'https://chain.wax.io/v1/chain/get_table_rows',
        {
          json: true,
          code: 'farmerstoken',
          scope: this.wax.userAccount,
          table: 'accounts',
          limit: '100',
        }
      )

      this.userTokens = userTokens.rows
    },
    async getMarketPrices() {
      this.marketPrices = await this.$axios.$get(
        'https://wax.alcor.exchange/api/markets'
      )
    },
    async getAtomicPrices() {
      this.atomicPrices = await this.$axios.$get(
        'https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&collection_name=farmersworld&page=1&limit=100&order=desc&sort=price'
      )
    },
  },
}
</script>

<style scoped>
@media screen and (min-width: 640px) {
  .rssgrid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
  }
}

.rssdetail {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.loader {
  bottom: 0.75rem !important;
}
</style>
