<template>
  <div class="container">
    <div class="interior_current">
      <div class="interior_back">
        <div class="interior_frame">
            <h1 class="interior_presentation"></h1>
        </div>
        <div class="interior_loader-container"
             @click="welcome()">
          <div class="interior_ball-message">
                        <p class="interior_ball-content">Click me!</p>
                    </div>
        <div class="interior_ball-container">
          <div class="interior_ball-gradient"></div>
          <div class="interior_ball">
            <div class="interior_ball-hole"></div>
            <div class="interior_ball-hole"></div>
            <div class="interior_ball-hole"></div>
          </div>
        </div>
        </div>
      </div>
      <div class="interior_left">
        <div class="interior_window"></div>
      </div>
      <div class="interior_right">
        <div class="interior_door"
             @click="goOutside()">
          <div class="interior_doorHandle"></div>
        </div>
      </div>
      <div class="interior_bottom">
        <img class="interior_bottom-rug" :src="require('@/assets/lebowskiRug.jpg')" alt="rug">
        <img class="interior_bottom-parquet" :src="require('@/assets/parquet.png')" alt="floor">
        <div class="interior_ball-shadow"></div>
      </div>
      <div class="interior_top">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import 'src/styles/main';
</style>

<script src="./Interiors.js"/>
