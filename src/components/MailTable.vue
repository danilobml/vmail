<template>
  <button @click="selectScreen('inbox')" :disabled="selectedScreen === 'inbox'">Inbox</button>
  <button @click="selectScreen('archived')" :disabled="selectedScreen === 'archived'">Archive</button>
  <BulkActionBar :emails="filteredEmails" :selected-screen="selectedScreen" />
  <table class="mail-table">
    <tbody>
      <tr v-for="email in filteredEmails" :key="email.id" :class="['clickable', email.read ? 'read' : '']">
        <td><input
            type="checkbox"
            @click="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)"
          /></td>
        <td @click="openEmail(email)">{{ email.subject }}</td>
        <td @click="openEmail(email)">
          <p><strong>{{ email.subject }}</strong> - {{ email.body }}</p>
        </td>
        <td @click="openEmail(email)">{{ format(new Date(email.sentAt), "dd/MM/yyyy") }}</td>
        <td><button @click="toggleArchiveEmail(email)">{{ selectedScreen === 'inbox' ? 'Archive' : 'Unarchive' }}</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
import { format } from 'date-fns'
import axios from 'axios'
import { ref } from 'vue'
import MailView from './MailView.vue'
import ModalView from './ModalView.vue'
import updateEmail from '../helpers/updateEmail'
import useEmailSelection from '../composables/useEmailSelection'
import BulkActionBar from './BulkActionBar.vue'

export default {
  async setup() {
    let { data: emails } = await axios.get('http://localhost:3000/emails')

    emails = ref(emails)
    const openedEmail = ref(null)
    const selectedScreen = ref('inbox')

    const emailSelection = useEmailSelection()

    return {
      format,
      emails,
      openedEmail,
      updateEmail,
      emailSelection,
      selectedScreen
    }
  },
  components: {
    MailView,
    ModalView,
    BulkActionBar
  },
  methods: {
    openEmail(email) {
      this.openedEmail = email
      if (email) {
        email.read = true
        updateEmail(email)
      }
    },

    toggleArchiveEmail(email) {
      email.archived = !email.archived
      updateEmail(email)
    },

    changeEmail({ toggleRead, toggleArchive, changeIndex, save, closeModal }) {
      const email = this.openedEmail
      const index = this.filteredEmails.indexOf(email)
      if (toggleRead) { email.read = !email.read }
      if (toggleArchive) { email.archived = !email.archived }
      if (changeIndex === 1) { this.openEmail(this.filteredEmails[index + 1]) }
      if (changeIndex === -1) { this.openEmail(this.filteredEmails[index - 1]) }
      if (save) { this.updateEmail(email) }
      if (closeModal) { this.openedEmail = null }
    },

    selectScreen(newScreen) {
      this.selectedScreen = newScreen
      this.emailSelection.clear()
    }
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1
      })
    },

    filteredEmails() {
      if (this.selectedScreen === 'inbox') {
        return this.sortedEmails.filter(email => !email.archived)
      } else {
        return this.sortedEmails.filter(email => email.archived)
      }
    },

  }
}
</script>

<style scoped></style>
