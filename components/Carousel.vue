<template>
  <!-- eslint-disable-next-line vue/attribute-hyphenation -->
  <carousel-3d :width="180" height="310" :autoplay="true" :autoplayTimeout="5000" :controls-visible="true" :display="numberOfSlides"> 
    <!-- :controls-visible="true" -->
    <slide v-for="(slide, i) in slides" :key="i" :index="i">
      <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
        <div v-if="slide.current_durability >= 0" class="absolute w-full top-5 font-medium text-gray-600 text-center cursor-pointer">
          {{ slide.current_durability }}/{{ slide.durability }}
        </div>
        <div v-if="slide.current_durability < slide.durability && isCurrent" class="absolute top-12 w-full text-center cursor-pointer">
          <button ref="repairButton"
            class="hidden whitespace-nowrap items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-secondary">
            REPAIR
          </button>
        </div>
        <div v-if="slide.times_claimed >= 0" class="absolute w-full top-5 font-medium text-gray-600 text-center cursor-pointer">
          {{ slide.times_claimed }}/{{ slide.required_claims }}
        </div>
        <img :data-index="index" :class="[{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0)}, 'cursor-pointer']" :src="slide.img_url" @mouseover="displayRepair"  @mouseout="hideRepair">
        <Counter v-show="isCurrent" :timestamp="slide.next_availability" :autoclaim="autoclaim" @claimed="handleClaim(slide.asset_id)"/>
      </template>
    </slide>
  </carousel-3d>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'

export default {
  components: {
    Carousel3d,
    Slide
  },
  props: {
    slides: {
      type: Array,
      required: true
    },
    autoclaim: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    numberOfSlides() {
      return (this.windowWidth >= 1050 || (this.windowWidth < 768 && this.windowWidth > 550)) ? 5 : 3
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },
  methods: {
    handleClaim(assetId) {
      this.$emit('claimAsset', assetId, 1)
    },
    displayRepair(e) {
      if (this.$refs.repairButton) {
        if (e.target.classList.contains('current')) {
          this.$refs.repairButton[0].classList.replace('hidden', 'inline-flex');
        }
      }
    },
    hideRepair(e) {
      if (this.$refs.repairButton) {
        if (e.target.classList.contains('current')) {
          const targetRect = e.target.getBoundingClientRect()
          
          if (!(e.x >= targetRect.x && e.x <= targetRect.x + targetRect.width && e.y >= targetRect.y && e.y <= targetRect.y + targetRect.height)) {
            this.$refs.repairButton[0].classList.replace('inline-flex', 'hidden');
          }
        }
      }
    }
  }
}
</script>

<style>
  .carousel-3d-slide {
    border: none;
    background: transparent;
  }

  .next,
  .prev {
    color: rgb(75, 85, 99)!important;
  }

  .next:hover,
  .prev:hover {
    color: #98CA2D!important;
  }
</style>