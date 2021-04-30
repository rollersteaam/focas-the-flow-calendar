<template>
	<div class="p-5 pb-8">
		<div class="mb-5 flex justify-center items-center">
			<img :src="logo" alt="" class="inline w-20" />
			<span class="text-4xl text-blue-600 mt-2">Focas</span>
		</div>
		<div class="text-lg text-blueGray-100 bg-blue-500 px-10 py-5 rounded mb-10">
			Ready to hit "launch" on your day?
		</div>
		<Button text="Let's Go" />
	</div>
</template>

<script>
import logo from "../assets/icon.png";

export default {
	name: "StartScreen",
	data() {
		return {
			logo,
		};
	},
};
</script>

<style></style>
