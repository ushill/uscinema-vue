<template>
  <div class="MoviesTop container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
    <div class="lilbreak"></div>
    <section v-if="top">
      <div class="title">
        <h1 class="h1-top">UsCinema Top 250</h1>
      </div>
      <div class="choose" @click=handleTop(false)>Bottom 250</div>
    </section>
    <section v-else>
      <div class="title">
        <h1>UsCinema Bottom 250</h1>
      </div>
      <div class="choose choose-top" @click=handleTop(true)>Top 250</div>
    </section>

    <div class="clear"></div>
    <div class="display">
      <span></span>
      <span></span>
    </div>
    <div class="break"></div>

    <section v-if="errored">
      <div class="error_list">
        <p>{{error_content}}</p>
      </div>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div v-else class="top">
        <ul><movie-item
          v-for="(item, index) of movielist"
          :content="item"
          :index="index"
          :key="index"
          :page="page"
          :showidx=true
          :toped="top"
          :display="display"
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
  name: 'MoviesTop',
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
      this.$router.push('/movies/top?page=' + currentPage + '&type=' + (this.top ? '1' : '2'))
    },
    handleTop (type) {
      this.top = type
      this.$router.push('/movies/top?page=1&type=' + (this.top ? '1' : '2'))
    },
    handleRouteChange () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.page = (this.$route.query.page ? parseInt(this.$route.query.page) : 1)
      this.top = this.$route.query.type != 2
      var type = (this.top ? 1 : 2)
      // console.log(this.top, type, this.server_host_java + '/v1/movies/top?page=' + this.page + '&type=' + this.$route.query.type)

      axios
        .get(this.server_host_java + '/v1/movies/top?page=' + this.page + '&type=' + type)
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
      top: true,
      // page_loading: true,
      // page_errored: false,
      total: 150, // 记录总条数
      display: 10, // 每页显示条数
      error_content: '服务器开小差啦>_<'
    }
  }
}
{}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .top{
    margin-top: 30px;
    background-color: #F6FBFA;
  }
  .title{
    display: inline;
    text-align: left;
    line-height: 80px;
    height: 60px;
  }
  p{
    height: 120px;
    line-height: 120px;
  }
  h1{
    box-shadow: -1px 2px 3px 0px rgba(60, 20, 40, 0.8);
    padding: 10px 16px 0px 12px;
    float: left;
    height: 60px;
    margin: 0;
    color: #FFF0F5;
    font-size: 30px;
    line-height: 48px;
    background-color: rgba(20, 0, 70, 0.8);
  }
  .h1-top{
    box-shadow: -1px 2px 3px 0px rgba(255, 40, 40, 0.8);
    background-color: rgba(245, 40, 40, 0.7);
  }
  .display{
    float: right;
  }
  .break{
    height: 0px;
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
  .choose{
    float: left;
    display: inline;
    height: 25px;
    line-height: 25px;
    background-color: #F2F2F2;
    margin: 35px 10px 0 10px;
    padding: 0 7px;
    font-size: 14px;
    font-weight: 500;
    color: #606060;
    border: solid 1px #a2a2a2;
    letter-spacing: -0.4px;
  }
  .clear{
    clear: both;
  }
  @media screen and (max-device-width: 992px) {
    .choose{
      font-size: 1.5em;
    }
  }
</style>
