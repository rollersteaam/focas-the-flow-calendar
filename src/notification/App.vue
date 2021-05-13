<template>
  <div id="app" class="bg-blue-500">
    <div class="h-screen w-screen flex flex-col items-center justify-center">
      <div
        class="text-xl text-warmGray-50 mb-4 max-w-prose"
        :class="{
          'animate__animated animate__fadeOutUp': closing,
        }"
      >
        {{ phrase }}
      </div>
      <div
        class="text-4xl text-warmGray-50 my-4"
        :class="{
          'animate__animated animate__fadeOutUp': closing,
        }"
      >
        {{ event.summary || "(busy)" }}
      </div>
      <div
        class="text-xl text-warmGray-50 mt-4"
        :class="{
          'animate__animated animate__fadeOutUp': closing,
        }"
      >
        {{ timeRangeString }}
      </div>
      <div class="flex mt-8 pl-12">
        <div
          class="mr-4 p-4 text-warmGray-50 flex flex-col justify-center items-center"
          :class="{
            'animate__animated animate__fadeOutUp animate__fast': closing,
          }"
        >
          <div
            class="rounded-full border-4 bg-transparent cursor-pointer p-4 hover:opacity-75 active:opacity-100 mb-4 w-min"
            @click="close"
          >
            <CleanTick width="36" />
          </div>
          On It Now
        </div>
        <div
          class="mr-4 p-4 text-warmGray-50 flex flex-col justify-center items-center"
          :class="{
            'animate__animated animate__fadeOutUp animate__fast': closing,
          }"
        >
          <div
            class="rounded-full border-4 bg-transparent cursor-pointer p-4 hover:opacity-50 active:opacity-100 mb-4 w-min"
            @click="offTrack"
          >
            <PencilRuler width="36" />
          </div>
          My Day's Off Track
        </div>
      </div>

      <div
        class="mr-4 p-4 text-warmGray-50 flex flex-col justify-center items-center"
        :class="{
          'animate__animated animate__fadeOutUp animate__fast': closing,
        }"
      >
        <div
          class="rounded-full border-4 bg-transparent cursor-pointer p-4 hover:opacity-75 active:opacity-100 mb-4 w-min"
          @click="stopForToday"
        >
          <Cross height="36" width="36" />
        </div>
        Stop for Today
      </div>

      <audio
        src="sounds/254822__thoribass__ringtone2-freesound.wav"
        autoplay
        loop
      />
    </div>
  </div>
</template>

<script>
import "animate.css";
import browser from "webextension-polyfill";
import { format } from "date-fns";

export default {
  name: "App",
  data() {
    return {
      event: {},
      closing: false,
      phrase: "",
    };
  },
  created() {
    browser.runtime.onMessage.addListener((data) => {
      if (data.type === "notification") {
        this.event = data.data;
      }
    });
    this.phrase = this.generateHeader();
  },
  computed: {
    timeRangeString() {
      let timeRange = format(
        this.event.start ? this.event.start.dateTime : new Date(),
        "p"
      );
      if (this.event.end && this.event.end.dateTime) {
        timeRange = `${timeRange} - ${format(this.event.end.dateTime, "p")}`;
      }
      return timeRange;
    },
  },
  methods: {
    close() {
      this.closing = true;
      setTimeout(() => window.close(), 1000);
    },
    generateHeader() {
      const phrases = [
        "Time to crack your next event today!",
        "Some more bread for us to get. Let's do this.",
        "You're doing well so far, keep going!",
        "I can't remember if I've said this today, but you look beautiful.",
        "Building rockets required that people walked simple steps before they could fly. So keep walking until you're annoyed enough to start running!",
        "I can feel it, you're on to something...",
        "I'm jealous at how good you're doing.",
        "Perhaps time for a coffee break? You decide, I just say random things every time a notification goes off.",
        "Thanks for using Flowcas, it means a lot that you're benefiting from something I made.",
      ];
      const randInt = Math.floor(Math.random() * phrases.length);
      return phrases[randInt];
    },
    offTrack() {
      let tab = browser.tabs.create({ url: "/standalone.html" });
      browser.windows.update(tab.windowId, {
        focused: true,
      });
      this.close();
    },
    stopForToday() {
      browser.runtime.sendMessage({
        type: "stopNotifications",
      });
      this.close();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap");

#app {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
