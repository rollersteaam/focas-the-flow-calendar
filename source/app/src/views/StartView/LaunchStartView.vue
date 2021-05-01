<template>
	<div>
		<div class="mb-5 flex justify-center items-center">
			<img src="@/assets/icon.png" alt="" class="inline w-20" />
			<span class="text-4xl text-blue-600 mt-2">Mummeth</span>
		</div>
		<div class="text-lg text-blueGray-700 bg-blueGray-200 px-10 py-5 rounded mb-10">
			Ready to hit launch on your day?
		</div>
		<Button
			text="Launch"
			theme="primary"
			@click="$emit('view-change', 'connect')"
		/>
	</div>
</template>

<script>
export default {};
</script>

<style></style>
