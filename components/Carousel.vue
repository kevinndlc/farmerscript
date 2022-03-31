<template>
  <carousel-3d
    :key="enableAnimations && slides.length"
    :width="180"
    height="310"
    :autoplay="enableAnimations"
    :autoplayTimeout="5000"
    :controls-visible="true"
    :display="numberOfSlides"
  >
    <slide v-for="(slide, i) in slides" :key="i" :index="i">
      <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
        <div
          v-if="slide.current_durability >= 0"
          class="
            absolute
            w-full
            top-4
            font-medium
            text-gray-600 text-center
            cursor-pointer
          "
        >
          {{ slide.current_durability }}/{{ slide.durability }}
        </div>
        <div
          v-if="slide.times_claimed >= 0"
          class="
            absolute
            w-full
            top-4
            font-medium
            text-gray-600 text-center
            cursor-pointer
          "
        >
          {{ slide.times_claimed }}/{{ slide.required_claims }}
        </div>
        <img
          :data-index="index"
          :class="[
            {
              current: isCurrent,
              onLeft: leftIndex >= 0,
              onRight: rightIndex >= 0,
            },
            'cursor-pointer',
          ]"
          :src="slide.img_url"
          referrerpolicy="no-referrer"
        />
        <div class="relative">
          <span
            v-if="slide.isTool"
            v-show="isCurrent"
            class="
              whitespace-nowrap
              text-xs
              font-medium
              text-gray-500
              absolute
              -top-2
              left-1/2
              transform
              -translate-x-1/2
            "
            >Stored Mining: {{ displayCurrentSavedClaims(slide) }}</span
          >
          <Counter
            v-show="isCurrent"
            :timestamp="slide.next_availability"
            :addedTimestamp="addSavedClaims(slide)"
            :autoclaim="autoclaim"
            @claimed="handleClaim(slide)"
          />
        </div>
      </template>
    </slide>
  </carousel-3d>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'

export default {
  components: {
    Carousel3d,
    Slide,
  },
  props: {
    slides: {
      type: Array,
      required: true,
    },
    autoclaim: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    numberOfSlides() {
      return this.windowWidth >= 1050 ||
        (this.windowWidth < 768 && this.windowWidth > 550)
        ? 5
        : 3
    },
    enableAnimations() {
      return this.$store.state.animations
    },
    woodSavedClaims() {
      return this.$store.getters.woodSavedClaims
    },
    foodSavedClaims() {
      return this.$store.getters.foodSavedClaims
    },
    goldSavedClaims() {
      return this.$store.getters.goldSavedClaims
    },
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },
  methods: {
    handleClaim(asset) {
      this.$emit('claimAsset', asset, 1)
    },

    getSavedClaims(item) {
      if (item.isTool) {
        if (item.type === 'Wood') return this.woodSavedClaims
        if (item.type === 'Food') return this.foodSavedClaims
        if (item.type === 'Gold') return this.goldSavedClaims
        return 0
      } else {
        return 0
      }
    },

    getStoredClaims(item) {
      return item.stored_claims
    },

    addSavedClaims(item) {
      if (item.isTool) {
        return this.getSavedClaims(item) * item.charged_time
      } else {
        return 0
      }
    },

    displayCurrentSavedClaims(item) {
      return `${this.getStoredClaims(item)} / ${this.getSavedClaims(item) + 1}`
    },
  },
}
</script>

<style>
.carousel-3d-slide {
  border: none;
  background: transparent;
}

.next,
.prev {
  color: rgb(75, 85, 99) !important;
}

.next:hover,
.prev:hover {
  color: #98ca2d !important;
}
</style>
