<template>
  <div class="relative">
    <div class="lds-dual-ring relative left-1 top-2"></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid rgb(128, 128, 128);
  border-color: rgb(128, 128, 128) transparent rgb(128, 128, 128) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
