<template>
  <router-link tag="div" :to="{name:'movie', params:{id:content.movie_id}}" class="movie-list-item" :style="'width:'+poster_width_bak+';height:'+item_height">
    <div @mouseenter=handlemovieitemmouseenter($event) @mouseleave=handlemovieitemmouseleave() v-bind:class="{'chosen': mouseon}">
      <div class="poster-container container" :style="'height:'+poster_height+';width:'+poster_width" >
        <img class="poster" :src="server_host_static + content.movie_image"
             :style="'width:'+poster_width + '; min-height: ' +  poster_height"></div>
      <div class="movie-title" :style="'width:'+poster_width">
        <span class="movie-title-span col-xs-10">&nbsp;&nbsp;{{content.movie_title}}</span>
        <span class="movie-user-score col-xs-2"
              v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}">{{score}}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'MovieShortItem',
  props: ['content', 'width', 'type', 'multi'],
  methods: {
    handlerating () {
      if (this.multi && this.score) {
        this.score *= this.multi
      }

      if (this.score == '0.0') {
        this.isgrade4 = true
        this.score = '0'
      } else if (!parseFloat(this.score)) {
        this.score = ''
      } else if (parseFloat(this.score) <= 4.0) {
        this.isgrade4 = true
      } else if (parseFloat(this.score) <= 6.0) {
        this.isgrade3 = true
      } else if (parseFloat(this.score) <= 8.0) {
        this.isgrade2 = true
      } else {
        this.isgrade1 = true
        if (parseFloat(this.score) == 10) {
          this.score = '10'
        }
      }

      if (this.type == 'critic') {
        if (isNaN(parseFloat(this.content.score))) {
          this.score = '---'
        }
      } else if (this.type == 'user') {
        if (isNaN(parseInt(this.content.score))) {
          this.score = '---'
        }
      } else if (this.type == 'home') {
        if (isNaN(parseFloat(this.content.score))) {
          this.score = 'tbd'
        }
      }
    },
    fresh () {
      this.poster_width = this.width * 0.16 + 'px'
      this.poster_height = this.width * 0.16 * 1.4 + 'px'
      this.poster_width_bak = this.poster_width
      this.poster_height_bak = this.poster_height

      //     if(window.screen.width < 768){
      //     this.container_width = $('#movie-list').width() / 0.54
      //     this.per = 3
      // }else if(window.screen.width < 992){
      //     this.container_width = $('#movie-list').width() / 0.97
      //     this.per = 5
      // }else{
      //     this.container_width = $('#movie-list').width() * 0.83
      //     this.per = 6
      // }
      // console.log(window.screen.width)
      if (window.screen.width < 992) {
        this.item_height = parseFloat(this.poster_height_bak) + 72 + 'px'
      } else {
        this.item_height = parseFloat(this.poster_height_bak) + 36 + 'px'
      }
      this.score = this.content.score
      // console.log("ss", this.score)
      this.handlerating()
    },
    handlemovieitemmouseenter (event) {
      this.poster_width = parseFloat(this.poster_width) * 1.1 + 'px'
      this.poster_height = parseFloat(this.poster_height) * 1.1 + 'px'
      this.mouseon = true
    },
    handlemovieitemmouseleave () {
      this.poster_width = this.poster_width_bak
      this.poster_height = this.poster_height_bak
      this.mouseon = false
    }
  },
  mounted () {
    this.fresh()
  },
  data () {
    return {
      msg: 'MovieItem',
      isgrade1: false,
      isgrade2: false,
      isgrade3: false,
      isgrade4: false,
      poster_width: '130px',
      poster_height: '190px',
      poster_width_bak: '130px',
      poster_height_bak: '190px',
      item_height: '226px',
      mouseon: false,
      score: 0
    }
  },
  watch: {
    'content': 'fresh'
  }
}
{}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
    padding: 0px;
  }
  .movie-list-item{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: inline-block;
    margin: 15px 1.6%;
    position: relative;
    vertical-align:text-top;
  }
  .poster-container{
    overflow: hidden;
  }
  .movie-title{
    height: 36px;
    line-height: 36px;
    font-size: 0.8em;
  }
  .movie-title .movie-title-span{
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    letter-spacing: -1px;
    color: #ff8a8a;
    font-weight: 600;
    font-size: 1.2em;
    background-color: #f4ffff;
  }
  .movie-user-score{
    height: 100%;
    overflow: hidden;
    text-align: center;
    color: #FFFFFF;
    background-color: #BBBBBB;
    font-weight: 700;
  }
  .grade1{
    background-color: #FF6A6A;
  }
  .grade2{
    background-color: #00cc99;
  }
  .grade3{
    background-color: #EEB422;
  }
  .grade4{
    background-color: #4B0082;
  }
  .movie-list-item:hover{
    cursor: pointer;
  }
  .movie-title-span:hover{
    color: #FF7979;
  }
  .chosen{
    position: absolute;
    top: -5%;
    left: -5%;
    z-index: 999;
  }

  @media screen and (max-device-width: 992px) {
    .movie-title{
      font-size: 1.7em;
      height: 72px;
      line-height: 72px;
    }
    .movie-list-item{
      margin-bottom: 1.5em;
    }
    .movie-title .movie-title-span{
      letter-spacing: 0px;
      color: #ff7a7a;
    }
  }

</style>
