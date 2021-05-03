<template>
  <div class="p-5 pb-8 popup">
    <component :is="views[currentView]" @view-change="changeView" />
  </div>
</template>

<script>
import ConnectView from "@/views/StartView/ConnectView";
import DayPlannerView from "@/views/StartView/DayPlannerView";

export default {
  name: "StartView",
  data() {
    return {
      views: {
        connect: ConnectView,
        dayplanner: DayPlannerView,
      },
      currentView: "connect",
    };
  },
  methods: {
    changeView(view) {
      this.currentView = view;
    },
  },
};
</script>

<style></style>
