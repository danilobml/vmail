import { reactive } from "vue"
import updateEmail from "../helpers/updateEmail"

let emails = reactive(new Set())

const useEmailSelection = () => {
  const toggle = (email) => {
    if (emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }

  const clear = () => {
    emails.clear()
  }

  const addMultiple = (newEmails) => {
    newEmails.forEach(email => emails.add(email))
  }

  const markRead = () => {
    emails.forEach(email => {
      email.read = true
      updateEmail(email)
    })
  }

  const markUnread = () => {
    emails.forEach(email => {
      email.read = false
      updateEmail(email)
    })
  }

  const archive = () => {
    emails.forEach(email => {
      email.archived = true
      updateEmail(email)
    })
    emails.clear()
  }

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive
  }
}

export default useEmailSelection
