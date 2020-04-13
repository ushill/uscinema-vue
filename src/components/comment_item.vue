<template>
  <li class="CommentItem col-xs-12">
    <div class="col-xs-11">
      <div class="img-name-container">
        <router-link tag="div" class="img" :style="'background:url('+image+') center center / auto 50px'"
                     :to="{name:'user', params:{id:content.user_id}}"></router-link>

        <div class="name">
          <router-link tag="span" class="name-span" :to="{name:'user', params:{id:content.user_id}}">
            {{content.nickname}}</router-link>&nbsp;
          <span class="time">{{content.comment_time}}</span>
        </div>
      </div>

      <!-- <img class="movie-img" :src="image"> -->
      <div class="comment">
        <span>{{content.comment}}</span>
        <span class="show-more" v-if="show_more"> ......阅读全文</span>
      </div>
      <div class="comment-comment"><!-- 评论(0) --></div>
    </div>
    <div class="col-xs-1 rating-container">
      <div class="rating" v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}"> {{content.score}} </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['content', 'index', 'nobtm', 'page', 'showidx'],
  methods: {
    handleSrc () {
      this.image = this.server_host_static + this.content.image
    },
    handleComment () {
      if (this.content.comment.length > 300) {
        this.content.comment = this.content.comment.substring(0, 300)
        this.show_more = true
      }
    },
    handlerating () {
      this.content.score *= 2.0
      if (this.content.score == '0.0') {
        this.isgrade4 = true
        this.content.score = '0'
      } else if (!parseFloat(this.content.score)) {
        this.content.score = ''
      } else if (parseFloat(this.content.score) <= 4.0) {
        this.isgrade4 = true
      } else if (parseFloat(this.content.score) <= 6.0) {
        this.isgrade3 = true
      } else if (parseFloat(this.content.score) <= 8.0) {
        this.isgrade2 = true
      } else {
        this.isgrade1 = true
        if (parseFloat(this.content.score) == 10) {
          this.content.score = '10'
        }
      }
    },
    fresh () {
      this.isgrade1 = this.isgrade2 = this.isgrade3 = this.isgrade4 = false,
      this.handleSrc(),
      // this.handleComment(),
      this.handlerating()
    }
  },
  mounted () {
    this.fresh()
  },
  data () {
    return {
      isgrade1: false,
      isgrade2: false,
      isgrade3: false,
      isgrade4: false,
      image: '',
      show_more: false,
      name: '',
      id: ''
    }
  },
  watch: {
    'content': 'fresh'
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  li{
    min-height: 120px;
    weight: 100%;
    border-bottom: 2px solid rgba(0,5,5,0.1);
    padding:20px 0px;
    text-align: left;
    list-style-type:none;
  }
  .img-name-container{
    height: 50px;
    width: 50px;
    position: relative;
  }
  .img{
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: inline-block;
  }
  .rating-container{
    padding-left: 40px;
    height: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .rating{
    line-height: 40px;
    font-size: 1.2em;
    color: #FFFFFF;
    width: 40px;
    height: 40px;
    text-align: center;
    font-weight: 900;
    border-radius: 20%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -20px;
  }
  .grade1{
    background-color: #FF7979;
  }
  .grade2{
    background-color: #42C862;
  }
  .grade3{
    background-color: #FED901;
  }
  .grade4{
    background-color: #8B0082;
  }
  .name{
    font-size: 1.3em;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -4px;
    margin-left: 40px;
    font-weight: 700;
    width: 400px;
  }
  span.time{
    font-size: 0.8em;
    font-weight: 300;
  }
  .comment{
    margin-top: 15px;
    margin-left: 65px;
    line-height: 2em;
    font-size: 1.1em;
  }
  .show-more{
    font-size: 1em;
    color: #769B9B;
    font-style: italic;
  }
  .comment-comment{
    margin-top: 15px;
    margin-left: 65px;
    font-size: 1em;
    color: #769B9B;
  }
  .show-more:hover, .comment-comment:hover{
    color: #FF7979;
    cursor: pointer;
  }
  .img,.name-span:hover{
    cursor: pointer;
    color: #FF7979;
  }
  .name-span{
    color: #ff6a6a;
  }
  @media screen and (max-device-width: 992px) {
    *{
      font-size: 1.1em;
    }
    li{
      min-height: 10em;
    }
    .img-name-container{
      padding-top: 0.5em;
    }
    .name{
      padding: 0 1em 0em 1em;
      font-size: 1.6em;
      margin-left: 1.1em;
      width: 20em;
    }
    .comment{
      padding: 0.5em 0.5em 0 1em;
      line-height: 2.5em;
      font-size: 1.5em;
    }
    .rating{
      line-height: 2.8em;
      font-size: 1.6em;
      width: 2.8em;
      height: 2.8em;
      top: 50%;
      left: 30%;
      margin-top: -20px;
      margin-left: -20px;
    }
  }

</style>
