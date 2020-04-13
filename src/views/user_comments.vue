<template>
  <div class="UserComments container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
    <section v-if="summary_errored">
      <div class="error_list">
        {{error_content}}
      </div>
    </section>
    <section v-else>

      <div class="user-comments-container">
        <h1 class="col-xs-9">
          <router-link tag="a" class="title" :to="{name:'movie', params:{id:this.movie.id}}">{{movie.title}}</router-link>
          的用户评价</h1>
        <div class="col-xs-3">
          <router-link tag="img" class="movie-img" :src="poster_src" :to="{name:'movie', params:{id:this.movie.id}}"></router-link>
        </div>
        <div class="user-comments">
          <br><br><br><br>
          <div class="ch-container col-xs-10">
            <div class="col-xs-1 user-comments-rating-container">
              <div class="user-comments-rating" v-bind:class="{'grade1': isusergrade1, 'grade2': isusergrade2, 'grade3': isusergrade3, 'grade4': isusergrade4}">
                <span>{{userRating}}</span></div>
            </div>
            <div class="user-comments-ratio col-xs-7">
              <div class="user-comments-type"><div class="range">9 ~ 10：</div><div class="user-comments-ratio-line red" v-bind:style="{width: userWidthRed}">
                <div class="user-comments-ratio-cnt" v-if="userRedCnt!=0">{{this.userRedCnt}}</div></div>
              </div>
              <div class="user-comments-type"><div class="range">7 ~ 8 ：</div><div class="user-comments-ratio-line green" v-bind:style="{width: userWidthGreen}">
                <div class="user-comments-ratio-cnt" v-if="userGreenCnt!=0">{{this.userGreenCnt}}</div></div>
              </div>
              <div class="user-comments-type"><div class="range">5 ~ 6 ：</div><div class="user-comments-ratio-line yellow" v-bind:style="{width: userWidthYellow}">
                <div class="user-comments-ratio-cnt" v-if="userYellowCnt!=0">{{this.userYellowCnt}}</div></div>
              </div>
              <div class="user-comments-type"><div class="range">0 ~ 4 ：</div><div class="user-comments-ratio-line purple" v-bind:style="{width: userWidthPurple}">
                <div class="user-comments-ratio-cnt" v-if="userPurpleCnt!=0">{{this.userPurpleCnt}}</div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="clear"></div>

        <section v-if="errored">
          <div class="error_list">
            {{error_content}}
          </div>
        </section>
        <section v-else>
          <div v-if="loading">Loading...</div><br>
          <ul class=""><user-comment-item
            v-for="(item, index) of user_comments"
            :content="item"
            :index="index"
            :key="index"
            :type="user"
          ></user-comment-item></ul>
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
import UserCommentItem from '../components/user_comment_item'
import pagination from '../components/pagination'

export default {
  name: 'UserComments',
  components: {
    'user-comment-item': UserCommentItem,
    'v-pagination': pagination
  },
  data () {
    return {
      id: undefined,
      movie: 1,
      user: 'user',
      user_comments: [],
      user_comments_num: 0,
      isusergrade1: false,
      isusergrade2: false,
      isusergrade3: false,
      isusergrade4: false,
      user_rating_count_html: '',
      userWidthRed: 0,
      userWidthGreen: 0,
      userWidthYellow: 0,
      userWidthPurple: 0,
      userRedCnt: 0,
      userGreenCnt: 0,
      userYellowCnt: 0,
      userPurpleCnt: 0,
      userRating: 'tbd',
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
      this.$router.push('/movie/' + this.id + '/user_comments?page=' + currentPage)
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
      this.handleMovieUserCommentsRatio(this.id)
      this.handleMovieUserComments(this.id)
    },
    handleUserRating () {
      // console.log(this.userRating)
      if (!this.userRating || this.userRating == 'tbd' || this.userRating == '0.0') {
        this.userRating = 'tbd'
      } else if (this.userRating < '4.0') {
        this.isusergrade4 = true
      } else if (this.userRating < '6.0') {
        this.isusergrade3 = true
      } else if (this.userRating < '8.0') {
        this.isusergrade2 = true
      } else {
        this.isusergrade1 = true
      }
    },
    handleMovieSummary (id) {
      axios
        .get(this.server_host_java + '/v1/movie/detail/' + id)
        .then(response => {
          this.movie = response.data.movie
          this.poster_src = this.server_host_static + this.movie.image
          this.summary_errored = false
        })
        .catch(error => {
          console.log(error)
          this.summary_errored = true
        })
        .finally(() => this.summary_loading = false)
    },
    handleMovieUserCommentsRatio (id) {
      axios
      // .get(this.server_host + '/v1/comments/users/movie/' + id + '/ratio/')
        .get(this.server_host_java + '/v1/comments/ratio/movie/' + id + '?isCritic=0')
        .then(response => {
          // console.log('user', response)
          this.user_comments_num = response.data.total
          this.user_rating_count_html = '查看全部 ' + this.user_comments_num + ' 条用户评价'
          this.userRedCnt = response.data.excellent
          this.userGreenCnt = response.data.good
          this.userYellowCnt = response.data.mixed
          this.userPurpleCnt = response.data.shit + response.data.bad
          this.display = response.data.display
          this.totalForPage = this.display * 50 > this.user_comments_num ? this.user_comments_num : this.display * 50
          // console.log(this.user_comments_num, this.totalForPage, this.display)

          var maxCnt = Math.max(this.userRedCnt, this.userGreenCnt, this.userYellowCnt, this.userPurpleCnt)

          if (window.screen.width < 992) {
            var totalLend = window.screen.width * 1.2
          } else if (window.screen.width < 1200) {
            var totalLend = 500
          } else {
            var totalLend = 600
          }
          var totalLen = Math.min(this.user_comments_num * 10, totalLend)

          this.userWidthRed = (this.userRedCnt / maxCnt) * totalLen + 'px'
          this.userWidthGreen = (this.userGreenCnt / maxCnt) * totalLen + 'px'
          this.userWidthYellow = (this.userYellowCnt / maxCnt) * totalLen + 'px'
          this.userWidthPurple = (this.userPurpleCnt / maxCnt) * totalLen + 'px'

          // console.log(this.userWidthPurple)
          this.userRating = response.data.rating
          // console.log('user len', this.userWidthRed, this.userWidthGreen, this.userWidthYellow, this.userWidthPurple)
          this.handleUserRating()

          this.ratio_errored = false

          // console.log(this.userRating)
        })
        .catch(error => {
          console.log(error)
          this.ratio_errored = true
        })
        .finally(() => this.ratio_loading = false)
    },
    handleMovieUserComments (id) {
      axios
      // .get(this.server_host + '/v1/comments/users/movie/' + id + '/page/' + this.page + '/')
        .get(this.server_host_java + '/v1/comments/movie/' + id + '?isCritic=0&page=' + this.page)
        .then(response => {
          this.user_comments = response.data
          this.errored = false

          if (this.page > 1 && this.user_comments.length == 0) {
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
    }

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
  }

  .user-comments-container{
    margin: 20px 0px;
  }
  .user-comments-rating-container{
    height: 120px;
    padding: 30px 60px 30px 10px;
  }
  .user-comments-rating{
    line-height: 60px;
    font-size: 1.8em;
    color: #8F8F8F;
    width: 60px;
    height: 60px;
    text-align: center;
    font-weight: 700;
    border: 3px solid #8F8F8F;
  }
  .user-comments-ratio{
    margin: 10px 0px 10px 20px;
    border-left: 2px solid grey;
  }
  .user-comments-type{
    height: 28px;
    line-height: 28px;
    position: relative;
  }
  .user-comments-ratio-line{
    vertical-align: center;
    height: 5px;
    position: absolute;
    top: 11.5px;
    left: 85px;
  }
  .user-comments-ratio-cnt{
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
    background-color: #4B0082;
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
    border: 2px solid #FF4A4A;
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
    border: 3px solid #4B0082;
    color: #4B0082;
  }
  .user-comments .ch-container{
    background-color: #F8FAF8;
  }
  .clear{
    clear:both;
  }
  .movie-img:hover, .title:hover{
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
