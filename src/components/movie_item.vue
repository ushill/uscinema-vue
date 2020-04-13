<template>
  <li class="MovieItem" :style="'height:'+16+'em'">
    <div class="poster col-xs-2">
      <div class="idx" v-if="showidx&&toped">{{(page-1)*display+index+1}}</div>
      <div class="idx idx-worse" v-if="showidx&&!toped">{{(page-1)*display+index+1}}</div>
      <router-link tag="div" :to="{name:'movie', params:{id:content.id}}" class="img">
        <img :src="poster_src" :style="'width:'+1140/7*0.84+'px'">
      </router-link>
      <!-- <div class="imd col-sm-6">f</div> -->
    </div>
    <div class="info col-xs-9">
      <router-link tag="div" :to="{name:'movie', params:{id:content.id}}"><div class="title">{{content.title}}</div>
        <div class="year">&nbsp;({{content.year}})</div></router-link>
      <div class="date">上映日期: {{content.date}}</div>
      <p class="summary">{{content.summary}}</p>
    </div>
    <div class="rating col-xs-1">
      <div class="uscc-rating" v-bind:class="{'grade1': isgrade1, 'grade2': isgrade2, 'grade3': isgrade3, 'grade4': isgrade4}">
        <span>{{content.rating}}</span>
      </div>
      <div class="bnm-btn" v-if="content.bnm&&!nobtm">
        <router-link tag="div" to="/movies/bnm">BNM</router-link>
      </div>
      <!-- <div class="more"> >>> </div> -->
    </div>
  </li>
</template>

<script>
export default {
  name: 'MovieItem',
  props: ['content', 'index', 'nobtm', 'page', 'showidx', 'display', 'toped'],
  methods: {
    handleSrc () {
      // var teste = "../../../" + this.content.poster
      // console.log(this.content.poster)
      // this.content.poster = '10001452.jpg'
      this.poster_src = this.server_host_static + this.content.image
    },
    handleSummary () {
      // console.log(this.content.summary)
      // console.log(this.content.summary.length)
      this.content.summary = this.handleText(this.content.summary)
      if (this.content.summary.length > 200) {
        this.content.summary = this.content.summary.substring(0, 200) + '...'
        // console.log(this.content.summary)
      }
    },
    handlerating () {
      // console.log(this.content.rating)
      if (!this.content.rating || this.content.rating == 'tbd') {
        this.content.rating = 'tbd'
      } else if (this.content.bnm) {
        this.isgrade1 = true
      } else if (this.content.rating < '4.0') {
        this.isgrade4 = true
      } else if (this.content.rating < '6.0') {
        this.isgrade3 = true
      } else if (this.content.rating < '8.0') {
        this.isgrade2 = true
      } else {
        this.isgrade1 = true
        // this.isbnm = true
      }

      // console.log(this.grade)
    },
    handleText (html) {
      var reTag = /<(?:.|\s)*?>/g
      return html.replace(reTag, '')
    },
    fresh () {
      this.isgrade1 = this.isgrade2 = this.isgrade3 = this.isgrade4 = false,
      this.id = this.content.id,
      this.href = '/movie/' + this.id,
      this.handleSrc(),
      this.handleSummary(),
      this.handlerating()
    }
  },
  mounted () {
    this.fresh()
  },
  data () {
    return {
      msg: 'MovieItem',
      poster_src: '',
      isgrade1: false,
      isgrade2: false,
      isgrade3: false,
      isgrade4: false,
      id: 0
    }
  },
  watch: {
    'content': 'fresh'
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .summary{
    color: #4D4D4D;
    font-size: 1.05em;
    padding-top: 10px;
    max-height: 180px;
    overflow: hidden;
    line-height: 1.8em;
  }
  li{
    weight: 100%;
    padding:20px 0px;
    text-align: left;
    list-style-type:none;
    width: 100%;
    box-shadow: 0 6px 10px 0 rgba(188, 205, 255, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
    margin: 15px 0;
  }

  img{
    padding-left: 20px;

  }
  .img{
    text-align: center;
  }
  .title{
    max-width: 90%;
    font-size: 1.5em;
    color: #FF7A7A;
    font-weight: 500;
    float: left;
    height: 35px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .year{
    font-size: 1.1em;
    height: 35px;
    line-height: 30px;
    color: #C09090;
    font-weight: 400;
  }
  .date{
    line-height: 24px;
    clear:both;
  }

  .uscc-rating{
    line-height: 60px;
    font-size: 1.6em;
    border: 2px solid #8F8F8F;
    color: #8F8F8F;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    text-align: center;
    font-weight: 700;

  }

  .grade1{
    border: 2px solid #FF6A6A;
    color: #FF6A6A;
  }
  .grade2{
    border: 2px solid #00cc99;
    color: #00cc99;
  }
  .grade3{
    border: 2px solid #EEB422;
    color: #EEB422;
  }
  .grade4{
    border: 2px solid #4B0082;
    color: #4B0082;
  }
  .bnm-btn{
    background-color: #FF5A5A;
    text-align:center;
    margin-top: 20px;
    border: 1px solid #EEC0C0;
    width: 60px;
    color: #FFFAF0;
    border-radius: 5%;
    font-weight: 500;
    font-family: Copperplate;
    letter-spacing: 0px;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.1), 3px 2px 3px 0 rgba(0, 0, 0, 0.15);
  }
  .img{
    overflow:hidden;
  }
  @media screen and (max-device-width: 992px) {
    li{
      margin-bottom: 1em;
    }
    .summary{
      font-size: 1.4em;
      padding-top: 0.4em;
      max-height: 6em;
      overflow: hidden;
      line-height: 1.8em;
    }
    .title{
      font-size: 1.6em;
      height: 2em;
      line-height: 2em;
      margin-top: -0.3em;
    }
    .year{
      font-size: 1.2em;
      height: 2em;
      line-height: 1.8em;
    }
    .date{
      line-height: 1.6em;
      font-size: 1.1em;
    }
    .info{
      padding-right: 2.4em;
      padding-left: 1.4em;
    }
    .rating{
      margin-top: 1.4em;
    }
  }
  .idx{
    position: absolute;
    top: -2px;
    left: 4px;
    background-color: rgba(250,40,40,0.8);
    width: 30px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFFFFF;
    font-weight: 700;
  }
  .idx-worse{
    background-color: #4B0082;
  }
  .poster{
    position: relative;
  }
  .title:hover, .bnm-btn:hover, .img:hover{
    cursor: pointer;
  }
  .title:hover{
    color: #FF7979;
  }
  .rating{
    padding-top: 25px;
  }

</style>
