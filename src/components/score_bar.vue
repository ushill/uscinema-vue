<template>
  <div class="my-rating" @click=handlemyrating($event) @mouseleave=handlemyratingmouseleave()>
    <span class="score my-grade4" v-if="myrating>=0">0</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade4': myratingmouseon>=0}" v-if="myrating<0||myrating == null || isNaN(myrating)">0</span>
    <span class="score my-grade4" v-if="myrating>=1">1</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade4': myratingmouseon>=1}" v-if="myrating<1||!myrating">1</span>
    <span class="score my-grade4" v-if="myrating>=2">2</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade4': myratingmouseon>=2}" v-if="myrating<2||!myrating">2</span>
    <span class="score my-grade4" v-if="myrating>=3">3</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade4': myratingmouseon>=3}" v-if="myrating<3||!myrating">3</span>
    <span class="score my-grade4" v-if="myrating>=4">4</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade4': myratingmouseon>=4}" v-if="myrating<4||!myrating">4</span>
    <span class="score my-grade3" v-if="myrating>=5">5</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade3': myratingmouseon>=5}" v-if="myrating<5||!myrating">5</span>
    <span class="score my-grade3" v-if="myrating>=6">6</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade3': myratingmouseon>=6}" v-if="myrating<6||!myrating">6</span>
    <span class="score my-grade2" v-if="myrating>=7">7</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade2': myratingmouseon>=7}" v-if="myrating<7||!myrating">7</span>
    <span class="score my-grade2" v-if="myrating>=8">8</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade2': myratingmouseon>=8}" v-if="myrating<8||!myrating">8</span>
    <span class="score my-grade1" v-if="myrating>=9">9</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade1': myratingmouseon>=9}" v-if="myrating<9||!myrating">9</span>
    <span class="score my-grade1" v-if="myrating>=10">10</span>
    <span class="score" @mouseenter=handlemyratingmouseenter($event)
          v-bind:class="{'my-grade1': myratingmouseon>=10}" v-if="myrating<10||!myrating">10</span>
  </div>
</template>

<script>
export default {
  name: 'ScoreBar',
  props: ['myscore'],
  methods: {
    handlemyrating (event) {
      if (parseInt(event.toElement.innerText) || event.toElement.innerText == 0) {
        // this.myrating = event.toElement.innerText
        this.myratingmouseon = -1
        this.$emit('scorechange', parseInt(event.toElement.innerText))
      } else {
        console.log('noparse', event.toElement.innerText)
      }
    },
    handlemyratingmouseenter (event) {
      this.myratingmouseon = event.toElement.innerText
    },
    handlemyratingmouseleave () {
      this.myratingmouseon = -1
    },
    handleMyratingChanged () {
      this.myrating = this.myscore
    }
  },
  watch: {
    'myscore': 'handleMyratingChanged'
  },
  data () {
    return {
      myrating: -1,
      myratingmouseon: -1
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .my-rating{
    margin-top: 16px;
    margin-bottom: 10px;
    word-spacing: 11px;
  }
  .my-rating .score{
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #202020;
    color: #FFFFFF;
    border-radius: 48%;
    font-size: 1em;
    font-weight: 700;
    padding-right: 1px;
  }
  .my-rating .my-grade1{
    background-color: #FF6A6A;
  }
  .my-rating .my-grade2{
    background-color: #00cc99;
  }
  .my-rating .my-grade3{
    background-color: #EEB422;
  }
  .my-rating .my-grade4{
    background-color: #4B0082;
  }
  .score:hover{
    cursor: pointer;
  }
</style>
