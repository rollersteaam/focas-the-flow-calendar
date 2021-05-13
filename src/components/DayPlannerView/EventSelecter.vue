<template>
  <div>
    <div class="flex">
      <div
        class="my-4 text-left flex-initial flex-shrink-0 bg-gray-50 rounded p-1 m-1"
      >
        <span class="text-blueGray-400">Calendars</span>
        <div
          v-for="calendar in calendars"
          :key="calendar.id"
          class="animate__animated animate__fadeInDown"
          :class="{
            'opacity-50': calendar.numberOfEvents === 0,
          }"
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
      <div class="my-4 text-left flex-initial bg-gray-50 rounded p-1 m-1 w-80">
        <div class="text-center">
          <Button
            theme="bespoke"
            class="my-2 inline-block mx-auto"
            @click="refresh"
          >
            <div v-if="refreshing"><Spinner /></div>
            <div v-else>Refresh</div>
          </Button>
        </div>
        <Calendar
          :events="currentEvents"
          :height="800"
          @event-click="tickEvent"
        />
      </div>
    </div>
    <div class="mb-4">
      Okay, so here are today's events. Tick the calendars that you're following
      today.
    </div>
    <div class="mb-4">
      Could you also tick the events that
      <b>you can't move to a different time</b>?
    </div>
    <div class="mb-8 bg-blue-400 p-5 text-blueGray-50">
      I'll try to intelligently remember what you've ticked so you don't need to
      do this as much next time.
    </div>
    <Button
      text="I'm Done"
      theme="primary"
      class="mb-4"
      @click="$emit('selected', currentEvents)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { format } from "date-fns";

export default {
  name: "EventSelecter",
  data() {
    return {
      currentEvents: [],
      filteredEvents: {},
      calendars: [],
      filteredCalendars: {},
      refreshing: false,
    };
  },
  computed: {
    ...mapState(["events"]),
  },
  mounted() {
    this.loadData();
  },
  watch: {
    events() {
      this.loadData();
    },
  },
  methods: {
    async refresh() {
      this.refreshing = true;
      await this.$store.dispatch("getAllTodayEvents");
      this.loadData();
      this.refreshing = false;
    },
    loadData() {
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
      console.log(this.calendars);
      this.updateShownEvents();
    },
    updateShownEvents() {
      this.filteredEvents = JSON.parse(
        localStorage.getItem("filteredEvents") || "{}"
      );
      const currentEventsKeyMap = {};
      this.currentEvents = Object.values(this.events)
        .filter((calendar) => !(calendar.id in this.filteredCalendars))
        .map((calendar) => {
          for (let event of calendar.events) {
            event.calendar = calendar.id;
          }
          return calendar;
        })
        .map((calendar) => calendar.events)
        .flat()
        .sort((a, b) => (a.start.dateTime <= b.start.dateTime ? -1 : 1))
        .map((event) => {
          event.ticked = (event.summary || "(busy)") in this.filteredEvents;
          return event;
        })
        .filter((event) => {
          if (event.id in currentEventsKeyMap) {
            return false;
          } else {
            currentEventsKeyMap[event.id] = true;
            return true;
          }
        });
    },
    formatAsCalendarTime(event) {
      if (!event.start.dateTime) {
        console.error(
          "This event is an all-day event. We do not support all-day events, please remove them from your input."
        );
        return "All Day";
      }

      return `${format(event.start.dateTime, "kk:mm")} - ${format(
        event.end.dateTime,
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
  },
};
</script>

<style></style>
