<template>
	<div id="app">
		<div class="p-5">
			<StartScreen />
		</div>
	</div>
</template>

<script>
import StartScreen from "@/components/StartScreen";

export default {
	components: {
		StartScreen,
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

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
