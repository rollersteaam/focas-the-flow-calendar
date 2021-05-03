<template>
  <div>
    <div class="mb-5 flex justify-center items-center">
      <img src="@/assets/icon.png" alt="" class="inline w-20" />
      <span class="text-4xl text-blue-600 mt-2">Flowcas</span>
    </div>
    <div
      v-if="tabOpened"
      class="text-lg text-blueGray-700 bg-blue-200 px-10 py-5 rounded mb-5 animate__animated animate__fadeIn"
    >
      I've opened a new tab so we can continue.
    </div>
    <div
      v-else
      class="text-lg text-blueGray-700 bg-blueGray-200 px-10 py-5 rounded mb-5"
    >
      Ready to hit "launch" on your day?
    </div>
    <Button
      text="Launch"
      theme="primary"
      @click="launchPlanner"
      :class="buttonClass"
    />
  </div>
</template>

<script>
import browser from "webextension-polyfill";

export default {
  name: "LaunchStartView",
  data() {
    return {
      tabOpened: false,
      buttonClass: "inline-block",
    };
  },
  methods: {
    launchPlanner() {
      browser.tabs.create({ url: "/standalone.html" });
      this.tabOpened = true;
      this.buttonClass = "inline-block animate__animated animate__fadeOutUp";
    },
  },
};
</script>

<style></style>
