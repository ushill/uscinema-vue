<template>
  <div class="User">
    <!-- <user-page :type="'user'"></user-page> -->
    <user-page></user-page>
  </div>
</template>

<script>

import UserPage from '../components/user_page'

export default {
  name: 'User',
  components: {
    'user-page': UserPage
  },
  data () {
    return {
    }
  },
  mounted () {
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  },
  methods: {
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
    padding: 0px;
  }
</style>
