<template>
  <carousel-3d :key="enableAnimations && slides.length" :width="180" height="310" :autoplay="enableAnimations" :autoplayTimeout="5000" :controls-visible="true" :display="numberOfSlides"> 
    <slide v-for="(slide, i) in slides" :key="i" :index="i">
      <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
        <div v-if="slide.current_durability >= 0" class="absolute w-full top-4 font-medium text-gray-600 text-center cursor-pointer">
          {{ slide.current_durability }}/{{ slide.durability }}
        </div>
        <div v-if="slide.times_claimed >= 0" class="absolute w-full top-4 font-medium text-gray-600 text-center cursor-pointer">
          {{ slide.times_claimed }}/{{ slide.required_claims }}
        </div>
        <img :data-index="index" :class="[{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0)}, 'cursor-pointer']" :src="slide.img_url" referrerpolicy="no-referrer">
        <Counter v-show="isCurrent" :timestamp="slide.next_availability" :autoclaim="autoclaim" :waitingSeconds="i" @claimed="handleClaim(slide)"/>
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
    },
    enableAnimations() {
      return this.$store.state.animations
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth
    })
  },
  methods: {
    handleClaim(asset) {
      this.$emit('claimAsset', asset, 1)
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