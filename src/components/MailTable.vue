<template>
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="toggleReadEmail(email)"
      >
        <td><input type="checkbox" /></td>
        <td>{{ email.subject }}</td>
        <td>
          <p><strong>{{ email.subject }}</strong> - {{ email.body }}</p>
        </td>
        <td>{{ format(new Date(email.sentAt), "dd/MM/yyyy") }}</td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { format } from 'date-fns'
import axios from 'axios'
import { ref } from 'vue'

export default {
  async setup() {
    let { data: emails } = await axios.get('http://localhost:3000/emails')

    emails = ref(emails)

    return {
      format,
      emails
    }
  },
  methods: {
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    },

    toggleReadEmail(email) {
      email.read = !email.read
      this.updateEmail(email)
    },

    archiveEmail(email) {
      email.archived = true
      this.updateEmail(email)
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
