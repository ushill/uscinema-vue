<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <hello-item></hello-item> -->
    <!-- <div id="container"></div> -->
    <div class="main-box">
      <nav-item/>
      <router-view/>
    </div>
    <div class="footer">
      <span>本站原始数据来源于豆瓣，仅作为技术练习使用，不涉及商业用途<br></span>
      <span>©五羊 ste_172367502@qq.com</span>
    </div>
  </div>
</template>

<script>
import Nav from './components/nav'
export default {
  components: {
    'nav-item': Nav
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {

  },
  name: 'App'
  // methods:{
  //   handleIdx(idx){
  //     console.log('xuxu')
  //   }
  // }
}
</script>

<style>
  *{
    padding: 0px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 1em;
    line-height: 24px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
    padding: 0px;
    margin:0 auto;
    min-width: 1156px;
    min-height: 100%;
    position: relative;
  }
  li{
    list-style-type:none;
  }
  h1,h2{
    font-weight: 200;
  }
  .footer{
    background-color: #4B4B4B;
    height: 100px;
    color: #F0F0F0;
    line-height: 30px;
    padding: 10px;
    margin-top: 80px;
    font-size: 1.05em;
    position: absolute;
    bottom: -20px;
    width: 100%;
    min-width: 1156px;
  }
  .main-box{
    padding-bottom: 120px;
  }
  @media screen and (max-device-width: 992px) {
    .main-box{
      padding-top: 3.9em;
    }
    .footer{
      font-size: 1.5em;
      line-height: 2em;
      height: 6.5em;
      padding-top: 1em;
    }
  }

</style>
