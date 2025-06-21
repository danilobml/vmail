import { onMounted, onBeforeUnmount } from 'vue'

const useKeydown = (keyCombos) => {
  const onKeydown = (event) => {
    let keyCombo = keyCombos.find(kc => kc.key === event.key)
    if (event.key === keyCombo.key) {
      keyCombo.fn()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    window.addEventListener('keydown', onKeydown)
  })
}

export default useKeydown
