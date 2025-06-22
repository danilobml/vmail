<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input
        type="checkbox"
        :checked="allEmailsSelected"
        :class="[someEmailsSelected ? 'partial-check' : '']"
        @click="bulkSelect"
      >
    </span>
    <span class="buttons">
      <button @click="emailSelection.markRead()" :disabled="Array.from(emailSelection.emails).every(email => email.read)">Mark Read</button>
      <button @click="emailSelection.markUnread()" :disabled="Array.from(emailSelection.emails).every(email => !email.read)">Mark Unread</button>
      <button @click="emailSelection.archive()" :disabled="emailSelection.emails.size === 0">Archive</button>
    </span>
  </div>
</template>

<script>
  import { computed } from 'vue';
import useEmailSelection from '../composables/useEmailSelection'

  export default {
    props: {
      emails: {
        type: Array,
        required: true
      }
    },
    setup(props) {

      const emailSelection = useEmailSelection()

      const allEmailsSelected = computed(() => {
        return emailSelection.emails.size === props.emails.length
      })

      const someEmailsSelected = computed(() => {
        return emailSelection.emails.size > 0 && emailSelection.emails.size < props.emails.length
      })

      const bulkSelect = () => {
        if (allEmailsSelected.value) {
          emailSelection.clear()
        } else {
          emailSelection.addMultiple(props.emails)
        }
      }

      return {
        emailSelection,
        allEmailsSelected,
        someEmailsSelected,
        bulkSelect
      }
    },
  }
</script>

<style scoped>

</style>
