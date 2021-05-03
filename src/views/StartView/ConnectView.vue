<template>
  <div>
    <Header />
    <div class="mb-7">
      <span>To get started, </span>
      <span class="animate__animated animate__fadeIn animate__delay-1s"
        >we need to connect with your Google Calendar.</span
      >
    </div>
    <div
      v-if="error"
      v-html="error"
      class="text-red-600 p-4 bg-red-100 mb-8"
    ></div>
    <Button @click="connect" theme="bespoke" class="active:text-blueGray-800">
      <img src="@/assets/calendar.png" class="w-10 inline pb-1" />
      Connect to Google Calendar
    </Button>
  </div>
</template>

<script>
const browser = require("webextension-polyfill");

export default {
  name: "ConnectView",
  data() {
    return {
      error: "",
    };
  },
  methods: {
    async connect() {
      const access = await this.getAccessToken();
      console.log(access);

      if (!access) {
        this.error = "Failed to connect. Please try again.";
        return;
      }

      this.$store.dispatch("auth", access);
      this.$emit("view-change", "dayplanner");
    },

    validate(redirectURL) {
      // validate the access token
      console.log(redirectURL);

      let params = redirectURL.split("#")[1].split("&");

      let access = {};
      params.forEach((param) => {
        let [key, value] = param.split("=");
        access[key] = value;
      });

      console.log("ACCESS:");
      console.log(access);
      return access;
    },

    authorize() {
      if (!browser.identity) {
        this.error =
          'We don\'t have permission to use this browser\'s identity feature. Please grant permission. If this persists, <a href="https://github.com/rollersteaam/flow-optimised-calendar-auto-scheduler/issues" class="text-blue-600">file an issue here.</a>';
        return;
      }

      const redirectURL = browser.identity.getRedirectURL();
      console.log(`Got redirect url: ${redirectURL}`);

      const clientID =
        "699998725541-ei01vl1mc0g8jjjbo6oeeutl5fqp6ebi.apps.googleusercontent.com";
      const scopes = [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.events.readonly",
      ];

      let authURL = "https://accounts.google.com/o/oauth2/auth";
      authURL += `?client_id=${clientID}`;
      authURL += `&response_type=token`;
      authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
      authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

      return browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL,
      });
    },

    getAccessToken() {
      return this.authorize().then(this.validate);
    },
  },
};
</script>

<style></style>
