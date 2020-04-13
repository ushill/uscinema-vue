<template>
  <div class="my-rating" v-if="rating">
    <span class="score my-grade4" v-if="rating>1"></span>
    <span class="score my-grade4" v-if="rating>2"></span>
    <span class="score my-grade4" v-if="rating>3"></span>
    <span class="score my-grade4" v-if="rating>4"></span>
    <span class="score my-grade3" v-if="rating>5"></span>
    <span class="score my-grade3" v-if="rating>6"></span>
    <span class="score my-grade2" v-if="rating>7"></span>
    <span class="score my-grade2" v-if="rating>8"></span>
    <span class="score my-grade1" v-if="rating>9"></span>
    <span class="score my-grade1" v-if="rating>10"></span>

    <div class="scored">
      <span class="scored-grade4" v-if="rating==0">0</span>
      <span class="scored-grade4" v-if="rating==1">1</span>
      <span class="scored-grade4" v-if="rating==2">2</span>
      <span class="scored-grade4" v-if="rating==3">3</span>
      <span class="scored-grade4" v-if="rating==4">4</span>
      <span class="scored-grade3" v-if="rating==5">5</span>
      <span class="scored-grade3" v-if="rating==6">6</span>
      <span class="scored-grade2" v-if="rating==7">7</span>
      <span class="scored-grade2" v-if="rating==8">8</span>
      <span class="scored-grade1" v-if="rating==9">9</span>
      <span class="scored-grade1" v-if="rating==10">10</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoredBar',
  props: ['rating'],
  methods: {
    mounted () {
    }
  },
  data () {
    return {
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .my-rating{
    word-spacing: 0.5px;
    display: inline-block;
    padding: 0px 8px 0px 0px;
    height: 35px;
    line-height: 35px;
    position: relative;
  }
  .my-rating .score{
    display: inline-block;
    width: 19px;
    height: 19px;
    text-align: center;
    background-color: #202020;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 1em;
    font-weight: 700;
    margin-top: 8px;
  }
  .scored{
    position: absolute;
    height: 35px;
    width: 35px;
    right: -35px;
    bottom: 0px;
  }
  .my-rating .my-grade1, .scored-grade1{
    background-color: #FF6A6A;
  }
  .my-rating .my-grade2, .scored-grade2{
    background-color: #00cc99;
  }
  .my-rating .my-grade3, .scored-grade3{
    background-color: #EEB422;
  }
  .my-rating .my-grade4, .scored-grade4{
    background-color: #8B0082;
  }
  .scored-grade1,.scored-grade2,.scored-grade3,.scored-grade4{
    font-family: "Helvetica Nenu";
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFFFFF;
    border-radius: 50%;
    font-size: 0.9em;
    font-weight: 700;
    margin-top: 8px;
  }
  @media screen and (max-device-width: 992px) {
    .scored-grade1,.scored-grade2,.scored-grade3,.scored-grade4{
      width: 1.6em;
      height: 1.6em;
      line-height: 1.6em;
      font-size: 0.8em;
      font-weight: 700;
      margin-top: 1.2em;
    }
    .my-rating .score{
      display: inline-block;
      width: 1.1em;
      height: 1.1em;
      font-size: 1.1em;
      margin-top: 0.9em;
    }
  }

</style>
