<template>
  <div class="Critics container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
    <div class="head">
      <input type="radio" name="sort" v-model="picked" value="1"> 按评价数&nbsp;&nbsp;&nbsp;
      <input type="radio" name="sort" v-model="picked" value="2"> 按平均分
    </div>
    <section v-if="errored">
      <div class="error_list">
        {{error_content}}
      </div>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>

        <critic-item
          v-for="(item, index) of critic_list"
          :user="item"
          :key="index"
          :index="index"></critic-item>
      </div>
    </section>
  </div>
</template>

<script>

import axios from 'axios'
import CriticItem from '../components/critic_item'

export default {
  name: 'Critics',
  components: {
    'critic-item': CriticItem
  },
  watch: {
    '$route': 'handleRouteChange',
    'picked': 'handleSort'
  },
  data () {
    return {
      comments_summary: '',
      image: '',
      critic_list: [],
      picked: 1,
      errored: false,
      loading: true,
      error_content: '服务器开小差啦>_<'
    }
  },
  mounted () {
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    this.handleCriticsQuery()
  },
  methods: {
    handleRouteChange () {
      this.handleCriticsQuery()
    },
    handleCriticsQuery () {
      this.errored = false
      this.loading = true
      this.picked = (this.$route.query.sort ? parseInt(this.$route.query.sort) : 1)
      axios
        .get(this.server_host_java + '/v1/comments/critics?req_type=' + this.picked)
        .then(response => {
          // console.log(response)
          this.critic_list = response.data
          this.errored = false
        })
        .catch(error => {
          console.log(error)
          this.errored = true
          if (error.response && error.response.status == 400) {
            this.error_content = '该页面不存在>_<'
          }
        })
        .finally(() => this.loading = false)
    },
    handleSort () {
      this.$router.push('/critics?sort=' + this.picked)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .head{
    margin: 30px 20px 10px;
    height: 40px;
    line-height: 40px;
    font-size: 1.1em;
    text-align: right;
  }
  .error_list{
    width: 100%;
    height: 100%;
    font-size: 1.5em;
    text-align: center;
    padding-top: 10%;
  }
  @media screen and (max-device-width: 992px) {
    .head{
      font-size: 1.3em;
    }
  }

</style>
