<template>
	<span :class="themeClass" @click="$emit('click', $event)">
		{{ text }}
	</span>
</template>

<script>
export default {
	name: "Button",
	props: {
		text: String,
		theme: String,
	},
	computed: {
		themeClass() {
			switch (this.theme) {
				case "primary":
					return "px-4 py-3 bg-blue-600 text-blueGray-50 rounded mx-auto hover:bg-blue-500 active:bg-blue-700 cursor-pointer select-none";
				default:
					console.error(
						`This button's theme (${this.theme}) isn't implemented!`
					);
					return "";
			}
		},
	},
};
</script>
