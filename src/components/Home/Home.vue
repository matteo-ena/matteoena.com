<template>
  <div class="container">
    <div class="title">
      <h1><span>MATTEO ENA</span>
        <span>WEB DEVELOPMENT</span></h1>
    </div>
    <div class="house">
      <div class="house_roof"></div>
      <div class="house_main">
        <div class="house_window left"></div>
        <div class="house_window right">
        </div>
        <div class="house_entrance">
          <div class="house_window central"></div>
          <div class="house_backdoor">
            <div class="house_dude">
            <img :src="require('@/assets/dude.png')" alt="dude">
            </div>
          <div class="house_door">
            <div class="house_doorHandle"></div>
          </div>
          </div>
          <div class="bubble bubble-bottom-left hidden" contenteditable></div>
          <Doorbell />
        </div>
      </div>
    </div>
    <div id="garden">
      <Mailbox />
    </div>
    <div id="sun"></div>
    <Plane />
  </div>
</template>

<style lang="scss">
@import 'Home.scss';
</style>

<script>
import Doorbell from './Doorbell/Doorbell.vue';
import Mailbox from './Mailbox/Mailbox.vue';
import Plane from './Plane/Plane.vue';
import './Home.js';

export default {
  name: 'App',
  components: {
    Doorbell,
    Mailbox,
    Plane
  }
}
</script>
