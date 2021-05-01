<template>
	<div id="app" class="border border-blueGray-300">
		<component :is="views.StartView" />
	</div>
</template>

<script>
import StartView from "@/views/StartView";
import "animate.css";

export default {
	name: "App",
	data() {
		return {
			views: {
				StartView,
			},
		};
	},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap");

#app {
	font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.popup {
	width: 640px;
	max-height: 480px;
	overflow: auto;
}
</style>
