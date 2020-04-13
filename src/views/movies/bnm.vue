<template>
  <div class="MoviesBnm container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
    <div class="lilbreak"></div>
    <div class="title">
      <h1>最佳新电影 Best New Movie</h1>
      <div class="display">
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="break"></div>

    <section v-if="errored">
      <div class="error_list">
        <p>{{error_content}}</p>
      </div>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div v-else class="bnm">
        <ul><movie-item
          v-for="(item, index) of movielist"
          :content="item"
          :index="index"
          :key="index"
          :page="page"
        ></movie-item>
        </ul>
      </div>
    </section>

    <div class="page-area">
      <section v-if="errored"></section>

      <section v-else>
        <!-- <div v-if="loading">Loading...</div> -->
        <v-pagination :total="total" :display="display" :curpage="page" @pagechange="pagechange"></v-pagination>
      </section>
    </div>
  </div>
</template>

<script>
import MovieItem from '../../components/movie_item'
import axios from 'axios'
import pagination from '../../components/pagination'

export default {
  name: 'MoviesBnm',
  components: {
    'movie-item': MovieItem,
    'v-pagination': pagination
  },
  watch: {
    '$route': 'handleRouteChange'
  },
  mounted () {
    this.handleRouteChange()
  },
  methods: {
    pagechange: function (currentPage) {
      // console.log('pagechange', currentPage)
      this.$router.push('/movies/bnm?page=' + currentPage)
    },
    handleRouteChange () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.page = (this.$route.query.page ? parseInt(this.$route.query.page) : 1)

      axios
        .get(this.server_host_java + '/v1/movies/bnm?page=' + this.page)
        .then(response => {
          // console.log(response)
          this.movielist = response.data.movies
          this.display = parseInt(response.data.per_page)
          this.total = parseInt(response.data.total)
          this.errored = false
          if (this.movielist.length == 0) {
            this.errored = true
            this.error_content = '该页面不存在>_<'
          }
        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status == 400 && error.response.data.code == 10001) {
            this.error_content = '该页面不存在>_<'
          }
          console.log(error.response)
          this.errored = true
        })
        .finally(() => this.loading = false)
    }
  },
  data () {
    return {
      msg: 'MoviesAll',
      page: 1,
      info: '',
      loading: true,
      errored: false,
      movielist: [],
      total: 150, // 记录总条数
      display: 10, // 每页显示条数
      error_content: '服务器开小差啦>_<'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bnm{
    margin-top: 30px;
    background-color: #F6FBFA;
  }
  .title{
    display: inline;
    text-align: left;
    line-height: 80px;
  }
  p{
    height: 120px;
    line-height: 120px;
  }
  h1{
    box-shadow: -4px 6px 4px 1px rgba(160, 200, 255, 0.3);
    padding: 12px 30px 14px 15px;
    float: left;
  }
  .display{
    float: right;
  }
  .break{
    height: 80px;
  }
  .lilbreak{
    height: 40px;
  }
  ul li:nth-of-type(even){
    background-color: #FFFFFF;
  }
  .page-area{
    padding-top: 60px;
  }
  .error_list{
    height: 100%;
    font-size: 1.5em;
    text-align: center;
    padding-top: 10%;
  }

</style>
