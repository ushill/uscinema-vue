<template>
  <div class="main container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
    <section v-if="user_errored">
      <div class="error_list">
        <p>{{error_content}}</p>
      </div>
    </section>
    <section v-else>
      <div v-if="user_loading">Loading...</div>

      <div v-else>
        <div class="col-xs-12 right">
          <div class="basic-info container">
            <div class="basic-info-left col-xs-2">
              <img v-if="user.id==global.user.id" class="image my-image" :src="image" @click=handleImage()>
              <img v-if="user.id!=global.user.id" class="image" :src="image">
              <div v-if="image_editing" class="image-window">
                <form enctype="multipart/form-data">
                  <span>请上传图片：</span>
                  <input type="file" id="imgLocal" accept="image/*" ref="user_image"/>
                  <button type="button" @click='handleSubmitImage'>&nbsp;&nbsp;提交&nbsp;&nbsp;</button>
                  <button type="button" @click='handleQuitImage'>&nbsp;&nbsp;取消&nbsp;&nbsp;</button>
                </form>
                <!-- <score-bar :myscore="my_score"></score-bar> -->
              </div>
            </div>
            <div class="basic-info-stat col-xs-4">
              <div class="user-comments-type"><div class="range">9 ~ 10：</div><div class="user-comments-ratio-line red" v-bind:style="{width: widthRed}">
                <div class="user-comments-ratio-cnt" v-if="redCnt!=0">{{this.redCnt}}</div></div>
              </div>
              <div class="user-comments-type"><div class="range">7 ~ 8 ：</div><div class="user-comments-ratio-line green" v-bind:style="{width: widthGreen}">
                <div class="user-comments-ratio-cnt" v-if="greenCnt!=0">{{this.greenCnt}}</div></div>
              </div>
              <div class="user-comments-type"><div class="range">5 ~ 6 ：</div><div class="user-comments-ratio-line yellow" v-bind:style="{width: widthYellow}">
                <div class="user-comments-ratio-cnt" v-if="yellowCnt!=0">{{this.yellowCnt}}</div></div>
              </div>
              <div class="user-comments-type"><div class="range">0 ~ 4 ：</div><div class="user-comments-ratio-line purple" v-bind:style="{width: widthPurple}">
                <div class="user-comments-ratio-cnt" v-if="purpleCnt!=0">{{this.purpleCnt}}</div></div>
              </div>
            </div>
            <div class="basic-info-right col-xs-6">
              <!-- <h2 v-if="user.id==global.user.id"><span class="nickname">我</span> 的个人主页</h2> -->
              <h2 v-if="user.nickname && handleStringCharLen(user.nickname) <= 12"><span class="nickname">{{user.nickname}}</span> <span class="nickname-t">的个人主页</span></h2>
              <h2 v-if="user.nickname && handleStringCharLen(user.nickname) <= 20 && handleStringCharLen(user.nickname) > 12"><span class="nickname nickname-m">{{user.nickname}}</span> <span class="nickname-m">的个人主页</span></h2>
              <h2 v-if="user.nickname && handleStringCharLen(user.nickname) >20"><span class="nickname nickname-b">{{user.nickname}}</span> <span class="nickname-b">的个人主页</span></h2>

              <div class="user-info">
                <span class="id">{{user.username}} / {{user.nickname}}</span>
                <span class="login-user-controll" v-if="user.id==global.user.id">
                  <span class="edit glyphicon glyphicon-edit" aria-hidden="true" @click=handleEdit()></span>
                  <span class="logout glyphicon glyphicon-log-out" aria-hidden="true" @click=handleLogout()></span>
                </span>

                <div v-if="editing" class="edit-window">
                  <form>
                    <span>昵称：</span>
                    <input type="input" name="iii" style="width:16.5em;" maxlength="16" v-model="editing_nickname">
                    <!-- <hr style='background-color:#339999; height:1px; border:none;'> -->
                    <button type="button" @click='handleSubmitEdit'>&nbsp;&nbsp;提交&nbsp;&nbsp;</button>
                    <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;还可以输入 {{512-my_comment_text_modifying.length}} 个字 -->
                    <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{post_status}}</span> -->

                    <button type="button" @click='handleQuitEdit'>&nbsp;&nbsp;取消&nbsp;&nbsp;</button>
                  </form>
                  <!-- <score-bar :myscore="my_score"></score-bar> -->
                </div>
              </div>

              <!-- <div class="logout" @click=handleLogout() v-if="user.id==global.user.id">[登出]</div> -->
              <router-link tag="div" class="user-logo" to="/critics" v-if="type=='critic'">⭐️作者</router-link>
            </div>
            <!-- <div class="basic-info-btm col-xs-12" v-if="user.id!=global.user.id">
                <span class="to-follow" v-if="!followed">关注此人</span>
                <span class="followed" v-if="followed">已关注</span>
                <span class="to-chat">私信</span>
            </div> -->
          </div>
          <!-- <div class="user-followed">
              <p class="item-head">
                  <span v-if="user.id!=global.user.id">{{user.nickname}}</span>
                  <span v-if="user.id==global.user.id">我</span>
                  关注的作者 <span class="item-head-lil"> (0)</span>
              </p>
              <hr>
              <p class="item-head">
                  <span v-if="user.id!=global.user.id">{{user.nickname}}</span>
                  <span v-if="user.id==global.user.id">我</span>
                  关注的用户 <span class="item-head-lil"> (0)</span>
              </p>
              <hr>
              <p class="item-head">
                  <span v-if="user.id!=global.user.id">{{user.nickname}}</span>
                  <span v-if="user.id==global.user.id">我</span>
                  的粉丝 <span class="item-head-lil"> (0)</span>
              </p>
              <hr>
          </div> -->
        </div>

        <div class="col-xs-12 left">

          <div class="movies">
            <div>
              <div class="item-head">
                <div v-if="page_loading">Loading...</div>
                <div v-else>
                  <div class="page-title">&nbsp;&nbsp;
                    <span v-if="user.id!=global.user.id">{{user.nickname}}</span>
                    <span v-if="user.id==global.user.id">我</span>
                    的院线电影
                    <router-link tag="span" :to="{name:'user_movies', params:{id:user.id}}" class="item-head-lil" v-if="req_type==2">
                      ( <span class="glyphicon glyphicon glyphicon-hand-right" aria-hidden="true"></span> &nbsp;{{comments_summary.total}} 部看过
                    </router-link>
                    <span class="item-head-lil-nclk" v-if="req_type==3">&nbsp;( {{comments_summary.total}} 部看过 </span>
                    <span class="avg" v-if="avg">&nbsp;平均评分: {{avg}} ）</span>
                    <span class="" v-if="!avg"> ）</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="movie-list" id="movie-list" v-if="req_type==2">

              <section v-if="page_errored">
                <div class="error_list">
                  <p>{{page_error_content}}</p>
                </div>
              </section>
              <section v-else>
                <div v-if="page_loading">Loading...</div>
                <div v-else>
                  <movie-short-item
                    v-for="(item, index) of comments"
                    :content="item"
                    :width="container_width"
                    :type="type"
                    :multi="2.0"
                  ></movie-short-item>
                  <!-- <div v-if="total">
                      <div class="more" @click="handlemore" v-if="comments_summary.has_next">查看更多</div>
                      <router-link tag="div" :to="{name:'user_movies', params:{id:user.id}}"  class="detail" v-if="!comments_summary.has_next">查看详情</router-link>
                      <div class="backto-top" @click="handletop"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></div>
                  </div> -->

                  <div class="showmore" v-if="total">
                    <div class="col-xs-4">
                      <div class="detail-more">
                        <span>
                            <router-link tag="span" :to="{name:'user_movies', params:{id:user.id}}" class="oneline">
                                <span class="glyphicon glyphicon-hand-right more-icon" aria-hidden="true"></span>
                            </router-link>
                            <router-link tag="div" :to="{name:'user_movies', params:{id:user.id}}" class="oneline">查看详情</router-link>
                        </span>
                      </div>
                    </div>
                    <div class="col-xs-4">
                      <div class="np-more" v-if="comments_summary.has_next">
                        <span @click="handlemore" >
                            <span class="glyphicon glyphicon-arrow-down more-icon" aria-hidden="true"></span>
                            <span class="oneline">查看更多</span>
                        </span>
                      </div>
                    </div>
                    <div class="col-xs-4 textright">
                      <div class="backto-top-div">
                        <span @click="handletop">
                            回到顶部
                            <span class="glyphicon glyphicon-arrow-up more-icon" aria-hidden="true"></span>
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

            </div>
            <div class="movie-list-detail" v-if="req_type==3">
              <router-link tag="div" :to="{name:'user', params:{id:user.id}}" class="backto-home"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>&nbsp;&nbsp; 回到 {{user.nickname}} 的个人主页</router-link>

              <section v-if="page_erroredM">
                <div class="error_list">
                  <p>{{page_error_contentM}}</p>
                </div>
              </section>
              <section v-else>
                <div v-if="page_loadingM">Loading...</div>
                <div v-else>

                  <movie-long-item
                    v-for="(item, index) of comments"
                    :content="item"
                    :width="container_width"
                    :multi="2.0"
                  ></movie-long-item>

                  <div class="page-area" v-if="total">
                    <v-pagination :total="total" :display="display" :curpage="page" @pagechange="pagechange"></v-pagination>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import axios from 'axios'
import MovieShortItem from './movie_short_item'
import MovieLongItem from './movie_long_item'
import pagination from './pagination'

export default {
  name: 'UserPage',
  components: {
    'movie-short-item': MovieShortItem,
    'movie-long-item': MovieLongItem,
    'v-pagination': pagination
  },
  watch: {
    '$route': 'handleRouteChange'
  },
  data () {
    return {
      msg: 'User',
      user: '',
      comments_summary: '',
      image: '',
      followed: false,
      container_width: '700px',
      page: 1,
      comments: [],
      req_type: 2,
      id: 0,
      page_loading: true,
      page_errored: false,
      page_loadingM: true,
      page_erroredM: false,
      page_error_contentM: '服务器开小差啦>_<',
      user_loading: true,
      user_errored: false,
      error_content: '服务器开小差啦>_<',
      page_error_content: '服务器开小差啦>_<',
      total: 0, // 记录总条数
      display: 10, // 每页显示条数
      page: 1,
      type: false,
      editing: false,
      editing_nickname: '',
      image_editing: false,
      widthRed: 0,
      widthGreen: 0,
      widthYellow: 0,
      widthPurple: 0,
      redCnt: 0,
      greenCnt: 0,
      yellowCnt: 0,
      purpleCnt: 0,
      avg: ''
    }
  },
  mounted () {
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    this.handleRouteChange()
  },
  methods: {
    pagechange: function (currentPage) {
      // console.log('pagechange', currentPage)
      this.$router.push('/user/' + this.user.id + '/movies?page=' + currentPage)
    },
    handleLogout () {
      if (confirm('\n\n真的要退出登录吗\n\n')) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user_id')
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        this.global.user = {id: '', username: '', nickname: '', image: '', is_critic: 0}
        this.global.token = ''
        this.$router.go(0)
      }
    },
    handleEdit () {
      if (this.user.id == this.global.user.id) {
        this.editing = true
      }
    },
    handleImage () {
      if (this.user.id == this.global.user.id) {
        this.image_editing = true
      }
    },
    handleQuitEdit () {
      this.editing = false
    },
    handleQuitImage () {
      this.image_editing = false
    },
    handleSubmitEdit () {
      if (this.editing_nickname.trim().length == 0) {
        alert('昵称不可为空')
        return
      }
      this.axios({
        method: 'post',
        url: this.server_host_java + '/v1/user/modify/info',
        headers: {
          'Authorization': 'Bearer ' + this.global.token,
          'Content-type': 'application/json;charset=utf-8'
        },
        data: {
          nickname: this.editing_nickname
        },
        transformRequest: [function (data) {
          var ret = ''
          for (var it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      }).then(response => {
        alert(response.data.message)
      })
        .catch(error => {
          console.log(error)
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
              // console.log(this.global)
            } else {
              alert(error.response.data.message)
            }
          } else {
            alert('服务器开小差啦>_<!')
          }
        })
        .finally(() => {
          this.editing_nickname = ''
          this.$router.go(0)
        })
    },
    handleSubmitImage () {
      // alert(this.$refs.user_image.files)
      // console.log(this.$refs.user_image.files)
      let file = this.$refs.user_image.files[0]
      if (!file) {
        alert('读取文件失败')
        return
      }

      if (file.size > 1024 * 1024 * 20) {
        alert('图片超过最大限制20M哟')
        return
      }
      let fileFormData = new FormData()
      fileFormData.append('file', file, file.name)// filename是键，file是值，就是要传的文件，test.zip是要传的文件名

      this.axios({
        method: 'post',
        url: this.server_host_java + '/v1/user/modify/image',
        headers: {
          'Authorization': 'Bearer ' + this.global.token,
          'Content-type': 'multipart/form-data'
        },
        data: fileFormData,
        processData: false, // 因为data值是FormData对象，不需要对数据做处理。
        contentType: false
      }).then(response => {
        if (response.data.result) {
          this.global.user.image = response.data.message
          sessionStorage.setItem('user_image', this.global.user.image)
          if (localStorage.getItem('user_image')) {
            localStorage.setItem('user_image', this.global.user.image)
          }
          alert('上传成功')
        } else {
          alert(response.data.message)
        }
      })
        .catch(error => {
          console.log(error)
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
            } else {
              alert(error.response.data.message)
            }
          } else {
            alert('服务器开小差啦>_<!')
          }
        })
        .finally(() => {
          this.$router.go(0)
        })
    },
    handleUserQuery () {
      this.id = this.$route.params.id
      var url = this.server_host_java + '/v1/user/' + this.id

      axios
        .get(url)
        .then(response => {
          console.log('r', response)
          this.user = response.data
          this.image = this.server_host_static + (this.user.image ? this.user.image : '')
          this.type = this.user.is_critic ? 'critic' : 'user'
          this.user_errored = false
          this.handleUserCommentsQuery()
          this.handleUserStat()
        })
        .catch(error => {
          console.log('e', error)
          this.user_errored = true
        })
        .finally(() => this.user_loading = false)
    },
    handleUserCommentsQuery () {
      this.id = this.$route.params.id
      var url = this.server_host_java + '/v1/comments/user/' + this.id + '?req_type=' + this.req_type + '&page=' + this.page
      if (this.req_type == 2) {
        this.page_errored = false
      } else {
        this.page_erroredM = false
        this.page_loadingM = true
      }

      axios
        .get(url)
        .then(response => {
          console.log('com', this.req_type, response)

          if (window.screen.width < 768) {
            this.container_width = $('#movie-list').width() / 0.54
          } else if (window.screen.width < 992) {
            this.container_width = $('#movie-list').width() / 0.97
          } else {
            this.container_width = $('#movie-list').width() * 0.84
          }
          // console.log('dd', window.screen.width)
          // if(window.screen.width < 768){
          //     this.container_width = $('#movie-list').width() / 0.54
          // }else if(window.screen.width < 992){
          //     this.container_width = $('#movie-list').width() / 0.97
          // }else{
          //     this.container_width = $('#movie-list').width()
          // }

          this.comments_summary = response.data
          if (this.req_type == 2) {
            this.comments = this.comments.concat(this.comments_summary.comments)
            console.log(this.comments_summary.comments)
            // console.log(this.comments)
            this.page_errored = false
            this.total = this.comments_summary.total
            // console.log('c', this.comments_summary)
            if (this.comments_summary.comments.length == 0 && this.comments_summary.total > 0) {
              this.page_errored = true
              this.page_error_content = '该页面不存在>_<'
            }
          } else {
            // console.log('comments change')
            this.comments = this.comments_summary.comments
            console.log('cmtsum', this.comments_summary)
            // console.log("cmts", this.comments)
            this.display = this.comments_summary.per_page
            this.total = this.comments_summary.total
            this.page = (this.$route.query.page ? parseInt(this.$route.query.page) : 1)
            // console.log('dtp', this.display, this.total, this.page)
            this.page_erroredM = false
            if (this.comments_summary.comments.length == 0 && this.comments_summary.total > 0) {
              this.page_erroredM = true
              this.page_error_contentM = '该页面不存在>_<'
            }
          }
        })
        .catch(error => {
          console.log(error)
          if (this.req_type == 2) {
            this.page_errored = true
            if (error.response && error.response.status == 400 && error.response.data.code == 10001) {
              this.page_error_content = '该页面不存在>_<'
            }
          } else {
            this.page_erroredM = true
            if (error.response && error.response.status == 400 && error.response.data.code == 10001) {
              this.page_error_contentM = '该页面不存在>_<'
            }
          }
        })
        .finally(() => {
          // console.log(this.req_type)
          this.page_loading = false
          this.page_loadingM = false
        })
    },
    handlemore () {
      this.page++
      this.handleUserCommentsQuery()
    },
    handletop () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    handleUserStat () {
      axios
        .get(this.server_host_java + '/v1/user/statistics/' + this.id)
        .then(response => {
          // console.log(response)
          if (response.data) {
            this.handleStat(response.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleStat (stat) {
      this.redCnt = stat.excellent
      this.greenCnt = stat.good
      this.yellowCnt = stat.mixed
      this.purpleCnt = stat.shit + stat.bad
      this.avg = stat.avg_score * 2

      if (window.screen.width < 992) {
        var totalLen = 320
      } else if (window.screen.width < 1200) {
        var totalLen = 600
      } else {
        var totalLen = 240
      }

      var maxCnt = Math.max(this.redCnt, this.greenCnt, this.yellowCnt, this.purpleCnt)
      this.widthRed = (this.redCnt / maxCnt) * totalLen + 'px'
      this.widthGreen = (this.greenCnt / maxCnt) * totalLen + 'px'
      this.widthYellow = (this.yellowCnt / maxCnt) * totalLen + 'px'
      this.widthPurple = (this.purpleCnt / maxCnt) * totalLen + 'px'
    },
    handleStringCharLen (str) {
      var len = 0
      if (!str) {
        return 0
      }
      // console.log('s',str, str.length)
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i)
        // console.log(i,c)
        // 单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++
          // console.log('t1',len)
        } else {
          len += 2
          // console.log('t2',len)
        }
        // console.log('t',len)
      }
      // console.log("len", len, str)
      return len
    },
    handleRouteChange () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      // console.log(this.$route)
      this.comments = []
      this.user = ''
      this.image = ''
      if (this.$route.path.slice(-7) == '/movies') {
        this.page = (this.$route.query.page ? parseInt(this.$route.query.page) : 1)
        this.req_type = 3
      } else {
        this.page = 1
        this.req_type = 2
      }
      this.handleUserQuery()
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
    padding: 0px;
  }
  .main{
    margin-top: 20px;
  }
  .basic-info{
    background-color: #2B2B2B;
    padding: 30px 50px 20px 30px;
    width: 100%;
    margin-top: 60px;
    margin-bottom: 10px;
    height: 220px;
    color: #F8F8F8;
  }
  .basic-info-right{
    text-align: right;
    padding-left: 5%;
  }
  .basic-info-right h2{
    font-size: 40px;
    font-family: "Helvetica Nenu", "微软雅黑", "华文细黑", "华文黑体";
    font-weight: 300;
    height: 40px;
    line-height: 10px;
  }
  .basic-info-right h2, .basic-info-right div{
    text-align: right;
  }
  .image, .my-image{
    height: 160px;
    max-width: 100%;
  }
  .to-follow, .to-chat{
    background-color: #F4F4F4;
    display: inline-block;
    padding: 1px 7px;
    border-radius: 8%;
    color: #FF6633;
    margin-top: 5px;
    font-size: 1em;
    font-weight: 500;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
  }
  .user-logo{
    color: #FFF8DC;
    margin-top: 5px;
    font-size: 1em;
    font-weight: 700;
    padding: 1px 7px;
    display: inline-block;
    background-color: #FF6A6A;
    border-radius: 1%;
    border-radius: 2%;
  }

  .to-follow, .to-chat{
    background-color: #339966;
    color: #DDEEDD;
  }
  .id, .followed{
    color: #FF6A6A;
  }
  .logout, .edit{
    color: #6FAB80;
  }
  .basic-info-btm{
    margin-top: 5%;
  }
  .basic-info-btm span{
    margin-right: 5px;
  }
  .item-head{
    color: #FEF2E2;
    font-size: 1.2em;
    font-weight: 500;
  }
  .item-head-lil, .item-head-lil-nclk{
    color: #F0F8FF;
    font-size: 0.9em;
    display: inline-block;
    margin-left: 5px;
    text-decoration: underline;
  }
  .item-head-lil-nclk{
    color: #FEF2E2;
    text-decoration: none;
  }
  .movies{
    margin: 30px 0%;
    width: 100%;
  }
  .movie-list{
    padding-top: 10px;
    width: 100%;
    background-color: #F8F8F8;
  }
  .nickname{
    color: #FF6A6A;
    font-size: 0.9em;
  }
  .nickname-t{
    font-size: 0.95em;
  }
  .nickname-m{
    font-size: 0.7em;
  }
  .nickname-b{
    font-size: 0.5em;
  }
  hr{
    margin: 30px 2px;
  }
  .item-head-lil:hover, .to-follow:hover, .to-chat:hover, .user-logo:hover, .my-image:hover, .more:hover, .detail:hover, .backto-home:hover, .logout:hover, .edit:hover, .backto-top:hover{
    cursor: pointer;
    color: #FFF64F;
  }
  .backto-home:hover{
    color: #FF8a8a;
  }
  .logout:hover, .edit:hover{
    position:relative;
  }
  .logout:hover:after, .edit:hover:after{
    content: "登出";
    position:absolute;
    left:-1em;
    top:1.5em;
    color: #111111;
    background-color: #ffffff;
    border: solid 1px #f0f0f0;
    padding: 0.5em;
    width: 3.3em;
    font-size: 1em;
    line-height: 1.2em;
    height: 2.4em;
  }
  .edit:hover:after{
    content: "编辑";
  }
  .more, .detail{
    background-color: #FF5A5A;
    text-align: center;
    line-height: 45px;
    height: 45px;
    width: 95%;
    margin: 25px 0px ;
    letter-spacing: 2px;
    font-size: 1.1em;
    color: #EEEEEE;
    font-weight: 500;
    box-shadow: 0 6px 10px 0 rgba(188, 205, 255, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
    display: inline-block;
  }
  .detail{
    background-color: #56D6AA;
    color: #F0FFF0;
  }
  .backto-top{
    display: inline-block;
    width: 4%;
    background-color: #FF5A5A;
    text-align: center;
    line-height: 40px;
    height: 40px;
    box-shadow: 0 6px 10px 0 rgba(188, 205, 255, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
    font-size: 1em;
    color: #EEEEEE;
    border-radius: 45%;
  }
  .backto-home{
    margin: 20px 5px 30px;
    color: #0066cc;
    line-height: 24px;
  }
  .error_list{
    height: 100%;
    font-size: 1.5em;
    text-align: center;
    padding-top: 10%;
  }
  .page-title{
    height: 45px;
    background-color: #FF6A6A;
    line-height: 45px;
    margin-bottom: 20px;
  }
  .user-info{
    margin: 10px 0;
    letter-spacing: 1px;
    position: relative;
  }
  .user-info span{
    padding-left: 4px;
  }
  .edit-window{
    display: inline-block;
    font-size: 1.2em;
    width: 28em;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    right: 0;
    border: solid 1px #F0FFFF;
    padding: 6px 0 6px 4px;
    color: #2B2B2B;
  }
  .edit-window input{
    font-size: 0.9em;
    padding: 2px 1px;
    margin: 8px 2px;
    border: solid 1px #ffaaaa;
  }
  .basic-info-left{
    position: relative;
  }
  .image-window{
    font-size: 1.2em;
    height: 100%;
    width: 240%;
    background-color: #ffffff;
    position: absolute;
    bottom: 0;
    left: 0;
    border: solid 1px #F0FFFF;
    padding: 10px 2px 10px 6px;
    color: #2B2B2B;
    line-height: 2em;
    border: solid 3px #FFE7BA;
    z-index: 999;
  }
  .image-window input{
    width: 90%;
    font-size: 0.9em;
    padding: 6px 2px;
    margin: 10px 2px;
    border: solid 1px #ffaaaa;
  }
  .image-window button, .edit-window button{
    background-color: #ff8a8a;
    border-color: #ff7a7a;
    color: #FFF5EE;
    font-weight: 500;
  }

  .avg{
    color: #FFFFFF;
    font-size: 0.8em;
    padding-left: 0.5em;
    padding-top: 4px;
    font-weight: 500;
  }
  .user-comments-type{
    height: 20%;
    line-height: 20%;
    position: relative;
    font-size: 1.03em;
  }
  .user-comments-ratio-line{
    vertical-align: center;
    height: 0.33em;
    position: absolute;
    top: -8%;
    left: 4em;
  }
  .user-comments-ratio-cnt{
    position: absolute;
    top: 1px;
    right: -2.2em;
    font-weight: 400;
    font-size: 0.9em;
    color: #ffaaaa;
  }
  .red{
    background-color: #FF5A6A;
  }
  .green{
    background-color: #00dd99 ;
  }
  .yellow{
    background-color: #EED422;
  }
  .purple{
    background-color: #BA55D3;
  }
  .range{
    min-width: 80px;
    margin-left: 0px;
    display: inline-block;
    font-weight: 500;
    color: #ffaaaa;
  }
  .basic-info-stat{
    padding: 1em 0 0 2em;
    height: 100%;
    margin-top: 2em;
  }
  .showmore{
    line-height: 45px;
    height: 45px;
    font-size: 1.25em;
    color: #ff5a5a;
    font-weight: 400;
    padding: 20px 20px 50px 20px;
  }
  .more-icon{
    font-size: 1.2em;
  }
  .showmore span:hover{
    cursor: pointer;
    color: #FFaaaa;
  }
  .np-more{
    text-align: center;
  }
  .oneline{
    display: inline-block;
  }
  .backto-top-div{
    text-align: right;
  }

  @media screen and (max-device-width: 992px) {
    .basic-info{
      height: 19em;
    }
    .image, .my-image{
      height: 14em;
      max-width: 14em;
    }
    .page-title{
      height: 3.0em;
      line-height: 3.0em;
      font-size: 1.8em;
      margin-bottom: 20px;
      color: #FFeeee;
    }
    .more, .detail{
      line-height: 3em;
      height: 3em;
      font-size: 1.8em;
      width: 92%;
    }
    .backto-top{
      line-height: 2.9em;
      height: 2.9em;
      font-size: 1.6em;
      width: 6%;
    }
    .user-comments-type{
      padding-left: 1em;
      font-size: 1.3em;
    }
    .user-comments-ratio-line{
      height: 0.45em;
      top: -0.15em;
      left: 5em;
    }
    .user-comments-ratio-cnt{
      position: absolute;
      top: 0.1em;
      right: -2.4em;
      font-weight: 400;
      font-size: 1.1em;
    }
    .user-info, .user-logo{
      font-size: 1.3em;
      line-height: 2em;
    }
    .showmore{
      line-height: 2em;
      height: 2em;
      font-size: 2.4em;
      padding: 1em 0.8em 2.2em 0.8em;
    }
    .more-icon{
      font-size: 1.2em;
    }
    .backto-home{
      font-size: 1.5em;
      line-height: 2em
    }
  }

</style>
