<script setup lang="ts">
const props = defineProps(['name'])
</script>

<template>
  <div class="listItem">
    <p>{{ props.name }}</p>
  </div>
</template>

<style scoped>
.listItem {
  width: 100%;
  height: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: rgba(59, 58, 58, 0.5);

  border-top: none;
  border-right: none;
  border-bottom: none;
  border-left-style: solid;
  border-left-width: 0.5rem;
  border-left-color: transparent;

  margin-top: 0.3rem;

  p {
    width: 30%;
  }

  &.selected {
    border-color: var(--button-bg-hover);
    background-color: var(--button-bg-main);
  }
}

.listItem:hover {
  border-color: var(--button-bg-hover);
  transition: border-color 200ms linear;
}
</style>
