<template>
  <div class="email-display">
    <div class="toolbar">
      <button @click="toggleArchive">{{ email.archived ? "Move to Inbox (a)" : "Archive (a)" }}</button>
      <button @click="toggleRead">{{ email.read ? "Mark Unread (r)" : "Mark Read (r)" }}</button>
      <button @click="goNewer">Newer (n)</button>
      <button @click="goOlder">Older (o)</button>
    </div>
    <h2 class="mb-0">Subject: <strong>{{ email.subject }}</strong></h2>
    <div><em>From {{ email.from }} on {{ format(new Date(email.sentAt), 'dd/MM/yyyy') }}</em></div>
    <div v-html="marked(email.body)"></div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { marked } from 'marked'
import useKeydown from '../composables/useKeydown'

export default {
  props: {
    email: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {

    const email = props.email

    const toggleRead = () => { emit ('changeEmail', {toggleRead: true, save: true}) }
    const toggleArchive = () => { emit ('changeEmail', {toggleArchive: true, save: true, closeModal: true}) }
    const goNewer = () => { emit ('changeEmail', {changeIndex: -1}) }
    const goOlder = () => { emit ('changeEmail', {changeIndex: 1}) }
    const goNewerAndArchive = () => { emit ('changeEmail', {changeIndex: -1, toggleArchive: true, save: true}) }
    const goOlderAndArchive = () => { emit ('changeEmail', {changeIndex: 1, toggleArchive: true, save: true }) }

    useKeydown([
      { key: "a", fn: () => toggleArchive() },
      { key: "r", fn: () => toggleRead() },
      { key: "n", fn: () => goNewer() },
      { key: "o", fn: () => goOlder() },
      { key: "s", fn: () => goNewerAndArchive() },
      { key: "v", fn: () => goOlderAndArchive() },
    ])

    return {
      format,
      marked,
      toggleRead,
      toggleArchive,
      goNewer,
      goOlder
    }
  }
}
</script>

<style scoped></style>
