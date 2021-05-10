<template>
  <div class="flex mt-4">
    <div class="flex-none">
      <div
        class="text-gray-300 relative"
        v-for="i in 24"
        :key="i"
        :style="calculateTimeBarStyle()"
      >
        <div class="-top-3 relative">
          {{ getTimeBarLabel(i) }}
        </div>
      </div>
    </div>
    <div class="flex-1 relative">
      <div
        class="border-t border-gray-200"
        v-for="i in 24"
        :key="i"
        :style="calculateTimeBarGridStyle()"
      ></div>
      <div
        v-for="event in events"
        :key="event.id"
        class="text-blue-50 absolute"
        :style="calculateEventStyle(event)"
      >
        <div class="bg-blue-500 rounded h-full border text-xs">
          <div>
            {{ event.summary || "(busy)" }}
          </div>
          <div>
            {{ formatAsCalendarTime(event) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, startOfDay, setHours } from "date-fns";

export default {
  props: {
    events: Array,
    height: Number,
  },
  computed: {
    overlappingEvents() {
      const overlappingEvents = {};
      const blocks = [];

      for (let event of this.events) {
        let found = false;

        for (let block of blocks) {
          const blockInEvent =
            block.start >= event.start.dateTime &&
            block.end <= event.end.dateTime;
          const eventInBlock =
            block.start <= event.start.dateTime &&
            block.end >= event.end.dateTime;

          if (blockInEvent || eventInBlock) {
            block.start =
              block.start < event.start.dateTime
                ? block.start
                : event.start.dateTime;
            block.end =
              block.end > event.end.dateTime ? block.end : event.end.dateTime;
            overlappingEvents[event.id] = block.events.length;
            block.events.push(event);
            found = true;
            break;
          }
        }

        if (!found) {
          blocks.push({
            start: event.start.dateTime,
            end: event.end.dateTime,
            events: [event],
          });
        }
      }

      return overlappingEvents;
    },
  },
  methods: {
    getTimeBarLabel(hour) {
      return format(setHours(new Date(), hour - 1), "HH:00");
    },
    calculateTimeBarStyle() {
      const hourPixels = this.height / 24;
      return {
        height: `${hourPixels}px`,
      };
    },
    calculateTimeBarGridStyle() {
      const hourPixels = this.height / 24;
      return {
        height: `${hourPixels}px`,
      };
    },
    calculateEventStyle(event) {
      const hourPixels = this.height / 24;
      const eventStart = event.start.dateTime;
      const hours = (event.end.dateTime - eventStart) / 1000 / 60 / 60;
      const hoursFromDayStart =
        (eventStart - startOfDay(new Date())) / 1000 / 60 / 60;
      const marginLeft = `${(this.overlappingEvents[event.id] || 0) * 60}px`;
      return {
        height: `${hours * hourPixels}px`,
        top: `${hoursFromDayStart * hourPixels}px`,
        marginLeft,
        width: `calc(100% - ${marginLeft})`,
      };
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
  },
};
</script>

<style></style>
