<template>
  <div class="MovieDetail container" :style="'width:'+appwid()+'px;margin:0 auto'">

    <section v-if="errored">
      <div class="error_list">
        {{error_content}}
      </div>
    </section>
    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div class="movie-head-bg" :style="'background:url('+poster_src+') center center / auto 700px'">
          <div class="movie-head-bg-shadow"></div>
          <div>
            <div class="movie-head-margin"></div>
            <div class="movie-head-container container">
              <div class="col-xs-1"></div>
              <div class="movie-head col-xs-6 container">
                <div class="head-bnm-btn" v-if="movie.bnm">Best New Movie</div>
                <span class="title">{{movie.title}} </span>
                <span class="year">({{movie.year}}) </span> <br>
                <p class="date">内地上映日期：{{movie.date}} </p>
                <hr/>
                <div class="head-rating">
                  <div class="head-rating-rating col-xs-4 col-md-4 col-lg-5">
                    <p class="head-rating-rating-title">UsCinema评分 </p>
                    <p class="head-rating-rating-count" v-html="rating_count_html"></p>
                  </div>

                  <div class="col-xs-2"><div class="head-uscc-rating" v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}">
                    <span>{{movie.rating}}</span></div>
                  </div>
                  <div class="col-xs-1"></div>
                  <div class="head-rating-rating col-xs-4"><p class="head-rating-rating-title">&nbsp; </p>
                    <p class="head-user-rating">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用户评分: &nbsp;&nbsp;<span class="head-user-rating-span" v-bind:class="{'grade1': isusergrade1, 'grade2': isusergrade2, 'grade3': isusergrade3, 'grade4': isusergrade4}">
                                            <span>{{userRating}}</span></span>
                    </p>
                  </div>
                </div>

                <hr/>

                我的评分：<br>
                <div class="my-score-container">
                  <score-bar :myscore="my_score" @scorechange="handleNewScore"></score-bar>
                  <div class="no-score" @click="handleNewScore(my_score)"><span>评论</span></div>
                </div>

              </div>
              <div class="col-xs-1"></div>
              <div class="col-xs-3"><img class="movie-img" :src="poster_src"></div>
            </div>
            <div class="movie-head-margin"></div>
          </div>
        </div>
        <div v-if="cur_user_id&&my_comment" class="my-comment">
          <span class="del-comment" @click="handleDelComment">[删除]</span>
          <div class="my-comment-title">我的评论：</div>
          <div class="my-comment-text" v-if="my_comment_text" @click="handleNewComment">{{my_comment_text}}</div>
          <div class="my-comment-text" v-else @click="handleNewComment">未填写评论</div>
        </div>

        <div class="movie-info-container">
          <h1>影片信息</h1>
          <div class="movie-info">
            <p v-if="movie.directors_name">导演： {{movie.directors_name}}</p>
            <p v-if="movie.screenplayers_name">编剧： {{movie.screenplayers_name}}</p>
            <p v-if="movie.actors_name">主演： {{movie.actors_name}}</p>
            <p v-if="movie.runtime">片长： {{movie.runtime}}</p>
            <p v-if="movie.genres">类型： {{movie.genres}}</p>
            <p v-if="movie.nickname">又名： {{movie.nickname}}</p>
            <p v-if="movie.release_dates">国际上映时间： {{movie.release_dates}}</p>
            <p v-if="movie.imdb">IMDB： {{movie.imdb}}</p>

            <div class="summary"><p class="summary-title">剧情简介 </p>
              <div v-html="movie.summary"></div>
            </div>
          </div>
        </div>
        <div class="critic-comments-container">
          <h1>作者评价</h1>

          <section v-if="erroredCR">
          </section>
          <section v-else>
            <div v-if="loadingCR">Loading...</div>
            <div v-else>
              <div class="critic-comments">
                <div class="ch-container col-xs-12">
                  <div class="col-xs-1 critic-comments-rating-container">
                    <div class="critic-comments-rating" v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}">
                      <span>{{movie.rating}}</span>
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
            </div>
          </section>

        </div>

        <div class="clear"></div>

        <section v-if="erroredCS">
          <div class="error_list">
            {{error_contentCS}}
          </div>
        </section>
        <section v-else>
          <div v-if="loadingCS">Loading...</div>
          <div v-else>
            <ul class=""><comment-item
              v-for="(item, index) of critic_comments"
              :content="item"
              :index="index"
              :key="index"
              :type="critic"
            ></comment-item>
            </ul>
          </div>
        </section>

        <div class="clear"></div>
        <br><br>

        <section v-if="erroredCR">
          <router-link tag="a" class="critic-more" :to="{name:'critic_comments', params:{id:this.movie.id}}">
            <span class="" v-if="showMore"> <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span> &nbsp; 查看全部作者评论</span>
          </router-link>
        </section>
        <section v-else>
          <div v-if="loadingCR">Loading...</div>
          <div v-else>
            <router-link tag="a" class="critic-more" :to="{name:'critic_comments', params:{id:this.movie.id}}">
              <span class="" v-if="showMore"> <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span> &nbsp; 查看全部 {{this.critic_comments_num}} 条作者评论</span>
            </router-link>
          </div>
        </section>

        <br>
        <div class="user-comments-container">
          <h1>用户评价</h1>

          <section v-if="erroredUR">
          </section>
          <section v-else>
            <div v-if="loadingUR">Loading...</div>
            <div v-else>
              <div class="user-comments">
                <div class="ch-container col-xs-12">
                  <div class="col-xs-1 user-comments-rating-container">
                    <div class="user-comments-rating" v-bind:class="{'grade1': isusergrade1, 'grade2': isusergrade2, 'grade3': isusergrade3, 'grade4': isusergrade4}">
                      <span>{{userRating}}</span>
                    </div>
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
            </div>
          </section>
        </div>

        <div class="clear"></div>
        <section v-if="erroredUS">
          <div class="error_list">
            {{error_contentUS}}
          </div>
        </section>
        <section v-else>
          <div v-if="loadingUS">Loading...</div>
          <div v-else>
            <ul class=""><user-comment-item
              v-for="(item, index) of user_comments"
              :content="item"
              :index="index"
              :key="index"
              :type="user"
            ></user-comment-item>
            </ul>
          </div>
        </section>
        <!-- num: {{critic_comments_num}} <br><br><br> -->

        <div class="clear"></div>
        <br><br>

        <section v-if="erroredUR">
          <router-link tag="a" class="user-more" :to="{name:'user_comments', params:{id:this.movie.id}}">
            <span class="" > <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span> &nbsp; 查看全部用户评论</span>
          </router-link>
        </section>
        <section v-else>
          <div v-if="loadingUR">Loading...</div>
          <div v-else>
            <router-link tag="a" class="user-more" :to="{name:'user_comments', params:{id:this.movie.id}}">
              <span class="" > <span class="glyphicon glyphicon-hand-right" aria-hidden="true"></span> &nbsp; {{this.user_rating_count_html}}</span>
            </router-link>
          </div>
        </section>

        <br><br>

        <div v-if="change_score" class="change-score-window">
          <div class="change-score-window-close" @click='handleCloseChange'>x</div>
          <form>我的评分：&nbsp;
            <select v-model="my_score_modifying">
              <option :value="score" v-for="score in [0,1,2,3,4,5,6,7,8,9,10,null]">{{score}}</option>
            </select>
            <hr style='background-color:#339999; height:1px; border:none;'>
            <textarea width="20px" rows="7" style="resize:none;width:96%;margin:0 0 1.5em 0;line-height:1.8em;" maxlength="512" v-model="my_comment_text_modifying"></textarea><br>
            <button type="button" class="submitbut" @click='handleSubmitComment'>&nbsp;&nbsp;提交&nbsp;&nbsp;</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;还可以输入 {{512-my_comment_text_modifying.length}} 个字
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{post_status}}</span>
          </form>
          <!-- <score-bar :myscore="my_score"></score-bar> -->
        </div>

        <div v-if="need_login" class="change-score-window">
          <div class="change-score-window-close" @click='handleCloseChange'>x</div>
          <div class="change-score-window-login">
            <span>请先
              <router-link tag="span" to="/login">
                <span class="goto-login" @click='updateRouteBeforeLogin'>登录</span>
              </router-link>
            </span>
          </div>
          <!-- <score-bar :myscore="my_score"></score-bar> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import CommentItem from '../components/comment_item'
import UserCommentItem from '../components/user_comment_item'
import ScoreBar from '../components/score_bar'

export default {
  name: 'MovieDetail',
  props: [],
  components: {
    'comment-item': CommentItem,
    'user-comment-item': UserCommentItem,
    'score-bar': ScoreBar
  },
  watch: {
    '$route': 'handleRouteChange'
  },
  data () {
    return {
      msg: 'MovieDetail',
      id: undefined,
      movie: 1,
      critic: 'critic',
      user: 'user',
      critic_comments: [],
      critic_comments_num: 0,
      user_comments: [],
      user_comments_num: 0,
      poster_src: '',
      bg_img: '',
      isgrade1: false,
      isgrade2: false,
      isgrade3: false,
      isgrade4: false,
      rating_count_html: '',
      widthRed: 0,
      widthGreen: 0,
      widthYellow: 0,
      widthPurple: 0,
      redCnt: 0,
      greenCnt: 0,
      yellowCnt: 0,
      purpleCnt: 0,
      showMore: true,
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
      cur_user_id: 0,
      my_comment: 1,
      my_score: null,
      my_comment_text: '',
      change_score: false,
      need_login: false,
      my_comment_text_modifying: '',
      my_score_modifying: null,
      errored: false,
      loading: true,
      error_content: '服务器开小差啦>_<',
      erroredCS: false,
      loadingCS: true,
      error_contentCS: '服务器开小差啦>_<',
      erroredCR: false,
      loadingCR: true,
      error_contentCR: '服务器开小差啦>_<',
      erroredUS: false,
      loadingUS: true,
      error_contentUS: '服务器开小差啦>_<',
      erroredUR: false,
      loadingUR: true,
      error_contentUR: '服务器开小差啦>_<',
      post_errored: false,
      post_status: ''
    }
  },
  mounted () {
    this.handleRouteChange()
  },
  methods: {
    handleRouteChange () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      console.log('set', window.pageYOffset)
      this.handleMovieQuery()
    },
    updateRouteBeforeLogin () {
      if (this.$route.fullPath != '/login') {
        this.global.route_before_login = this.$route.fullPath
        // console.log('route_before_login:', this.global.route_before_login)
      }
    },
    handleMovieQuery () {
      this.id = this.$route.params.id
      this.cur_user_id = this.global.user.id ? this.global.user.id : 0

      axios
      // .get(this.server_host + '/v1/movies/movie_details/' + this.id + '/' + this.cur_user_id + '/')
        .get(this.server_host_java + '/v1/movie/detail/' + this.id + '/')
        .then(response => {
          // console.log(response.data.id)
          // this.display = parseInt(response.data.per_page)
          // this.total = parseInt(response.data.total)
          // console.log(this.display, this.total)
          this.movie = response.data.movie
          this.poster_src = this.server_host_static + this.movie.image
          this.errored = false
          this.handlerating()
          if (this.global.token) {
            this.handleMyComment(this.global.token)
          }
          this.handleMovieCriticCommentsRatio(this.id)
          this.handleMovieCriticCommentsSummary(this.id)
          this.handleMovieUserCommentsRatio(this.id)
          this.handleMovieUserCommentsSummary(this.id)
        })
        .catch(error => {
          this.errored = true
          if (error.response) {
            console.log(error.response)
            if (error.response.status == 400 || (error.response.status == 404 && error.response.data.code == 20001)) {
              this.error_content = '该页面不存在>_<'
            }
          }
        })
        .finally(() => this.loading = false)
    },
    handleMyComment (token) {
      this.id = this.$route.params.id
      this.axios({
        method: 'get',
        url: this.server_host_java + '/v1/comment/my/movie/' + this.id,
        headers: {
          // 'Authorization': 'basic ' + Base64.encode(this.global.token+':'),
          'Authorization': 'Bearer ' + token,
          'Content-type': 'application/json;charset=utf-8'
        }
      }).then(response => {
        // console.log(response)
        if (response.data.is_commented) {
          this.my_comment = response.data.my_comment
          console.log('my', this.my_comment)
          if (this.my_comment) {
            this.my_score = (this.my_comment.score == '0.0' ? 0 : parseFloat(this.my_comment.score) * 2.0)
            this.my_comment_text = this.my_comment.comment
            this.my_comment_text_modifying = this.my_comment_text
          }
          console.log('my_score', this.my_score)
        } else {
          this.my_comment = null
        }
      })
        .catch(error => {
          console.log(error)
          this.post_status = '提交失败'

          if (error.response) {
            console.log(error.response)
            if (error.response.data.code == 10005 || error.response.data.code == 10006 || error.response.data.code == 10004) {
              alert('登录已过期，请重新登录')
              sessionStorage.removeItem('token')
              sessionStorage.removeItem('user_id')
              localStorage.removeItem('token')
              localStorage.removeItem('user_id')
              this.global.user = {id: '', username: '', nickname: '', image: '', is_critic: 0}
              this.global.token = ''
              this.my_comment = null
              console.log(this.global)
            }
          }
        })
    },
    handlerating () {
      this.isgrade1 = this.isgrade2 = this.isgrade3 = this.isgrade4 = false
      if (!this.movie.rating || this.movie.rating == 'tbd') {
        this.movie.rating = 'tbd'
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
    },
    handleNewScore (new_score) {
      if (this.cur_user_id == 0) {
        this.need_login = true
        return
      }
      this.my_score_modifying = new_score
      // console.log('new', new_score)
      this.change_score = true
    },
    handleNewComment () {
      this.my_score_modifying = this.my_score
      // console.log('new', new_score)
      this.change_score = true
    },
    handleCloseChange () {
      this.change_score = false
      this.post_status = ''
      this.need_login = false
      this.my_comment_text_modifying = this.my_comment.comment
    },
    handleSubmitComment () {
      if (isNaN(this.my_score_modifying)) {
        console.log(this.my_score_modifying)
        this.my_score_modifying = null
        console.log(this.my_score_modifying)
      }
      console.log(this.my_score_modifying)
      this.axios({
        method: 'post',
        url: this.server_host_java + '/v1/comment/my/movie/' + this.id,
        headers: {
          // 'Authorization': 'basic ' + Base64.encode(this.global.token+':'),
          'Authorization': 'Bearer ' + this.global.token,
          'Content-type': 'application/json;charset=utf-8'
        },
        data: {
          score: this.my_score_modifying,
          comment: this.my_comment_text_modifying
        },
        transformRequest: [function (data) {
          var ret = ''
          for (var it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      }).then(response => {
        // console.log('f')
        this.post_status = response.data.message
        alert(this.post_status)
        if (response.data.result) {
          this.$router.go(0)
        }
      })
        .catch(error => {
          // console.log('u')
          // console.log(error)
          if (!error.response) {
            // console.log(error.data)
            this.post_status = '提交失败'
          } else {
            console.log(error.response)
            if (error.response.data.code == 10005 || error.response.data.code == 10006 || error.response.data.code == 10004) {
              alert('登录已过期，请重新登录')
              sessionStorage.removeItem('token')
              sessionStorage.removeItem('user_id')
              localStorage.removeItem('token')
              localStorage.removeItem('user_id')
              this.global.user = {id: '', username: '', nickname: '', image: '', is_critic: 0}
              this.global.token = ''
              // this.need_login = true
              console.log(this.global)
            }
            this.post_status = error.response.data.message
          }
        })
    },
    handleDelComment () {
      var del = confirm('\n\n确认删除吗\n\n')
      if (del) {
        this.axios({
          method: 'post',
          url: this.server_host_java + '/v1/comment/my/movie/' + this.id,
          headers: {
            // 'Authorization': 'basic ' + Base64.encode(this.global.token+':'),
            'Authorization': 'Bearer ' + this.global.token,
            'Content-type': 'application/json;charset=utf-8'
          },
          data: {
            score: -1,
            comment: ''
          },
          transformRequest: [function (data) {
            var ret = ''
            for (var it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }]
        }).then(response => {
          console.log(response.data.message)
          alert(response.data.message)
          this.$router.go(0)
        })
          .catch(error => {
            console.log(error)
            if (error.response) {
              if (error.response.data.code == 10005 || error.response.data.code == 10006 || error.response.data.code == 10004) {
                alert('登录已过期，请重新登录')
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('user_id')
                localStorage.removeItem('token')
                localStorage.removeItem('user_id')
                this.global.user = {id: '', username: '', nickname: '', image: '', is_critic: 0}
                this.global.token = ''
                // this.need_login = true
                console.log(this.global)
              } else {
                alert(error.response.data.message)
              }
            } else {
              alert('服务器开小差啦>_<')
            }
            this.$router.go(0)
          })
      }
    },
    handleMovieCriticCommentsSummary (id) {
      axios
        .get(this.server_host_java + '/v1/comments/summary/movie/' + id)
        .then(response => {
          // console.log(response.data)
          this.critic_comments = response.data
          this.erroredCS = false
        })
        .catch(error => {
          this.erroredCS = true
        })
        .finally(() => this.loadingCS = false)
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
            var totalLend = window.screen.width * 1.4
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

          if (this.critic_comments_num < response.data.summary) {
            this.showMore = false
          }
          this.erroredCR = false
        })
        .catch(error => {
          console.log(error)
          this.erroredCR = true
        })
        .finally(() => this.loadingCR = false)
    },
    handleUserRating () {
      this.isusergrade1 = this.isusergrade2 = this.isusergrade3 = this.isusergrade4 = false
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

          if (window.screen.width < 992) {
            var totalLend = window.screen.width * 1.4
          } else if (window.screen.width < 1200) {
            var totalLend = 500
          } else {
            var totalLend = 600
          }

          var maxCnt = Math.max(this.userRedCnt, this.userGreenCnt, this.userYellowCnt, this.userPurpleCnt)
          var totalLen = Math.min(this.user_comments_num * 10, totalLend)
          this.userWidthRed = (this.userRedCnt / maxCnt) * totalLen + 'px'
          this.userWidthGreen = (this.userGreenCnt / maxCnt) * totalLen + 'px'
          this.userWidthYellow = (this.userYellowCnt / maxCnt) * totalLen + 'px'
          this.userWidthPurple = (this.userPurpleCnt / maxCnt) * totalLen + 'px'
          this.userRating = response.data.rating
          // console.log('user len', this.userWidthRed, this.userWidthGreen, this.userWidthYellow, this.userWidthPurple)
          this.handleUserRating()

          this.erroredUR = false
        })
        .catch(error => {
          console.log(error)
          this.erroredUR = true
        })
        .finally(() => this.loadingUR = false)
    },
    handleMovieUserCommentsSummary (id) {
      axios
        .get(this.server_host_java + '/v1/comments/summary/movie/' + id + '?isCritic=0')
        .then(response => {
          // console.log('user sum', response)
          this.user_comments = response.data
          this.erroredUS = false
        })
        .catch(error => {
          console.log(error)
          this.erroredUS = true
        })
        .finally(() => this.loadingUS = false)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .nowplaying{
    height: 700px;
  }
  .movie-head-bg{
    width: 100%;
    min-height: 450px;
    position: relative;
  }
  .movie-head-bg-shadow{
    width: 100%;
    height: 100%;
    background-color: #8899AA;
    opacity: 0.7;
    position: absolute;
  }
  .movie-head-margin{
    height: 50px;
  }
  .movie-head{
    background-color: #101010;
    opacity: 0.8;
    color: white;
    padding: 20px 30px;
    font-size: 1.1em;
    position: relative;
    min-width: 500px;
    min-height: 354px;
    box-shadow: 1px 2px 4px 0px rgba(255, 255, 255, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  img.movie-img{
    max-height: 350px;
    border: solid #F0F8FF;
    border-width: 7px 9px;
    box-shadow: 1px 2px 8px 1px rgba(0, 0, 0, 0.6), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  @media screen and (max-device-width: 992px) {
    .movie-head{
      font-size: 1.2em;
      min-width: 580px;
      line-height: 2.4em;
    }
    img.movie-img{
      min-height: 360px;
    }
  }

  *{
    text-align: left;
  }
  span.title{
    font-size: 2.2em;
    color: #ff6a6a;
    line-height: 42px;
  }
  span.year{
    font-size: 1.6em;
    color: #ff6a6a;
    display:inline-block;zoom:1;
  }
  p.date{
    font-size: 1em;
    line-height: 16px;
    margin-top: 10px;
    color: #fff0f0;
  }
  .head-rating{
    height: 80px;
  }
  .head-rating-rating{
    line-height: 30px;
    padding-top: 10px;
    padding-left: 0px;
    font-size: 1.3em;
  }
  .head-rating-rating-count{
    font-size: 0.7em;
  }
  .head-uscc-rating{
    margin: 10px;
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
  .head-bnm-btn{
    background-color: rgba(255,75,75,1);
    text-align:center;
    font-size: 1em;
    opacity: 1;
    border: 1px solid #EE9090;
    color: #FFFAF0;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0.1em 0.8em;
    position: absolute;
    top: -2.4em;
    left: 0em;
  }
  @media screen and (max-device-width: 992px) {
    p.date{
      font-size: 1.1em;
    }
    .head-rating-rating-count{
      font-size: 0.8em;
    }
    span.title{
      font-size: 1.9em;
      line-height: 2em;
    }
    .head-bnm-btn{
      font-size: 0.9em;
      line-height: 2.2em;
      padding: 0em 0.8em;
      top: -2.6em;
      left: 0em;
      border-radius: 0;
    }
  }
  .movie-info-container{
    margin-top: 10px;
    line-height: 26px;
  }
  h1{
    display: inline-block;
    padding: 5px 10px 5px 0px;
    border-bottom: 2px solid #808080;
    color: #808080;
    font-size: 2.5em;
  }
  .movie-info{
    background-color: #F8F8F8;
    margin-top: 10px;
    padding: 10px;
    font-size: 1.1em;
    line-height: 2em;
    letter-spacing: 0.1px;
  }
  @media screen and (max-device-width: 992px) {
    .movie-info{
      font-size: 2.2em;
    }
    h1{
      font-size: 3.5em;
      padding: 15px 20px 15px 0px;
    }
  }
  .my-comment{
    background-color: #F8F8FF;
    margin-top: 20px;
    padding: 10px;
    color: #4a4a4a;
    font-size: 1em;
    line-height: 2em;
    position: relative;
  }
  .my-comment-title{
    display: inline-block;
    font-size: 1.2em;
    color: #FF8A8A;
    font-weight: 500;
    padding: 5px 5px 2px 0px;
    margin-bottom: 10px;
    border-bottom: 2px solid #ffaaaa;
  }
  .summary{
    margin-top: 20px;
    line-height: 2em;
    font-size: 0.95em;
  }
  .summary-title{
    color: #ff8a8a;
    font-size: 1.3em;
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
  .user-comments-rating{
    line-height: 60px;
    width: 60px;
    height: 60px;
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
  @media screen and (max-device-width: 992px) {
    .critic-comments-type,.user-comments-type{
      height: 35px;
      line-height: 35px;
    }
    .critic-comments-ratio-line,.user-comments-ratio-line{
      height: 3px;
      top: 16.5px;
    }
    .critic-comments-ratio-cnt,.user-comments-ratio-cnt{
      top: -14px;
      right: -55px;
    }
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
    background-color: #F6FBFA;
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
  .user-comments-rating{
    border-radius: 0;
    border-width: 2px;
  }
  .critic-comments .ch-container, .user-comments .ch-container{
    background-color: #F8FAF8;
  }
  .clear{
    clear:both;
  }
  .user-more, .critic-more{
    display: block;
    text-align: right;
    font-size: 20px;
    font-weight: 500;
    color: #FF8a8a;
  }
  .head-user-rating-span{
    border: none;
  }
  .head-user-rating{
    font-size: 0.8em;
  }
  .change-score-window{
    position: fixed;
    top: 30%;
    left: 30%;
    background-color: #F0F8FF;
    height: 40%;
    width: 35%;
    min-width: 400px;
    min-height: 320px;
    z-index: 999999;
    border-width: 2px;
    padding: 15px;
    border-radius: 1%;
    box-shadow: 1px 1px 1px 1px rgba(250, 100, 190, 0.1);
  }
  .change-score-window-login{
    padding-top: 20%;
    font-size: 1.4em;
    text-align: center;
  }
  .change-score-window-close:hover, .my-comment-text:hover, .del-comment:hover{
    cursor: pointer;
    color: #ff4a4a;
  }
  .my-comment-text:hover{
    color: #2a2a2a;
  }
  .change-score-window-close{
    position: fixed;
    top: 31%;
    left: 63%;
    border-radius: 50%;
    border: 1px solid #666666;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 18px;
    font-size: 16px;
  }
  .goto-login{
    cursor: pointer;
    color: #0099cc;
  }
  .del-comment{
    color: #ff8a8a;
    font-size: 1em;
    position: absolute;
    top: 1em;
    right: 1em;
  }
  .error_list{
    min-height: 120px;
    line-height: 120px;
    height: 100%;
    width: 100%;
    font-size: 1.5em;
    text-align: center;
    padding-top: 10%;
  }
  .head-rating-rating-title{
    color: #ffaaaa;
  }
  .my-score-container{
    position: relative;
  }
  .no-score{
    width: 50px;
    height: 24px;
    line-height: 26px;
    background-color: #2a2a2a;
    position: absolute;
    top: -1px;
    right: 0px;
    text-align: center;
    font-weight: 500;
    color: #f2f2f2;
  }
  .no-score:hover{
    cursor: pointer;
    background-color: #ff6a6a;
    color: #FFFAF0;
  }
  @media screen and (max-device-width: 992px) {
    .MovieDetail, .movie-head-container{
      margin: 0;
      width: 100%;
    }
    .change-score-window{
      top: 30%;
      left: 30%;
      height: 20%;
      min-height: 300px;
      font-size: 1.5em;
    }
    .user-more, .critic-more{
      font-size: 2em;
    }
    .no-score{
      height: 2.2em;
      line-height: 2.4em;
      right: 0px;
    }
    .my-comment{
      font-size: 1.9em;
    }
    .change-score-window{
      top: 20%;
      left: 10%;
      background-color: #F0F8FF;
      height: 20em;
      width: 80%;
      font-size: 3em;
      padding: 1em;
    }
    .change-score-window-close{
      top: 21%;
      left: 84%;
      border: 1px solid #ff4a4a;
      width: 2em;
      height: 2em;
      line-height: 2em;
      font-size: 0.7em;
      color: #ff4a4a;
    }
    .submitbut{
      line-height: 1.6em;
      border: 1px solid #ff4a4a;
      background-color: #ffbaba;
    }
    .critic-comments-ratio-line,.user-comments-ratio-line{
      height: 0.5em;
    }
    .critic-comments-rating-container,.user-comments-rating-container{
      padding-top: 3em;
    }
    select{
      font-size: 0.5em;
      height: 2em;
      line-height: 2em;
    }
  }

</style>
