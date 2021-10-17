<template>
  <div class="flex flex-col max-w-7xl px-4 pb-4 mx-auto h-full gap-4">
    <WithdrawalAlert />
    <RessourcesCard class="block md:hidden"/>
    <div class="flex flex-col md:flex-row gap-4">
      <ToolsCard />
      <MembershipsCard />
    </div>
    <div v-if="true" class="flex flex-col md:flex-row gap-4">
      <PlantsCard />
      <AnimalsCard />
    </div>
  </div>
</template>