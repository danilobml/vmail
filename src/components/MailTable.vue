<template>
  <!-- <h1>{{ emailSelection.emails.size }} emails selected</h1> -->
  <BulkActionBar :emails="unarchivedEmails" />
  <table class="mail-table">
    <tbody>
      <tr v-for="email in unarchivedEmails" :key="email.id" :class="['clickable', email.read ? 'read' : '']">
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
        <td><button @click="archiveEmail(email)">Archive</button></td>
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
import { ref, reactive } from 'vue'
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

    return {
      format,
      emails,
      openedEmail,
      updateEmail,
      emailSelection: useEmailSelection()
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

    archiveEmail(email) {
      email.archived = true
      updateEmail(email)
    },

    changeEmail({ toggleRead, toggleArchive, changeIndex, save, closeModal }) {
      const email = this.openedEmail
      const index = this.unarchivedEmails.indexOf(email)
      if (toggleRead) { email.read = !email.read }
      if (toggleArchive) { email.archived = !email.archived }
      if (changeIndex === 1) { this.openEmail(this.unarchivedEmails[index + 1]) }
      if (changeIndex === -1) { this.openEmail(this.unarchivedEmails[index - 1]) }
      if (save) { this.updateEmail(email) }
      if (closeModal) { this.openedEmail = null }
    }
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1
      })
    },

    unarchivedEmails() {
      return this.sortedEmails.filter(email => !email.archived)
    }
  }
}
</script>

<style scoped></style>
