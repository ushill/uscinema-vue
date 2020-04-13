<template>
  <div class="CriticComments container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
    <section v-if="summary_errored">
      <div class="error_list">
        {{error_content}}
      </div>
    </section>
    <section v-else>
      <div class="critic-comments-container">
        <h1 class="col-xs-9"><router-link tag="a" class="title" :to="{name:'movie', params:{id:this.movie.id}}">{{movie.title}}</router-link>
          的作者评价</h1>
        <div class="col-xs-3">
          <router-link tag="img" class="movie-img" :src="poster_src" :to="{name:'movie', params:{id:this.movie.id}}"></router-link>
        </div>
        <div class="critic-comments">
          <br><br><br><br>
          <div class="ch-container col-xs-10">
            <div class="col-xs-1 critic-comments-rating-container">
              <div class="critic-comments-rating" v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}">
                <span>{{rating}}</span>
              </div>
            </div>
            <div class="critic-comments-ratio col-xs-7">
              <div class="critic-comments-type"><div class="range">9 ~ 10：</div><div class="critic-comments-ratio-line red" v-bind:style="{width: widthRed}">
                <div class="critic-comments-ratio-cnt" v-if="redCnt!=0">{{this.redCnt}}</div></div>
              </div>
              <div class="critic-comments-type"><div class="range">7 ~ 8 ：</div><div class="critic-comments-ratio-line green" v-bind:style="{width: widthGreen}">
                <div class="critic-comments-ratio-cnt" v-if="greenCnt!=0">{{this.greenCnt}}</div></div>
              </div>
              <div class="critic-comments-type"><div class="range">5 ~ 6 ：</div><div class="critic-comments-ratio-line yellow" v-bind:style="{width: widthYellow}">
                <div class="critic-comments-ratio-cnt" v-if="yellowCnt!=0">{{this.yellowCnt}}</div></div>
              </div>
              <div class="critic-comments-type"><div class="range">0 ~ 4 ：</div><div class="critic-comments-ratio-line purple" v-bind:style="{width: widthPurple}">
                <div class="critic-comments-ratio-cnt" v-if="purpleCnt!=0">{{this.purpleCnt}}</div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="clear"></div><br>

        <section v-if="errored">
          <div class="error_list">
            {{error_content}}
          </div>
        </section>
        <section v-else>
          <div v-if="loading">Loading...</div><br>
          <ul class=""><comment-item
            v-for="(item, index) of critic_comments"
            :content="item"
            :index="index"
            :key="index"
            :type="critic"
          ></comment-item>
          </ul>
          <!-- num: {{critic_comments_num}} <br><br><br> -->

          <div class="clear"></div><br><br>
        </section>

        <div class="page-area">
          <section v-if="errored"></section>

          <section v-else>
            <div class="page-area">
              <v-pagination :total="totalForPage" :display="display" :curpage="page" @pagechange="pagechange"></v-pagination>
            </div>
          </section>
        </div>

      </div>
    </section>
  </div>
</template>

<script>

import axios from 'axios'
import CommentItem from '../components/comment_item'
import pagination from '../components/pagination'

export default {
  name: 'CriticComments',
  components: {
    'comment-item': CommentItem,
    'v-pagination': pagination
  },
  data () {
    return {
      id: undefined,
      movie: 1,
      rating: undefined,
      critic: 'critic',
      critic_comments: [],
      critic_comments_num: 0,
      isgrade1: false,
      isgrade2: false,
      isgrade3: false,
      isgrade4: false,
      widthRed: 0,
      widthGreen: 0,
      widthYellow: 0,
      widthPurple: 0,
      redCnt: 0,
      greenCnt: 0,
      yellowCnt: 0,
      purpleCnt: 0,
      poster_src: '',
      page: 1,
      display: 1,
      totalForPage: 0,
      loading: true,
      errored: false,
      ratio_errored: false,
      ratio_loading: true,
      summary_errored: false,
      summary_loading: true,
      error_content: '服务器开小差啦>_<'
    }
  },
  mounted () {
    this.handleRouteChange()
  },
  watch: {
    '$route': 'handleRouteChange'
  },
  methods: {
    pagechange: function (currentPage) {
      // console.log('pagechange', currentPage)
      this.$router.push('/movie/' + this.id + '/critic_comments?page=' + currentPage)
    },
    handleRouteChange () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.id = this.$route.params.id
      this.page = (this.$route.query.page ? parseInt(this.$route.query.page) : 1)
      // console.log('route', this.$route)
      // console.log('paged', this.page)
      this.handleMovieSummary(this.id)
      this.handleMovieCriticCommentsRatio(this.id)
      this.handleMovieCriticCommentsSummary(this.id)
    },
    handleMovieSummary (id) {
      axios
        .get(this.server_host_java + '/v1/movie/detail/' + id)
        .then(response => {
          this.movie = response.data.movie
          this.rating = this.movie.rating
          // console.log('rating', this.rating)
          this.poster_src = this.server_host_static + this.movie.image
          this.summary_errored = false
        })
        .catch(error => {
          console.log(error)
          this.summary_errored = true
        })
        .finally(() => this.summary_loading = false)
    },
    handleMovieCriticCommentsRatio (id) {
      axios
      // .get(this.server_host + '/v1/comments/critics/movie/' + id + '/ratio/')
        .get(this.server_host_java + '/v1/comments/ratio/movie/' + id + '?isCritic=1')
        .then(response => {
          // console.log(response)
          this.critic_comments_num = response.data.total
          this.rating_count_html = '基于 ' + this.critic_comments_num + ' 位作者评价'
          this.redCnt = response.data.excellent
          this.greenCnt = response.data.good
          this.yellowCnt = response.data.mixed
          this.purpleCnt = response.data.shit + response.data.bad

          if (window.screen.width < 992) {
            var totalLend = window.screen.width * 1.2
          } else if (window.screen.width < 1200) {
            var totalLend = 500
          } else {
            var totalLend = 600
          }

          var maxCnt = Math.max(this.redCnt, this.greenCnt, this.yellowCnt, this.purpleCnt)
          var totalLen = Math.min(this.critic_comments_num * 40, totalLend)
          this.widthRed = (this.redCnt / maxCnt) * totalLen + 'px'
          this.widthGreen = (this.greenCnt / maxCnt) * totalLen + 'px'
          this.widthYellow = (this.yellowCnt / maxCnt) * totalLen + 'px'
          this.widthPurple = (this.purpleCnt / maxCnt) * totalLen + 'px'

          this.rating = response.data.rating
          this.display = response.data.display
          this.totalForPage = this.display * 50 > this.critic_comments_num ? this.critic_comments_num : this.display * 50
          this.handlerating()

          this.ratio_errored = false
        })
        .catch(error => {
          console.log(error)
          this.ratio_errored = true
        })
        .finally(() => this.ratio_loading = false)
    },
    handleMovieCriticCommentsSummary (id) {
      axios
      // .get(this.server_host + '/v1/comments/critics/movie/' + id + '/all/')
        .get(this.server_host_java + '/v1/comments/movie/' + id + '?isCritic=1&page=' + this.page)
        .then(response => {
          // console.log(response.data)
          this.critic_comments = response.data
          this.errored = false
          if (this.page > 1 && this.critic_comments.length == 0) {
            this.errored = true
            this.error_content = '该页面不存在>_<'
          }
        })
        .catch(error => {
          if (error.response && error.response.status == 400) {
            this.error_content = '该页面不存在>_<'
          }
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },
    handlerating () {
      console.log('r', this.rating)
      if (!this.rating || this.rating == 'tbd') {
        this.rating = 'tbd'
      } else if (this.movie.bnm) {
        this.isgrade1 = true
      } else if (this.movie.rating < '4.0') {
        this.isgrade4 = true
      } else if (this.movie.rating < '6.0') {
        this.isgrade3 = true
      } else if (this.movie.rating < '8.0') {
        this.isgrade2 = true
      } else {
        this.isgrade1 = true
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
  }

  .critic-comments-container,.user-comments-container{
    margin: 20px 0px;
  }
  .critic-comments-rating-container,.user-comments-rating-container{
    height: 120px;
    padding: 30px 80px 30px 10px;
  }
  .critic-comments-rating,.user-comments-rating{
    line-height: 70px;
    font-size: 1.9em;
    border: 3px solid #8F8F8F;
    color: #8F8F8F;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    text-align: center;
    font-weight: 700;
  }
  .critic-comments-ratio,.user-comments-ratio{
    margin: 10px 0px 10px 20px;
    border-left: 2px solid grey;
  }
  .critic-comments-type,.user-comments-type{
    height: 28px;
    line-height: 28px;
    position: relative;
  }
  .critic-comments-ratio-line,.user-comments-ratio-line{
    vertical-align: center;
    height: 5px;
    position: absolute;
    top: 11.5px;
    left: 85px;
  }
  .critic-comments-ratio-cnt,.user-comments-ratio-cnt{
    position: absolute;
    top: -11px;
    right: -45px;
    width: 40px;
  }
  .red{
    background-color: #FF6A6A;
  }
  .green{
    background-color: #00cc99 ;
  }
  .yellow{
    background-color: #EEB422;
  }
  .purple{
    background-color: #8B0082;
  }
  .range{
    min-width: 80px;
    margin-left: 20px;
    display: inline-block;
  }
  ul li:nth-of-type(even){
    background-color: #F8FAF8;
  }
  .grade1{
    border: 3px solid #FF4A4A;
    color: #FF6A6A;
  }
  .grade2{
    border: 3px solid #00cc99;
    color: #00cc99;
  }
  .grade3{
    border: 3px solid #EEB422;
    color: #EEB422;
  }
  .grade4{
    border: 3px solid #8B0082;
    color: #8B0082;
  }
  .critic-comments .ch-container, .user-comments .ch-container{
    background-color: #F8FAF8;
  }
  .clear{
    clear:both;
  }
  .movie-img:hover,.title:hover{
    color: #FF7979;
    cursor: pointer;
  }
  .movie-img{
    height: 220px;
    position: absolute;
    right: 0px;
  }
  h1{
    padding: 0px;
  }
  .error_list{
    width: 100%;
    height: 100%;
    font-size: 1.5em;
    text-align: center;
    padding-top: 10%;
  }
</style>
