<template>
  <div>
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
        Okay, so here are your already scheduled events for today. Hover over
        and check off any you've already done.
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
        Just a reminder, what I'm about to do next is not reversible. I'm going
        to organise all your events to begin from now in a 'chain', one after
        the other, moving them around where I can to give you the most flow time
        (time that's uninterrupted).
      </div>
      <Button
        text="Continue"
        theme="primary"
        class="mb-4"
        @click="level = 'optimise'"
      />
    </div>
    <div v-else-if="level === 'optimise'">
      <div class="text-5xl">⚗️</div>
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
    this.$store.dispatch("getAllEvents");
    setTimeout(() => (this.level = "purgeUsedEvents"), 2000);
  },
  computed: {
    ...mapState(["events"]),
  },
  watch: {
    events() {
      this.currentEvents = [...this.events];
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
  },
};
</script>
