import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { startOfToday, endOfToday, parseISO } from "date-fns";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    client: null,
    events: {},
  },
  mutations: {
    setClient(state, client) {
      state.client = client;
    },
    setEvents(state, events) {
      state.events = events;
    },
  },
  actions: {
    async auth(_, access) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access.access_token}`;
      axios.defaults.baseURL = "https://www.googleapis.com/calendar/v3/";
    },
    async getAllTodayEvents({ commit }) {
      console.log("Getting your events now!");

      const calendars = (await axios.get("users/me/calendarList")).data.items;

      const calendarsEventsRequests = calendars.map((calendar) =>
        axios.get(`calendars/${calendar.id}/events`, {
          params: {
            timeMin: startOfToday().toISOString(),
            timeMax: endOfToday().toISOString(),
            singleEvents: true,
          },
        })
      );
      const calendarsEvents = (
        await Promise.allSettled(calendarsEventsRequests)
      ).map((eventPromise) => eventPromise.value?.data.items || []);

      // Map calendars to events in a dictionary
      const events = calendars.reduce((acc, calendar, index) => {
        acc[calendar.id] = {
          id: calendar.id,
          name: calendar.summary,
          events: calendarsEvents[index]
            .filter(
              (event) => event.start.dateTime // Ignore all day events
            )
            .map((event) => {
              event.start.dateTime = parseISO(event.start.dateTime);
              event.end.dateTime = parseISO(event.end.dateTime);
              return event;
            }),
        };
        return acc;
      }, {});

      commit("setEvents", events);
    },
  },
  modules: {},
});
