<template>
  <div class="house_doorbell"
  @click="helloThere()">
    <img :src="require('@/assets/doorbell.svg')" alt="doorbell">
  </div>
</template>

<script src="../Home.js" />

<style lang="scss">
@import 'Doorbell';
</style>
