<template>
  <div class="CriticItem" id="critic-container" v-bind:class="{'col-xs-6': issplit, 'col-xs-12': !issplit}">
    <div class="main container" v-bind:class="{'dark': isdark, 'light': !isdark}">
      <div class="critic-img-container col-xs-2">
        <router-link tag="div" class="critic-img" :style="'background:url('+image+') center center / auto ' + imgSize"
                     :to="{name:'user', params:{id:user.id}}"></router-link>
      </div>
      <div class="critic-name-container col-xs-10">
        <div class="name">
          <router-link tag="span" class="name-span" :to="{name:'user', params:{id:user.id}}">
            {{user.nickname}}</router-link>
        </div>
      </div>
      <div class="critic-info-container col-xs-4">
        <div class="summary">{{title}}</div>
        <div class="total">评过 {{user.total}} 部电影</div>
        <div class="avg">平均评分：{{user.avg_score * 2.0}}</div>

      </div>
      <div class="critic-ratio-container col-xs-6">
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
</template>

<script>

// import axios from 'axios'
export default {
  name: 'CriticItem',
  props: ['user', 'index'],
  data () {
    return {
      image: '',
      widthRed: 0,
      widthGreen: 0,
      widthYellow: 0,
      widthPurple: 0,
      redCnt: 0,
      greenCnt: 0,
      yellowCnt: 0,
      purpleCnt: 0,
      isdark: 1,
      issplit: false,
      title: '影评人',
      imgSize: '60px'
    }
  },
  watch: {
    'user': 'handleCriticInfo'
  },
  mounted () {
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    this.handleCriticInfo()
  },
  methods: {
    handleCriticInfo () {
      this.image = this.server_host_static + this.user.image
      this.redCnt = this.user.excellent
      this.greenCnt = this.user.good
      this.yellowCnt = this.user.mixed
      this.purpleCnt = this.user.shit + this.user.bad
      if (this.user.title) {
        this.title = this.user.title
      }

      this.isdark = this.index % 4 == 0 || this.index % 4 == 3
      if (window.screen.width < 992) {
        var totalLen = 320
        this.isdark = this.index % 2
        this.issplit = false
        this.imgSize = '10em'
      } else if (window.screen.width < 1200) {
        var totalLen = 240
        this.issplit = true
      } else {
        var totalLen = 120
        this.issplit = true
      }
      // console.log(window.screen.width)

      var maxCnt = Math.max(this.redCnt, this.greenCnt, this.yellowCnt, this.purpleCnt)
      this.widthRed = (this.redCnt / maxCnt) * totalLen + 'px'
      this.widthGreen = (this.greenCnt / maxCnt) * totalLen + 'px'
      this.widthYellow = (this.yellowCnt / maxCnt) * totalLen + 'px'
      this.widthPurple = (this.purpleCnt / maxCnt) * totalLen + 'px'
    }
  }

}
{}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    color: #5B5B5B;
  }
  .CriticItem{
    text-align: left;
  }
  .dark{
    background-color: #BFE3FE;
  }
  .light{
    background-color: #D4EDED;
  }
  .critic-img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .name-span{
    font-size: 1.6em;
    line-height: 25px;
    font-weight: 400;
    margin: 10px 0px;
    color: #ff6a6a;
  }
  .critic-img,.name-span:hover{
    cursor: pointer;
    color: #FF7979;
  }
  .summary{
    color: #ff6a6a;
    font-size: 1.05em;
    padding: 8px 0px 5px 2px;
  }
  .total, .avg{
    color: #4A708B;
    font-size: 1em;
    padding-left: 0;
    padding-top: 4px;
    font-weight: 500;
  }
  .critic-comments-type{
    height: 24px;
    line-height: 12px;
    position: relative;
    font-size: 1em;
  }
  .critic-comments-ratio-line{
    vertical-align: center;
    height: 5px;
    position: absolute;
    top: 2.5px;
    left: 55px;
  }
  .critic-comments-ratio-cnt{
    position: absolute;
    top: -4px;
    right: -50px;
    width: 40px;
    font-weight: 400;
    color: #4A708B;
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
    margin-left: 0px;
    display: inline-block;
    font-weight: 400;
    color: #4A708B;
  }
  div.CriticItem div.main{
    width: 101%;
    padding: 16px 0;
    margin: 12px 0px;
    box-shadow: 0 6px 10px 1px rgba(188, 205, 255, 0.5), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
  }
  @media screen and (max-device-width: 992px) {
    .name{
      padding-top: 1em;
    }
    .name-span{
      font-size: 2.1em;
      padding-left: 2em;
    }
    .summary{
      font-size: 1.4em;
      line-height: 2em;
      padding-left: 3em;
    }
    .total, .avg{
      font-size: 1.4em;
      padding-top: 0;
      font-weight: 400;
      line-height: 2.2em;
      padding-left: 3em;
    }
    .critic-comments-type{
      height: 2em;
      line-height: 0.8em;
      font-size: 1.5em;
      margin-top: -0.3em;
    }
    .critic-comments-ratio-line{
      height: 8px;
      top: 0.1em;
      left: 4em;
    }
    .critic-comments-ratio-cnt{
      top: -0.2em;
      right: -3.2em;
      width: 2.5em;
    }
    .critic-img{
      width: 10em;
      height: 10em;
      margin-top: 1em;
    }
  }
</style>
