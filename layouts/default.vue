<template>
  <main class="relative min-h-screen w-screen">
    <Header />
    <Nuxt />
    <Footer />
  </main>
</template>

<style scoped>
  main {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
</style>

<style>
  main {
    background-image: radial-gradient(circle at top center, rgb(235, 235, 235) 0%, rgb(235, 235, 235) 10%,rgb(229, 229, 229) 10%, rgb(229, 229, 229) 19%,rgb(222, 222, 222) 19%, rgb(222, 222, 222) 22%,rgb(216, 216, 216) 22%, rgb(216, 216, 216) 24%,rgb(209, 209, 209) 24%, rgb(209, 209, 209) 63%,rgb(203, 203, 203) 63%, rgb(203, 203, 203) 75%,rgb(196, 196, 196) 75%, rgb(196, 196, 196) 100%);
  }

  ::-webkit-scrollbar {
    height: 0px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(75, 85, 99);
  }

  ::-webkit-scrollbar-thumb {
    background: #98CA2D;
  }
</style>