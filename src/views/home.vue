<template>
  <div class="Home container" id="home" :style="'width:'+appwid()+'px;margin:0 auto'">
    <div class="col-xs-12 left">
      <h1><span class="nowplaying">最近热映 Now Playing</span></h1>
      <div class="clear"></div>
      <div class="test">
        <div class="col-xs-1 col-sm-4 col-md-2 col-lg-4 red"></div>
        <div class="col-xs-5 col-sm-2 col-md-4 col-lg-2 green"></div>
        <div class="col-xs-2 col-sm-1 col-md-5 col-lg-4 blue"></div>
        <div class="col-xs-4 col-sm-5 col-md-1 col-lg-2 yellow"></div>
      </div>
      <div class="movies">
        <div class="movie-list" id="movie-list">
          <movie-short-item
            v-for="(item, index) of nowplaying"
            :content="item"
            :width="container_width"
            :type="'home'"
          ></movie-short-item>
          <!-- <div class="more" @click="handlemore" v-if="!comments_summary.isend">查看更多</div> -->

          <div class="more">
            <div class="col-xs-6">
              <div class="np-more">
                <span>
                    <router-link tag="span" to="/movies/all">
                        <span class="glyphicon glyphicon-hand-right more-icon" aria-hidden="true"></span>
                    </router-link>
                    <router-link tag="div" to="/movies/all" class="oneline">查看更多</router-link>
                </span>
              </div>
            </div>
            <div class="col-xs-6 textright">
              <div class="backto-top-div">
                <span @click="handletop">
                    回到顶部
                    <span class="glyphicon glyphicon-arrow-up more-icon" aria-hidden="true"></span>
                </span>
              </div>
            </div>
          </div>
          <!-- <router-link tag="div" to="/movies/all" class="detail">查看更多院线电影</router-link> -->
          <!-- <div class="backto-top" @click="handletop"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></div> -->
        </div>
      </div>

      <h1><span class="coming-soon">即将上映 Coming Soon</span></h1>
      <div class="clear"></div>
      <div class="test">
        <div class="col-xs-1 col-sm-4 col-md-2 col-lg-4 red"></div>
        <div class="col-xs-5 col-sm-2 col-md-4 col-lg-2 green"></div>
        <div class="col-xs-2 col-sm-1 col-md-5 col-lg-4 blue"></div>
        <div class="col-xs-4 col-sm-5 col-md-1 col-lg-2 yellow"></div>
      </div>
      <div class="movies">
        <div class="movie-list" id="movie-list">
          <movie-short-item
            v-for="(item, index) of coming_soon"
            :content="item"
            :width="container_width"
            :type="'home'"
          ></movie-short-item>
          <!-- <div class="more" @click="handlemore" v-if="!comments_summary.isend">查看更多</div> -->
          <!-- <router-link tag="div" to="/movies/coming_soon" class="detail">查看更多</router-link> -->
          <!-- <div class="backto-top" @click="handletop"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></div> -->
          <div class="more">
            <div class="col-xs-6">
              <div class="np-more">
                <span>
                    <router-link tag="span" to="/movies/coming_soon">
                        <span class="glyphicon glyphicon-hand-right more-icon" aria-hidden="true"></span>
                    </router-link>
                    <router-link tag="div" to="/movies/coming_soon" class="oneline">查看更多</router-link>
                </span>
              </div>
            </div>
            <div class="col-xs-6 textright">
              <span @click="handletop">
                  <div class="backto-top-div">
                      回到顶部
                      <span class="glyphicon glyphicon-arrow-up more-icon" aria-hidden="true"></span>
                  </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MovieShortItem from '../components/movie_short_item'

export default {
  name: 'Home',
  components: {
    'movie-short-item': MovieShortItem
  },
  data () {
    return {
      msg: 'Home',
      errored: false,
      loading: true,
      nowplaying: '',
      coming_soon: '',
      container_width: '700px',
      per: 6
    }
  },
  mounted () {
    // if(document.documentElement.clientWidth < 1080){
    //   var r = document.documentElement.clientWidth / 1080
    //   console.log(r)
    //   // document.body.style.zoom = r
    //   // $(document.body).css("-webkit-transform","scale(" + r + ")");
    // }
    // alert(document.documentElement.clientWidth +','+ window.innerWidth+','+ window.outerWidth+','+window.screen.width)
    // document.body.style.zoom = document.documentElement.clientWidth / 1440

    if (window.screen.width < 768) {
      this.container_width = $('#movie-list').width() / 0.54
      this.per = 3
    } else if (window.screen.width < 992) {
      this.container_width = $('#movie-list').width() / 0.97
      this.per = 5
    } else {
      this.container_width = $('#movie-list').width() * 0.83
      this.per = 6
    }
    // console.log('PC', this.IsPC())
    this.handleNowplaying()
    this.handleComingSoon()
    this.wid = this.appwid
  },
  methods: {
    handleWidChange () {
      // console.log('appwid change to ', this.appwid)
    },
    IsPC () {
      var userAgentInfo = navigator.userAgent
      var Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod']
      var flag = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    },
    handleNowplaying () {
      axios
      // .get(this.server_host + '/v1/movies/nowplaying/')
        .get(this.server_host_java + '/v1/movies/summary/nowplaying')
        .then(response => {
          this.nowplaying = response.data
          // console.log(this.nowplaying)
          this.errored = false
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },
    handletop () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    handleComingSoon () {
      axios
      // .get(this.server_host + '/v1/movies/coming_soon/')
        .get(this.server_host_java + '/v1/movies/summary/coming_soon')
        .then(response => {
          console.log(response)
          this.coming_soon = response.data
          if (this.coming_soon.length > this.per * 3) {
            this.coming_soon = this.coming_soon.slice(0, this.per * 3)
          }
          this.errored = false
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    }
  }
}
{}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #home{
    text-align:left;
    padding: 40px 0px;
  }
  h1{
    box-shadow: -4px 6px 4px 1px rgba(160, 200, 255, 0.3);
    padding: 2px 0px 10px 10px;
    float: left;
  }
  .clear{
    clear: both;
  }
  .main{
    margin-top: 20px;
  }
  .movies{
    margin: 30px 0%;
    width: 100%;
  }
  .movie-list{
    width: 100%;
  }
  .red{
    background-color: #ff2a2a;
  }
  .green{
    background-color: #56DFAA;
  }
  .blue{
    background-color: #66e2ff;
  }
  .yellow{
    background-color: #FFD700;
  }
  .test{
    margin: 20px 20px 20px 10px;
  }
  .test,.test div{
    height: 40px;
  }
  /*.detail{
      background-color: rgba(255,90,90,0.6);
      text-align: center;
      line-height: 45px;
      height: 45px;
      width: 95%;
      margin: 35px 0px 15px 0px;
      letter-spacing: 1px;
      font-size: 1.1em;
      color: #606060;
      font-weight: 500;
      box-shadow: 0 6px 10px 0 rgba(188, 205, 255, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
      display: inline-block;
  }*/
  .backto-top{
    display: inline-block;
    width: 4%;
    background-color: rgba(255,90,90,0.9);
    text-align: center;
    line-height: 45px;
    height: 45px;
    box-shadow: 0 6px 10px 0 rgba(188, 205, 255, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
    font-size: 1em;
    color: #EEEEEE;
    border-radius: 45%;
  }
  /*.detail:hover, .backto-top:hover{
      cursor: pointer;
      color: #FFF68F;
  }*/
  .more span:hover{
    cursor: pointer;
    color: #FFaaaa;
  }
  .more{
    line-height: 45px;
    height: 45px;
    font-size: 1.25em;
    color: #ff5a5a;
    font-weight: 400;
    padding: 20px 0 30px 0;
  }
  .more-icon{
    font-size: 1.2em;
  }
  @media screen and (max-device-width: 992px) {
    h1{
      font-size: 3.5em;
    }
    .detail{
      line-height: 2.7em;
      height: 2.7em;
      font-size: 1.75em;
    }
    .backto-top{
      line-height: 2.9em;
      height: 2.9em;
      font-size: 1.6em;
    }
    .test,.test div{
      height: 4em;
    }
    .more{
      line-height: 4em;
      height: 4em;
      font-size: 2.2em;
    }
    .more-icon{
      font-size: 1.2em;
    }
  }
  .oneline{
    display: inline-block;
  }
  .textright{
    text-align: right;
  }

</style>
