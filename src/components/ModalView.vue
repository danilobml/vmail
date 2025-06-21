<template>
  <div class="modal">
    <div class="overlay" @click="emit('closeModal')"></div>
    <div class="modal-card">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import useKeydown from '../composables/useKeydown';


export default {
  setup(props, { emit }) {

    useKeydown([
      { key: 'Escape', fn: () => emit("closeModal") },
    ])

    return {
      emit,
    }
  },
  emits: ['closeModal'],
}
</script>

<style lang="scss" scoped></style>
