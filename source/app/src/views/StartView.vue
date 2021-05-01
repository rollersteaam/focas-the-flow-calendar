<template>
	<div class="p-5 pb-8">
		<component :is="views[currentView]" @view-change="changeView" />
	</div>
</template>

<script>
import LaunchStartView from "@/views/StartView/LaunchStartView";
import ConnectView from "@/views/StartView/ConnectView";
import DayPlannerView from "@/views/StartView/DayPlannerView";

export default {
	name: "StartView",
	data() {
		return {
			views: {
				start: LaunchStartView,
				connect: ConnectView,
				dayplanner: DayPlannerView,
			},
			currentView: "start",
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
