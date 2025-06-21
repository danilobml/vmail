import axios from 'axios'

function updateEmail(email) {
  axios.put(`http://localhost:3000/emails/${email.id}`, email)
}

export default updateEmail
