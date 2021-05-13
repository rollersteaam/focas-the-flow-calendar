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
      v-else-if="level === 'filtering'"
      class="animate__animated animate__fadeIn"
    >
      <EventSelecter @selected="completeEventSelection" />
    </div>
    <div
      v-else-if="level === 'focus'"
      class="animate__animated animate__fadeIn"
    >
      <p class="text-blueGray-0 mb-4">
        So what is the <b>one</b> thing you want to focus all your effort on
        today?
      </p>
      <div>
        <input
          type="text"
          v-model="focus"
          class="mb-8 p-3 bg-blueGray-200 rounded focus:ring-4 focus:outline-none"
        />
      </div>
      <Button
        text="I'm Done"
        theme="primary"
        @click="level = 'optimiseWarning'"
      />
    </div>
    <div v-else-if="level === 'addTodos'"></div>
    <div v-else-if="level === 'optimiseWarning'" class="max-w-prose">
      <div class="mb-4">It's time for me to do some flow-optimising magic.</div>
      <div class="text-3xl mb-4">⚗️</div>
      <div class="mb-4">
        Just a reminder, what I'm about to do next is <b>irreversible</b>,
        although you will be able to preview the changes before I make them.
      </div>
      <div class="mb-8">
        All of your events will begin one after the other in a row, and then
        I'll move them around to give you the most flow time (time that's
        uninterrupted). No events will be deleted.
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
      <template v-if="!error">
        <div class="text-5xl mb-2 pt-4 motion-safe:animate-bounce">⚗️</div>
        <div>Optimising...</div>
      </template>
      <template v-else>
        <div class="p-5 bg-yellow-500 text-white" v-html="error"></div>
      </template>
    </div>
    <div
      v-else-if="level === 'complete'"
      class="animate__animated animate__fadeIn max-w-prose"
    >
      <template v-if="highestFlowMinutes < 120 || unfindables.length > 0">
        <p class="mb-6">
          <span class="text-blue-500">Complete!</span> ...However, your schedule
          today has some issues, I couldn't make the best result.
        </p>

        <div v-if="highestFlowMinutes < 120" class="mb-6">
          <span class="text-blue-500">
            I couldn't find at least 2 hours of uninterrupted time in your
            calendar. 😢
          </span>
        </div>

        <div v-if="unfindables.length > 0" class="text-blue-500 mb-6">
          I couldn't find time for all the things you want to do today! 😨
        </div>

        <p class="mb-6">
          I try to order events as best I can, so this problem usually happens
          if certain events are taking up a large amount of time, or you just
          have too many things going on.
        </p>

        <p class="mb-6">
          <b>Unmovable</b> events actually make this problem worse! It gets way
          harder the more unmovable events you have.
        </p>

        <p class="mb-6">
          I would suggest bunching up <b>unmovable</b> events as close together
          as you can, and if you can't, try committing to fewer movable events.
          Maybe you could find a way to do a movable or unmovable event in
          <i>less time</i> too?
        </p>
        <p class="mb-6">Try again after you've made your changes!</p>
        <div>
          <Button text="Let's Try Again" theme="primary" @click="restart" />
        </div>
      </template>
      <template v-else>
        <span class="text-green-500">Complete!</span> I had no issues optimising
        your calendar - you've got plenty of flow today! Go review my changes,
        and let's get this bread. 🥖
      </template>
    </div>
  </div>
</template>

<script>
import { subMinutes, addMinutes, parseISO, format } from "date-fns";
import axios from "axios";
import browser from "webextension-polyfill";

export default {
  data() {
    return {
      level: "connected",
      focus: "",
      error: "",
      events: [],
      highestFlowMinutes: 0,
      unfindables: [],
    };
  },
  watch: {
    level() {
      if (this.level === "optimise") {
        this.optimise();
      }
    },
  },
  mounted() {
    setTimeout(() => (this.level = "filtering"), 2000);
    this.$store.dispatch("getAllTodayEvents");
  },
  methods: {
    completeEventSelection(events) {
      this.events = events;
      this.level = "focus";
    },
    optimise() {
      setTimeout(async () => {
        const changes = [];

        if (this.events.length === 0) {
          this.error =
            "You can't use an empty calendar. Please add events and try again.";
          return;
        }

        const events = this.events;

        const unmovable = events.filter((event) => event.ticked);
        if (unmovable.length < 1) {
          this.error =
            "Your calendar needs an unmovable event at the end of your day (sleep time). Please change it and try Flowcas again after.";
          return;
        }

        // 1. Get all movable time blocks
        const movables = events
          .filter((event) => !event.ticked)
          .sort(
            (a, b) =>
              a.start.dateTime -
              a.end.dateTime -
              (b.start.dateTime - b.end.dateTime)
          );
        console.log(movables);

        const freetimes = [];

        // Later: Resolve all event conflicts?
        // Assume no conflicts

        // Assume start time is right now
        // Assume end time is the last unmovable block

        // 2. Find free times
        const now = new Date();
        const upcomingLockedEvents = events
          .filter((event) => event.ticked)
          .filter((event) => event.end.dateTime >= now);

        const freetimeNow = upcomingLockedEvents[0].start.dateTime - now;
        if (freetimeNow > 0) {
          const minutes = freetimeNow / 1000 / 60;

          freetimes.push({
            start: now,
            end: upcomingLockedEvents[0].start.dateTime,
            minutes: minutes,
          });
        }

        for (let i = 0; i < upcomingLockedEvents.length - 1; i++) {
          const a = upcomingLockedEvents[i];
          const b = upcomingLockedEvents[i + 1];
          const minutes = (b.start.dateTime - a.end.dateTime) / 1000 / 60;

          // Ignore conflicting locked events
          if (minutes > 0) {
            freetimes.push({
              start: a.end.dateTime,
              end: b.start.dateTime,
              minutes: minutes,
            });
          }
        }

        console.log("Freetimes!");
        console.log(freetimes);

        // 3. Take the biggest time block and move it as late as it possibly can (in a gap)
        for (let movable of movables) {
          let found = false;
          const minutes =
            (movable.end.dateTime - movable.start.dateTime) / 1000 / 60;

          for (let i = freetimes.length - 1; i >= 0; i--) {
            const freetime = freetimes[i];

            if (minutes > freetime.minutes) {
              continue;
            }

            const newEndDateTime = freetime.end;

            freetime.minutes -= minutes;
            freetime.end = subMinutes(freetime.end, minutes);

            movable.start.dateTime = freetime.end.toISOString();
            movable.end.dateTime = newEndDateTime.toISOString();

            changes.push(
              axios.patch(
                `calendars/${movable.calendar}/events/${movable.id}`,
                {
                  start: {
                    dateTime: freetime.end.toISOString(),
                  },
                  end: {
                    dateTime: newEndDateTime.toISOString(),
                  },
                }
              )
            );

            found = true;
            break;
          }

          if (found) {
            continue;
          } else {
            this.unfindables.push(movable);
          }
        }

        console.log("Unfindables!");
        console.log(this.unfindables);

        // 4. Create time blocks for "focus" in the gaps, with a maximum of 3 hours, adding 30 minute breaks in long freetimes.
        for (let freetime of freetimes) {
          while (freetime.minutes > 0) {
            if (freetime.minutes >= 210) {
              const timeBlockEnd = addMinutes(freetime.start, 180);
              const focusEvent = {
                summary: this.focus,
                start: {
                  dateTime: freetime.start.toISOString(),
                },
                end: {
                  dateTime: timeBlockEnd.toISOString(),
                },
              };
              changes.push(axios.post("calendars/primary/events", focusEvent));
              events.push(focusEvent);

              this.highestFlowMinutes = 180;

              const breakEnd = addMinutes(timeBlockEnd, 30);
              const breakEvent = {
                summary: "Break",
                start: {
                  dateTime: timeBlockEnd.toISOString(),
                },
                end: {
                  dateTime: breakEnd.toISOString(),
                },
              };
              changes.push(axios.post("calendars/primary/events", breakEvent));
              events.push(breakEvent);

              freetime.minutes -= 210;
              freetime.start = breakEnd;
            } else {
              const focusEvent = {
                summary: this.focus,
                start: {
                  dateTime: freetime.start.toISOString(),
                },
                end: {
                  dateTime: freetime.end.toISOString(),
                },
              };
              changes.push(axios.post("calendars/primary/events", focusEvent));
              events.push(focusEvent);
              this.highestFlowMinutes =
                freetime.minutes > this.highestFlowMinutes
                  ? freetime.minutes
                  : this.highestFlowMinutes;
              freetime.minutes = 0;
            }
          }
        }

        const results = await Promise.allSettled(changes);

        const errors = results.filter((result) => result.status === "rejected");

        for (let result of results) {
          console.log(result);
        }

        if (errors.length === 0) {
          this.level = "complete";

          browser.runtime.sendMessage({
            type: "loadNotifications",
            data: events.filter((event) => event.start.dateTime >= now),
          });
        } else {
          const eventPrint = (event) => {
            const startTime = format(parseISO(event.start.dateTime), "p");
            const endTime = format(parseISO(event.end.dateTime), "p");
            return `${event.summary} (${startTime} - ${endTime})`;
          };
          const errorStrings = errors.map(
            (error) => `${eventPrint(JSON.parse(error.reason.config.data))}\n`
          );
          this.error = `I ran into a problem trying some of the changes, sorry about that. It seems I couldn't make these changes happen:\n${errorStrings}\nContact the developer about this issue, with a screenshot of your browser console (press F12).`;
        }

        // 5. Done!

        // Ideas:
        // 1. Create a 30 minute "break" time block after each focus time block. If not possible, reduce the length of the focus time block before it.
      }, 1000);
    },
    async restart() {
      await this.$store.dispatch("getAllTodayEvents");
      this.level = "filtering";
    },
  },
};
</script>
