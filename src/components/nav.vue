<template>
  <div class="Nav">
    <div class="searching" v-if="searchflag">
      <div class="searching-bar container">
        <div class="col-xs-2"></div>
        <div class="col-xs-8 search-area">
          <!-- <div class="headerBox" v-if="!focused"></div> -->
          <input v-focus type="" name="" v-model="search_value" placeholder="search" class="search-input" maxlength="48" @keypress=handleKeyPress($event)>
          <!-- @focus=handleFocus(true) @blur=handleFocus(false) @keyup="handleAutoSearch()" -->
          <router-link tag="div" :to="{name:'search', query:{para:search_para_encoded}}">
            <div class="all-res" v-show="searched" @click=handleSearchFlag(false)>点击进行精确搜索</div>
          </router-link>

        </div>
        <div class="col-xs-2 search-close-container">
          <div class="search-close" @click=handleSearchFlag(false)>x</div>
        </div>
      </div>
      <div class="searching-res" v-if="!searched" @click=handleSearchFlag(false)></div>
      <div class="searching-res searching-res-searched container" v-if="searched">
        <div class="col-xs-2"></div>
        <div class="col-xs-6 searching-res-movies">
          <h3>电影</h3>

          <section v-if="errored">
            <div class="error_list">
              <p>{{error_content}}</p>
            </div>
          </section>

          <section v-else>
            <div v-if="loading">Loading...</div>

            <div v-else class="searching-res-content">
              <ul v-if="big"><li
                v-for="(item, index) of fast_search_movies" v-if="item.match_type==1" class="col-xs-6 searching-res-li">
                <router-link tag="span" :to="{name:'movie', params:{id:item.id}}">
                  <span class="search-res-words" @click=handleSearchFlag(false)><span class="searching-res-main" v-html="item.title_html"></span>
                    <span class="searching-res-sub"> ( {{item.year}} )</span>
                  </span>
                </router-link>
              </li>
              </ul>
              <ul v-if="!big"><li
                v-for="(item, index) of fast_search_movies" v-if="item.match_type==1" class="col-xs-12 searching-res-li">
                <router-link tag="span" :to="{name:'movie', params:{id:item.id}}">
                  <span class="search-res-words" @click=handleSearchFlag(false)><span class="searching-res-main" v-html="item.title_html"></span>
                    <span class="searching-res-sub"> ( {{item.year}} )</span>
                  </span>
                </router-link>
              </li>
              </ul>
              <ul><li
                v-for="(item, index) of fast_search_movies" v-if="item.match_type>=2" class="col-xs-12 searching-res-li">
                <router-link tag="span" :to="{name:'movie', params:{id:item.id}}">
                  <span class="search-res-words" @click=handleSearchFlag(false)><span class="searching-res-main" v-html="item.title_html"></span>
                    <span class="searching-res-sub"> ( {{item.year}} )</span>
                    <span v-if="item.match_type==2"> / </span>
                    <span v-if="item.match_type==2" v-html="item.nickname_html"></span>
                    <span v-if="item.match_type==3" class="searching-res-sub" v-html="item.directors_html"></span>
                    <span v-if="item.match_type==4" class="searching-res-sub" v-html="item.actors_html"></span>
                  </span>
                </router-link>
              </li></ul>
              <div v-if="!fast_search_movies.length" class="searching-res-li no-res">没有搜索到结果</div>
            </div>

          </section>
        </div>

        <div class="col-xs-2 searching-res-users">
          <div class="searching-res-critics">
            <h3>作者</h3>

            <section v-if="errored">
              <div class="error_list">
                <p>{{error_content}}</p>
              </div>
            </section>

            <section v-else>
              <div v-if="loading">Loading...</div>

              <div v-else class="searching-res-content">
                <ul><li
                  v-for="(item, index) of fast_search_critics" class="searching-res-li">
                  <router-link tag="span" :to="{name:'user', params:{id:item.id}}">
                    <span class="search-res-words" @click=handleSearchFlag(false)><span class="searching-res-main" v-html="item.nickname_html"></span>
                      <span class="searching-res-sub"> ( {{item.id}} )</span></span>
                  </router-link>
                </li></ul>
                <div v-if="!fast_search_critics.length" class="searching-res-li no-res">没有搜索到结果</div>
              </div>

            </section></div>

          <h3>用户</h3>

          <section v-if="errored">
            <div class="error_list">
              <p>{{error_content}}</p>
            </div>
          </section>

          <section v-else>
            <div v-if="loading">Loading...</div>

            <div v-else class="searching-res-content">
              <ul><li
                v-for="(item, index) of fast_search_users" class="searching-res-li">
                <router-link tag="span" :to="{name:'user', params:{id:item.id}}">
                  <span class="search-res-words" @click=handleSearchFlag(false)><span class="searching-res-main" v-html="item.nickname_html"></span>
                      <span class="searching-res-sub"> ( {{item.id}} )</span></span>
                </router-link>
              </li>
              </ul>
              <div v-if="!fast_search_users.length" class="searching-res-li no-res">没有搜索到结果</div>
            </div>

          </section>
        </div>
        <div class="col-xs-2"></div>
      </div>
    </div>
    <div class="container nav-container" v-show="huge_show">
      <div class="nav-left col-xs-1"></div>
      <div class="nav-center col-xs-10">
        <router-link tag="div" class="nav-title-container" to="/"><img :src="server_host_static + '/static/logo.jpeg'" class="logo-big"></router-link>
        <div class="nav-items">
          <!-- <div class="col-xs-1"></div> -->
          <div class="col-xs-12">
            <router-link tag="div" class="nav-item col-xs-2 col-xs-push-1" to="/movies/all">
              <span class="nav-link">院线综评</span>
            </router-link>
            <router-link tag="div" class="nav-item col-xs-2 col-xs-push-1" to="/movies/coming_soon">
              <span class="nav-link">即将上映</span>
            </router-link>
            <router-link tag="div" class="nav-item col-xs-2 col-xs-push-1" to="/movies/top">
              <span class="nav-link">最佳新电影</span>
            </router-link>
            <router-link tag="div" class="nav-item col-xs-2 col-xs-push-1" to="/movies/top">
              <span class="nav-link">排行榜</span>
            </router-link>
            <router-link tag="div" class="nav-item col-xs-2 col-xs-push-1" to="/critics">
              <span class="nav-link">作者&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </router-link>
          </div>
        </div>
      </div>

      <div class="nav-right col-xs-1">
        <div class="search"><span @click=handleSearchFlag(true) class="search-btn">
          <span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
        </div>
        <div class="login">
          <router-link tag="span" to="/login" v-if="!user_id">
            <span class="glyphicon glyphicon-user" aria-hidden="true" @click=updateRouteBeforeLogin()></span>
          </router-link>

          <router-link tag="span" :to="{name:'user', params:{id:global.user.id}}" v-if="user_id">
            <img :src="server_host_static + global.user.image" class="big-img">
          </router-link>
        </div>
      </div>
    </div>

    <div class="container nav-container-short" v-show="show">
      <div class="col-xs-6">
        <div class="col-xs-3">
          <router-link tag="div" class="col-xs-2 logo-small-container" to="/">
            <!-- <span class="nav-title col-xs-12">&nbsp;&nbsp;UsCinema</span> -->
            <img :src="server_host_static + '/static/logo_small.jpeg'" class="logo-small">
          </router-link>
        </div>
        <div class="col-xs-3">
          <router-link tag="div" class="nav-item" to="/movies/all">
            <span class="nav-link">院线综评</span>
          </router-link>
        </div>
        <div class="col-xs-3">
          <router-link tag="div" class="nav-item" to="/movies/coming_soon">
            <span class="nav-link">即将上映</span>
          </router-link>
        </div>
        <div class="col-xs-3">
          <router-link tag="div" class="nav-item" to="/movies/bnm">
            <span class="nav-link">最佳新电影</span>
          </router-link>
        </div>
      </div>

      <div class="col-xs-6">

        <div class="col-xs-3">
          <router-link tag="div" class="nav-item" to="/movies/top">
            <span class="nav-link">排行榜</span>
          </router-link>

        </div>
        <div class="col-xs-3">
          <router-link tag="div" class="nav-item" to="/critics">
            <span class="nav-link">作者&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </router-link>
        </div>
        <div class="col-xs-4">
          <div class="nav-short-btn search">
            <!-- <input type="text" name="" class="search-input"> -->
            <span @click=handleSearchFlag(true) class="search-btn">
              <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
            </span>
          </div>
        </div>
        <div class="col-xs-2">
          <div class="nav-short-btn login">
            <router-link tag="span" to="/login" v-if="!user_id">
              <span class="glyphicon glyphicon-user" aria-hidden="true" @click=updateRouteBeforeLogin()></span>
            </router-link>

            <router-link tag="span" :to="{name:'user', params:{id:global.user.id}}" v-if="user_id">
              <img :src="server_host_static + global.user.image" class="short-img">
            </router-link>

            <!-- <router-link tag="span" :to="{name:'user', params:{id:global.user.id}}" v-if="user_id && user_authority  >= 4">
              <img :src="server_host + global.user.image" class="short-img">
            </router-link> -->
          </div>
        </div>
      </div>

    </div>
    <div class="nav-container-short-bg" v-show="bg_show"></div>

  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'Nav',
  data () {
    return {
      msg1: 'Nav1',
      msg2: 'Nav2',
      show: false,
      nav_height: 240,
      huge_show: true,
      bg_show: false,
      searchflag: false,
      searched: false,
      search_value: '',
      errored: false,
      loading: false,
      seq: 0,
      // para_list: [],
      max_recv_req: 0,
      fast_search_movies: [],
      fast_search_critics: [],
      fast_search_users: [],
      search_para_encoded: '',
      user_id: '',
      user_authority: '',
      error_content: '服务器开小差啦>_<',
      big: false
    }
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  mounted () {
    this.handleRoute()
    window.addEventListener('scroll', this.handleScrollNav)
    // console.log(this.global)
  },
  watch: {
    '$route': 'handleRoute',
    'search_value': 'handleAutoSearch'
  },
  methods: {
    handleScrollNav () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= this.nav_height) {
        this.show = true
      } else {
        this.show = false
      }
    },
    updateRouteBeforeLogin () {
      if (this.$route.fullPath != '/login') {
        this.global.route_before_login = this.$route.fullPath
        console.log('route_before_login:', this.global.route_before_login)
      }
    },
    handleRoute () {
      // console.log('nav route:', this.$route.fullPath)
      // console.log(this.global.user)
      if (this.global.user) {
        this.user_id = this.global.user.id
        this.user_authority = this.global.user.authority
      } else {
        this.user_id = null
        this.user_authority = null
      }

      if (this.$route.path == '/') {
        this.nav_height = 240
        this.huge_show = true
        this.show = false
        this.bg_show = false
      } else {
        this.nav_height = 0
        this.huge_show = false
        this.show = true
        this.bg_show = true
        // console.log(this.$route)
      }

      if (window.screen.width < 992) {
        this.big = false
      } else {
        this.big = true
      }

      this.$router.push(this.$route.fullPath)
    },
    handleSearchFlag (flag) {
      if (!flag) {
        this.search_value = ''
        this.searched = false
      }
      this.searchflag = flag
    },
    handleKeyPress (event) {
      // console.log(event)
      if (event.keyCode == 13 || event.which == 13) {
        this.search_para_encoded = encodeURIComponent(this.search_value.replace(/^\s+|\s+$/g, ''))
        this.handleSearchFlag(false)
        this.$router.push('/search?para=' + this.search_para_encoded)
      }
    },
    // handleFocus (isfocused) {
    //   this.focused = isfocused
    //   console.log('focused? ', isfocused)
    // },
    handleAutoSearch () {
      // console.log("search_value", this.search_value)
      var search_para = this.search_value.replace(/^\s+|\s+$/g, '')
      // console.log("search_para", search_para)
      if (search_para) {
        // console.log('e', $event.which)
        // console.log('v', this.search_value)
        this.searched = true
        this.handleSearch(search_para)
        this.loading = true
      } else {
        this.searched = false
      }
    },
    handleSearch (value) {
      this.seq++
      this.search_para_encoded = encodeURIComponent(value)
      var url = this.server_host_java + '/v1/search/fast?seq=' + this.seq + '&para=' + this.search_para_encoded
      // console.log('value:',  value, 'url:', url)
      axios
        .get(url)
        .then(response => {
          // console.log(response)
          var recv_req = response.data.seq
          if (recv_req > this.max_recv_req) {
            // this.para_list = response.data.para_list
            this.fast_search_movies = response.data.movies
            this.fast_search_critics = response.data.critics
            this.fast_search_users = response.data.users
            this.max_recv_req = recv_req
            this.loading = false
            this.errored = false
            // console.log('fast_search_movies', this.fast_search_movies)
          }
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: center;
    padding:0px;
    margin:0px;
  }
  li{
    list-style-type:none;
  }
  .nav-container{
    color: #F0F0FA;
  }
  .container{
    background-color: #242929;
    margin: 0 auto;
    height: 240px;
    width: 100%;
  }
  .nav-title-container{
    /* background-color: green; */
    height: 150px;
    line-height: 200px;
  }
  .nav-title{
    font-size: 5.5em;
    font-family: Papyrus, Phosphate, Copperplate, Chalkduster;
    font-weight:900;
    letter-spacing: 7px;
  }
  .nav-title:hover{
    cursor:pointer;
  }
  .nav-items{
    /* background-color: grey; */
    height: 80px;
    line-height: 75px;
    font-family: "Helvetica Nenu", "微软雅黑", "华文细黑", "华文黑体";
    font-size: 1.1em;
    letter-spacing: 3px;
  }
  .nav-link:hover{
    color:#FF4A4A;
    cursor:pointer;
    font-weight: 700;
    font-size: 1.15em;
  }
  .nav-item.router-link-active span{
    color:#FF6A6A;
    font-weight: 700;
    font-size: 1.1em;
  }
  .nav-right{
    /* background-color: yellow; */
    height: 240px;
    line-height: 120px;
    text-align: right;
    font-size: 24px;
    color: #DDDDDD;
    opacity: 0.7;
  }
  .logo-big{
    height: 80%;
  }
  .logo-small{
    height: 36px;
    position: absolute;
    top: 9px;
  }
  .logo-small-container{
    text-align: left;
    padding-left: 10px;
  }
  .nav-container-short{
    background-color: black;
    height: 60px;
    line-height: 60px;
    position: fixed;
    top: 0px;
    width: 100%;
    animation:myfirst .2s;
    -webkit-animation:myfirst .2s;
    z-index:99999;
    color: #fffff0;
  }
  @media screen and (max-device-width: 992px) {
    .nav-container-short{
      height: 4.2em;
      line-height: 4em;
      font-size: 1.8em;
      letter-spacing: 0em;
      overflow: hidden;
    }
    .logo-small{
      height: 1.6em;
      top: 1.1em;
    }
    .nav-container{
      margin-top: -4em;
      height: 22em
    }

  }
  @keyframes myfirst
  {
    0%   {top:-40px;}
    25%  {top:-30px;}
    50%  {top:-20px;}
    75%  {top:-10px;}
    100% {top:0px;}
  }

  @-webkit-keyframes myfirst /* Safari and Chrome */
  {
    0%   {top:-40px;}
    25%  {top:-30px;}
    50%  {top:-20px;}
    75%  {top:-10px;}
    100% {top:0px;}
  }
  .nav-container-short-bg{
    height:60px;
  }
  .nav-container-short .nav-title{
    font-size: 1.3em;
    font-weight:900;
    letter-spacing: 2px;
    text-align: left;
  }
  .nav-container-short .nav-short-btn{
    text-align: right;
  }
  .search{
    padding-top: 3px;
    padding-right: 10px;
  }
  .nav-container-short .login{
    padding-right: 40px;
  }
  .nav-container-short .search-input{
    height: 24px;
    width: 50%;
    margin-right: 30px;
  }
  .searching{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999999;
    animation:searchshow .4s;
    -webkit-animation:searchshow .4s;
  }
  @keyframes searchshow
  {
    0%   {opacity: 0.4;}
    25%  {opacity: 0.6;}
    50%  {opacity: 0.8;}
    75%  {opacity: 0.9;}
    100% {opacity: 1;}
  }

  @-webkit-keyframes searchshow /* Safari and Chrome */
  {
    0%   {opacity: 0.4;}
    25%  {opacity: 0.6;}
    50%  {opacity: 0.8;}
    75%  {opacity: 0.9;}
    100% {opacity: 1;}
  }
  .searching-bar{
    height: 200px;
    background-color: black;
    opacity: 1;
  }
  .searching-res{
    height: 100%;
    background-color: white;
    opacity: 0.8;
    padding-bottom: 4em;
  }
  .searching-res-searched{
    background-color: #181818;
    opacity: 0.97;
  }
  .search-area{
    position: relative;
    height: 100%;
  }

  .search-input{
    position: absolute;
    top: 30%;
    left: 0%;
    text-align: left;
    border: none;
    background-color: transparent;
    height: 50px;
    font-size: 3em;
    width: 95%;
    color: #DFDFDF;
    box-shadow: none;
    outline: none;
    font-family: "Avenir";
    /*
    text-decoration:underline;
    text-decoration-color: #FF4A4A;
    -moz-text-decoration-color: #FF4A4A;
    */
    padding-bottom: 0.12em;
    border-bottom: 0.1em solid #FF4A4A;
    font-weight: 200;
  }
  .search-input::-webkit-input-placeholder{
    color: #4B4B4B;
  }
  .all-res{
    position: absolute;
    top: 30%;
    right: 5%;
    height: 50px;
    line-height: 50px;
    font-size: 1.2em;
    color: #DFDFDF;
  }
  .all-res:hover{
    cursor: pointer;
    color: #FF6A6A;
  }
  .search-close-container{
    height: 100%;
  }
  .search-close{
    position: absolute;
    top: 10%;
    right: 10%;
    height: 32px;
    width: 32px;
    text-align: center;
    line-height: 28px;
    color: #BBBBBB;
    font-size: 24px;
    border: 2px solid #BBBBBB;
    font-family: "Avenir", "Bradley Hand";
  }
  .search-close:hover{
    cursor: pointer;
  }
  .searching-res-movies, .searching-res-users{
    height: 100%;
    text-align: left;
    padding: 1em 0px;
    overflow: scroll;
  }
  .searching-res-critics{
    padding-bottom: 1em;
    margin-bottom: 1em;
    overflow: scroll;
  }
  .searching-res-movies h3, .searching-res-users h3{
    text-align: left;
    font-weight: 400;
    padding-bottom: 0.4em;
    margin-bottom: 0.8em;
    color: #66ff99;
    font-size: 1.3em;
    border-bottom: 0.1em solid #66ff99;
    display: inline-box;
    width: 2.8em;
  }
  .searching-res-movies *, .searching-res-users *{
    text-align: left;
    color: #EBEBEB;
    font-size: 1em;
  }
  .searching-res-movies{
    padding-right: 40px;
  }
  .searching-res-content{
    line-height: 1.5em;
  }
  .searching-res-li{
    padding: 0.7em 0.5em 0.7em 0;
  }
  .search-btn{
    font-size: 1.2em;
    color: #FF6A6A;
  }
  .search-res-words:hover, .search-btn:hover, .login span:hover{
    cursor: pointer;
  }
  .searching-res-main{
    font-size: 1.2em;
    color: #FFFFFF;
  }
  .searching-res-sub{
    font-size: 0.9em;
    color: #999999;
    font-weight: 500;
  }
  .big-img{
    border-radius:50%;
    border: 1px solid #fefefe;
    height: 35px;
    width: 35px;
  }
  .short-img{
    border-radius:50%;
    border: 1px solid #fefefe;
    height: 20px;
    width: 20px;
    margin-bottom: 4px;
  }
  .jiudong-big{
    font-size: 5.5em;
    font-family: Papyrus, Phosphate, Copperplate, Chalkduster;
    font-weight:900;
    letter-spacing: 7px;
  }
  @media screen and (max-device-width: 992px) {
    .short-img{
      height: 1.6em;
      width: 1.6em;
    }
    .search-btn{
      font-size: 1.4em;
      line-height: 3.2em;
    }
    .nav-items{
      line-height: 2.8em;
      font-size: 1.7em;
      overflow: hidden;
      padding-top: 1.2em;
    }
    .nav-right{
      height: 100%;
      line-height: 5.6em;
    }
    .searching-bar{
      margin-top: 3em;
    }
    .nav-short-btn{
      padding-right: 2em;
    }
    .nav-item.router-link-active span{
      font-size: 1em;
    }
    .nav-container-short-bg{
      height:3.6em;
    }
    .searching-res-movies, .searching-res-movies h3, .searching-res-users h3{
      font-size: 1.7em;
    }
    .all-res,.searching-res-users{
      font-size: 1.4em;
    }
    .no-res{
      font-size: 1.15em;
    }
    .nav-container-short .login{
      padding-top: 0.2em;
    }
  }
  .logo-small:hover{
    cursor: pointer;
  }

</style>
<style>
  div.searching-res-content span.marked{
    color: #FF3A3A;
  }
</style>
