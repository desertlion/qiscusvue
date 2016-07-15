<template>
  <div class="login-container">
    <form v-on:submit.prevent="login(email, password)">
      <h3>Login to <strong>qis</strong>cus</h3>
      <input type="text" name="email" v-model="email">
      <input type="password" name="password" v-model="password">
      <button :disabled="isLoggingIn">{{ isLoggingIn ? 'processing ...' : 'login' }}</button>
    </form>
  </div>
</template>

<script>
import {login} from '../vuex/actions';
export default {
  data () {
    return {
      error: '',
      email: '',
      password: ''
    }
  },
  vuex: {
    actions: {
      login
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 { text-align: center; font-weight: normal; }
.login-container {
  max-width: 600px;
  margin: 50px auto;
}
.login-container input { width: 100%; padding: 7px; border: 1px solid #ddd; margin: 5px; border-radius: 5px; }
button { background: #2F8568; border: 1px solid #ddd; padding: 7px; margin: 5px; width: 100%; border-radius: 5px; color: #FFF; }
</style>
