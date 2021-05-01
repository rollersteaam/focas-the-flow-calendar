<template>
	<span :class="fullClass" @click="$emit('click', $event)">
		<template v-if="theme == 'bespoke'">
			<slot> </slot>
		</template>
		<template v-else>
			{{ text }}
		</template>
	</span>
</template>

<script>
export default {
	name: "Button",
	props: {
		text: String,
		theme: String,
		additionalClass: String,
	},
	computed: {
		themeClass() {
			switch (this.theme) {
				case "primary":
					return "px-4 py-3 bg-blue-600 text-blueGray-50 rounded mx-auto hover:bg-blue-500 active:bg-blue-700 cursor-pointer select-none";
				case "bespoke":
					return "border border-blueGray-400 px-4 py-3 rounded text-blueGray-600 hover:border-blueGray-300 hover:text-blueGray-500 cursor-pointer select-none active:border-blueGray-500 active:text-blueGray-800";
				default:
					console.error(
						`This button's theme (${this.theme}) isn't implemented!`
					);
					return "";
			}
		},
		fullClass() {
			return this.themeClass + this.additionalClass;
		},
	},
};
</script>
