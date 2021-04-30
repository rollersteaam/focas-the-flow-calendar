<template>
	<span
		class="px-4 py-3 bg-blue-600 text-blueGray-100 rounded mx-auto hover:bg-blue-500 active:bg-blue-700 cursor-pointer select-none"
	>
		{{ text }}
	</span>
</template>

<script>
export default {
	name: "Button",
	props: {
		text: String,
	},
};
</script>
