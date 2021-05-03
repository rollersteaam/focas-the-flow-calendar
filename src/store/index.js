import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		client: null,
		events: [],
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
		async getAllEvents({ commit }) {
			const request = await axios.get(
				"calendars/primary/events",
				{
					params: {
						timeMin: new Date().toISOString(),
						maxResults: 10,
						singleEvents: true,
						orderBy: "startTime",
					},
				}
			);

			const events = request.data.items;
			events.map((event) => {
				const start = event.start.dateTime || event.start.date;
				console.log(`${start} - ${event.summary}`);
			});
			commit("setEvents", events);
		},
	},
	modules: {},
});
