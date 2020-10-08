<template>
  <div class="outside">
    <div class="title">
      <h1><span>MATTEO ENA</span>
        <span>WEB DEVELOPMENT</span></h1>
    </div>
    <div class="modal">
      <div class="contact hidden">
        <div class="contact_card">
          <form name="contact" netlify>
            <div class="contact_leftbox">
              <textarea class="contact_leftbox-textarea" name="message" COLS="35" ROWS="25" placeholder="Your message"
                        required></textarea>
            </div>
            <div class="contact_rightbox">
              <div class="contact_rightbox-send">
                <input class="sendbutton" type="submit" value="Send">
              </div>
              <div class="contact_rightbox-line">
                <div id="input">
                  <input type="text" name="name" placeholder="Name" required>
                  <input type="email" name="email" placeholder="E-mail" required>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
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
          <div class="bubble bubble-bottom-left hidden" contenteditable>{{ message }}</div>
          <div class="house_doorbell"
               @click="helloThere()">
            <img :src="require('@/assets/doorbell.svg')" alt="doorbell">
          </div>
        </div>
      </div>
    </div>
    <div id="garden">
      <div id="mailbox"
           @click="showModal()">
        <img :src="require('@/assets/mailbox.svg')" alt="mail">
      </div>
    </div>
    <div id="sun"></div>
    <div class="plane">
      <img :src="require('@/assets/plane.svg')" alt="plane">
    </div>
  </div>
</template>

<script src="./Home.js"/>

<style lang="scss">
@import 'src/styles/main';
</style>
