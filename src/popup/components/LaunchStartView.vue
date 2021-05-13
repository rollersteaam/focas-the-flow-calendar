<template>
  <div>
    <div class="mb-5 flex justify-center items-center">
      <img src="@/assets/icon.png" alt="" class="inline w-20" />
      <span class="text-4xl text-blue-600 mt-2">Flowcas</span>
    </div>
    <div class="mx-auto w-1/2">
      <Calendar
        v-if="events.length > 0"
        :events="events"
        :height="800"
      />
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
import { parseISO } from "date-fns";

export default {
  name: "LaunchStartView",
  data() {
    return {
      tabOpened: false,
      buttonClass: "inline-block",
      events: [],
    };
  },
  mounted() {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    for (let event of events) {
      event.start.dateTime = parseISO(event.start.dateTime);
      event.end.dateTime = parseISO(event.end.dateTime);
    }
    this.events = events;
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
