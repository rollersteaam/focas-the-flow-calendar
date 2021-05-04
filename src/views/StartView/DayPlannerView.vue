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
    <div
      v-else-if="level === 'purgeUsedEvents'"
      class="animate__animated animate__fadeIn"
    >
      <div class="flex">
        <div class="my-4 text-left flex-none">
          <span class="text-blueGray-400">Calendars</span>
          <div
            v-for="calendar in calendars"
            :key="calendar.id"
            class="animate__animated animate__fadeInDown"
          >
            <span class="truncate">
              {{ calendar.name }}
            </span>
            <span class="text-blueGray-400">
              ({{ calendar.numberOfEvents }}
              events today)
            </span>
            <span class="cursor-pointer" @click="tickCalendar(calendar)">
              <Tick
                width="12"
                height="12"
                class="inline mb-1"
                :background="calendar.ticked ? '#32c671' : '#e3e3e3'"
              />
            </span>
          </div>
        </div>
        <div class="my-4 text-left flex-initial">
          <span class="text-blueGray-400">Events</span>
          <div
            v-for="event in currentEvents"
            :key="event.id"
            class="animate__animated animate__fadeInDown truncate"
          >
            <span class="text-blueGray-300 border-r border-blueGray-300 pr-1">{{
              formatAsCalendarTime(event)
            }}</span>
            <span class="truncate">
              {{ event.summary || "(busy)" }}
            </span>
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
      </div>
      <div class="mb-4">
        Okay, so here are today's events. Tick the calendars that you're
        following today.
      </div>
      <div class="mb-4">
        Could you also tick the events that
        <b>you can't move to a different time</b>?
      </div>
      <div class="mb-8 bg-blue-300 p-5 text-blueGray-50">
        I'll try to intelligently remember what you've ticked so you don't need
        to do this as much next time.
      </div>
      <Button
        text="I'm Done"
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
      <div class="mb-8">
        I'm going to organise all your events to begin after one another in a
        row, and then I'll move them around to give you the most flow time (time
        that's uninterrupted). No events will be deleted.
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
      filteredEvents: {},
      calendars: [],
      filteredCalendars: {},
    };
  },
  mounted() {
    setTimeout(() => (this.level = "purgeUsedEvents"), 2000);
    this.$store.dispatch("getAllTodayEvents");
  },
  computed: {
    ...mapState(["events"]),
  },
  watch: {
    events() {
      this.filteredCalendars = JSON.parse(
        localStorage.getItem("filteredCalendars") || "{}"
      );
      this.calendars = Object.values(this.events)
        .map((calendar) => {
          calendar.numberOfEvents = calendar.events.length;

          if (!(calendar.id in this.filteredCalendars)) {
            calendar.ticked = true;
          } else {
            calendar.ticked = false;
            this.$set(this.filteredCalendars, calendar.id, true);
          }

          return calendar;
        })
        .sort((a, b) => b.numberOfEvents - a.numberOfEvents);
      this.updateShownEvents();
    },
    level() {
      if (this.level === "optimise") {
        this.optimise();
      }
    },
  },
  methods: {
    updateShownEvents() {
      this.filteredEvents = JSON.parse(
        localStorage.getItem("filteredEvents") || "{}"
      );
      this.currentEvents = Object.values(this.events)
        .filter((calendar) => !(calendar.id in this.filteredCalendars))
        .map((calendar) => calendar.events)
        .flat()
        .sort((a, b) =>
          parseISO(a.start.dateTime) <= parseISO(b.start.dateTime) ? -1 : 1
        )
        .map((event) => {
          event.ticked = (event.summary || "(busy)") in this.filteredEvents;
          return event;
        });
    },
    formatAsCalendarTime(event) {
      if (!event.start.dateTime) {
        console.error(
          "This event is an all-day event. We do not support all-day events, please remove them from your input."
        );
        return "All Day";
      }

      return `${format(parseISO(event.start.dateTime), "kk:mm")} - ${format(
        parseISO(event.end.dateTime),
        "kk:mm"
      )}`;
    },
    tickEvent(changedEvent) {
      let index = this.currentEvents.findIndex(
        (event) => event.id === changedEvent.id
      );
      changedEvent.ticked = !changedEvent.ticked;
      this.$set(this.currentEvents, index, changedEvent);

      const eventName = changedEvent.summary || "(busy)";
      if (changedEvent.ticked) {
        this.filteredEvents[eventName] = true;
      } else {
        this.$delete(this.filteredEvents, eventName);
      }
      localStorage.setItem(
        "filteredEvents",
        JSON.stringify(this.filteredEvents)
      );
    },
    tickCalendar(changedCalendar) {
      if (changedCalendar.ticked) {
        this.$set(this.filteredCalendars, changedCalendar.id, true);
      } else {
        this.$delete(this.filteredCalendars, changedCalendar.id);
      }
      changedCalendar.ticked = !changedCalendar.ticked;
      this.updateShownEvents();
      localStorage.setItem(
        "filteredCalendars",
        JSON.stringify(this.filteredCalendars)
      );
    },
    optimise() {},
  },
};
</script>
