<template>
  <div class="movie-list-item container">
    <router-link tag="div" :to="{name:'movie', params:{id:movie.id}}" class="poster-container col-xs-2" id="poster-container" >
      <img class="poster" :src="server_host_static + movie.image" :style="'width:'+poster_width">
    </router-link>

    <div class="movie-container col-xs-10 container" >
      <router-link tag="div" :to="{name:'movie', params:{id:movie.id}}" class="movie-title col-xs-12">
        &nbsp;&nbsp;{{movie.title}}<span v-if="movie.nickname" v-html="' / ' + movie.nickname" class="nickname"></span>
      </router-link>

      <div class="movie-user-score"
           v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}">{{score}}</div>
      <div class="movie-info-span col-xs-12">
        <span v-html="movie.release_dates"></span>
        <span v-if="movie.release_dates" v-html="' / ' + movie.release_dates"></span>
        <span v-if="movie.directors_name" v-html="' / ' + movie.directors_name"></span>
        <span v-if="movie.runtime" v-html="' / ' + movie.runtime + 'min'"></span>
        <span v-if="movie.countrys" v-html="' / ' + movie.countrys"></span>
        <span v-if="movie.genres" v-html="' / ' + movie.genres"></span>
        <span v-if="movie.actors_name" v-html="' / ' + movie.actors_name"></span>
        <span v-if="movie.screenplayers_name" v-html="' / ' + movie.screenplayers_name"></span>
      </div>
      <div class="movie-comment col-xs-12" v-if="content.comment">
        {{content.comment}}
      </div>

    </div>
    <div class="clear"></div>
    <hr>
    <div class="comment-time">{{content.comment_time}}</div>
  </div>
</template>

<script>
export default {
  name: 'MovieLongItem',
  props: ['content', 'width'],
  methods: {
    handlerating () {
      if (this.score) {
        this.score *= 2.0
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
        if (isNaN(parseFloat(this.score))) {
          this.score = '---'
        }
      } else if (this.type == 'user') {
        this.score = parseInt(this.score)
        if (isNaN(this.score)) {
          this.score = '---'
        }
      }
    },
    fresh () {
      this.poster_width = $('#poster-container').width() * 0.85 + 'px'
      this.movie = this.content.movie
      // console.log(this.content)
      this.score = this.content.score
      this.handlerating()
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
      poster_width: '100px',
      movie: '',
      score: 0
    }
  },
  watch: {
    'content': 'fresh'
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
    padding: 0px;
    line-height: 24px;
    font-size: 1em;
  }
  .movie-list-item{
    margin: 1px 1%;
    width: 98%;
    min-height: 200px;
    position: relative;
  }
  .poster-container{
    padding: 1px 0px;
  }
  .movie-title{
    height: 40px;
    line-height: 40px;
    font-size: 1.3em;
    text-align: left;
    font-weight: 500;
    color: #0066cc;
    background-color: #D0DEEE;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 50px;
    margin-bottom: 10px;
  }
  .nickname{
    font-size: 1em;
    font-weight: 500;
    color: #6B6B6B;
  }
  .movie-user-score{
    position: absolute;
    right: 0px;
    top: 0px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #FFFFFF;
    background-color: #BBBBBB;
    font-weight: 700;
  }
  .movie-info-span{
    padding-left: 10px;
  }
  .movie-info-span, .movie-info-span span{
    max-height: 5.4em;
    min-height: 4.8em;
    text-overflow: ellipsis-word;
    overflow: hidden;
    color: #5B5B5B;
    font-size: 0.9em;
    line-height: 1.8em;
  }
  .movie-comment{
    background-color: #E0EEEE;
    margin: 5px 0px 10px;
    padding: 5px 10px;
    min-height: 5em;
    font-size: 0.98em;
    line-height: 1.7em;
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
  .movie-title:hover, .poster:hover{
    cursor: pointer;
  }
  .movie-title:hover{
    color: #FF7979;
  }
  .clear{
    clear: both;
  }
  .comment-time{
    text-align: right;
    padding: 10px 2px 0px 0px;
    color: #7b9b9b;
    font-size: 0.8em;
    position: absolute;
    right: 0;
    bottom: 25px;
  }
  hr{
    border-top-color: #7AC5CD;
  }
  @media screen and (max-device-width: 992px) {
    .movie-list-item{
      margin: 1em 1%;
      width: 98%;
      min-height: 20em;
    }
    .movie-title{
      height: 2.8em;
      line-height: 2.8em;
      font-size: 1.8em;
      margin-bottom: 0.5em;
    }
    .movie-user-score{
      width: 2.8em;
      height: 2.8em;
      line-height: 2.8em;
      font-size: 1.8em;
    }
    .movie-info-span, .movie-info-span span{
      max-height: 7.2em;
      min-height: 5.2em;
      font-size: 1.2em;
      line-height: 2em;
    }
    .movie-comment{
      background-color: #E0EEEE;
      min-height: 0em;
      font-size: 1.8em;
      line-height: 2.1em;
    }
    .comment-time{
      text-align: right;
      padding: 10px 2px 0px 0px;
      color: #7b9b9b;
      font-size: 1em;
      position: absolute;
      right: 0;
      bottom: 1.8em;
    }
  }

</style>
