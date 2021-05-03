<template>
  <div class="w-1/2">
    <Header />
    <div
      v-if="level === 'connected'"
      class="animate__animated animate__fadeOut animate__delay-1s"
    >
      <div>We're connected!</div>
      <div class="flex justify-center items-end my-8">
        <img src="@/assets/calendar.png" alt="" height="100" width="100" />
        <Tick
          width="50"
          height="50"
          class="animate__animated animate__bounce mb-3"
        />
        <img src="@/assets/icon.png" alt="" height="100" width="100" />
      </div>
      <div>Let's do this...</div>
    </div>
    <div v-else-if="level === 'purgeUsedEvents'">
      <div class="my-4 text-left">
        <span class="text-blueGray-400">Events</span>
        <div v-for="event in currentEvents" :key="event.id">
          <span class="text-blueGray-300 border-r border-blueGray-300 pr-1">{{
            formatAsCalendarTime(event)
          }}</span>
          {{ event.summary }}
          <span class="cursor-pointer" @click="tickEvent(event)">
            <Tick
              width="12"
              height="12"
              class="inline mb-1"
              :background="event.ticked ? '#32c671' : '#e3e3e3'"
            />
          </span>
        </div>
      </div>
      <div class="mb-4">
        Okay, so here are today's events. Could you check off the ones that <b>you can't move to a different time</b>?
      </div>
      <Button
        text="Continue"
        theme="primary"
        class="mb-4"
        @click="level = 'optimiseWarning'"
      />
    </div>
    <div v-else-if="level === 'addTodos'"></div>
    <div v-else-if="level === 'optimiseWarning'">
      <div class="mb-4">It's time for me to do some flow-optimising magic.</div>
      <div class="text-3xl mb-4">⚗️</div>
      <div class="mb-4">
        Just a reminder, what I'm about to do next is not reversible.
      </div>
      <div class="mb-4">
        I'm going to organise all your events to begin after one another in a row, and then I'll move them around to give you the most flow time (time that's uninterrupted). No events will be deleted.
      </div>
      <Button
        text="Optimise"
        theme="primary"
        class="mb-4"
        @click="level = 'optimise'"
      />
    </div>
    <div
      v-else-if="level === 'optimise'"
      class="animate__animated animate__fadeIn"
    >
      <div class="text-5xl mb-2 pt-4 motion-safe:animate-bounce">⚗️</div>
      <div>Optimising...</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { format, parseISO } from "date-fns";

export default {
  data() {
    return {
      level: "connected",
      currentEvents: [],
    };
  },
  mounted() {
    this.$store.dispatch("getAllTodayEvents");
    setTimeout(() => (this.level = "purgeUsedEvents"), 2000);
  },
  computed: {
    ...mapState(["events"]),
  },
  watch: {
    events() {
      this.currentEvents = [...this.events];
    },
    level() {
      if (this.level === "optimise") {
        this.optimise();
      }
    },
  },
  methods: {
    formatAsCalendarTime(event) {
      if (!event.start.dateTime) {
        return "All Day";
      }

      console.log(event.start.dateTime);

      return `${format(parseISO(event.start.dateTime), "kk:mm")} - ${format(
        parseISO(event.end.dateTime),
        "kk:mm"
      )}`;
    },
    tickEvent(changedEvent) {
      let index = this.currentEvents.findIndex(
        (event) => event.id === changedEvent.id
      );
      let newEvents = [...this.currentEvents];
      changedEvent.ticked = !changedEvent.ticked;
      newEvents[index] = changedEvent;
      this.currentEvents = newEvents;
    },
    optimise() {},
  },
};
</script>
