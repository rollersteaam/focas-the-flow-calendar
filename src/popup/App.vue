<template>
  <div id="app" class="p-5 pb-8 popup">
    <LaunchStartView />
  </div>
</template>

<script>
import "animate.css";

import LaunchStartView from "./components/LaunchStartView";

export default {
  name: "App",
  components: {
    LaunchStartView,
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
  overflow: hidden;
}

.popup {
  width: 640px;
  max-height: 480px;
}
</style>
