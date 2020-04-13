<template>
  <div class="Search">
    <div class="search-title">
      <p>"<span class="search-title-para">{{para}}</span>" 的搜索结果:</p>
    </div>
    <div class="search-res-container container" :style="'width:'+(appwid()<1300?appwid():appwid()*0.8)+'px;margin:0 auto'">
      <div class="col-xs-2 search-type">
        <ul class="ul-search-type">
          <li class="li-all" v-bind:class="{'chosen': search_type==1}" @click=handleChosen(1) >全部</li>
          <li class="li-movies-by-title" v-bind:class="{'chosen': search_type==2}" @click=handleChosen(2) >电影(按片名)</li>
          <li class="li-movies-by-people" v-bind:class="{'chosen': search_type==3}" @click=handleChosen(3) >电影(按影人)</li>
          <li class="li-critics" v-bind:class="{'chosen': search_type==4}" @click=handleChosen(4) >作者</li>
          <li class="li-users" v-bind:class="{'chosen': search_type==5}" @click=handleChosen(5) >用户</li>
        </ul>
      </div>
      <div class="col-xs-10 search-res">

        <section v-if="errored">
          <div class="error_list">
            <p>{{error_content}}</p>
          </div>
        </section>

        <section v-else>
          <div v-if="loading">Loading...</div>

          <div v-else class="searching-res-content">
            <div v-if="search_movies_by_name.length&&(search_type==1||search_type==2)" class="cat-contain">
              <h3>相关电影(按片名)</h3>
              <ul><li
                v-for="(item, index) of search_movies_by_name" class="searching-res-li search-res-movies-li">
                <div class="col-xs-2 searching-res-movie-img-container">
                  <router-link tag="img" :src="server_host_static + item.image" class="searching-res-movie-img" :to="{name:'movie', params:{id:item.id}}"></router-link>
                </div>
                <div class="col-xs-10 searching-res-movie-containt-container">
                  <router-link tag="span" :to="{name:'movie', params:{id:item.id}}">
                    <div class="onerow">
                      <span class="search-res-words"><span class="searching-res-main" v-html="item.title_html"></span>
                      <span class="searching-res-sub"> ( {{item.year}} ) / </span>
                      <span class="searching-res-sub" v-html="item.nickname_html"></span></span>
                    </div>
                  </router-link>
                  <div class="searching-res-movie-summary" v-html=item.summary></div>
                </div>
                <!-- <div class="col-xs-1">{{item.rating}}</div> -->
              </li></ul>
              <div v-if="movies_by_name_has_next" class="searching-res-more" @click=handleMoviesByNameSearch()>查看更多</div>
            </div>

            <div v-if="search_movies_by_people.length&&(search_type==1||search_type==3)" class="cat-contain">
              <h3>相关电影(按影人)</h3>
              <ul><li
                v-for="(item, index) of search_movies_by_people" class="searching-res-li search-res-movies-li">
                <div class="col-xs-2 searching-res-movie-img-container">
                  <router-link tag="img" :src="server_host_static + item.image" class="searching-res-movie-img" :to="{name:'movie', params:{id:item.id}}"></router-link>
                </div>
                <div class="col-xs-10 searching-res-movie-containt-container">
                  <router-link tag="span" :to="{name:'movie', params:{id:item.id}}">
                    <div class="manyrow">
                      <span class="search-res-words"><span class="searching-res-main" v-html="item.title_html"></span>
                      <span class="searching-res-sub"> ( {{item.year}} ) / </span>
                      <span class="searching-res-sub" v-html="item.directors_html"></span><span> / </span>
                      <span class="searching-res-sub" v-html="item.actors_html"></span></span>
                    </div>
                  </router-link>
                  <!-- <div class="searching-res-movie-summary" v-html=item.summary></div> -->
                </div>
              </li></ul>
              <div v-if="movies_by_people_has_next" class="searching-res-more" @click=handleMoviesByPeopleSearch()>查看更多</div>
            </div>

            <div v-if="search_critics.length&&(search_type==1||search_type==4)" class="cat-contain">
              <h3>相关作者</h3>
              <ul><li
                v-for="(item, index) of search_critics" class="searching-res-li col-xs-4">
                <router-link tag="img" :src="server_host_static + item.image" class="searching-res-user-img" :to="{name:'user', params:{id:item.id}}"></router-link>
                <router-link tag="span" :to="{name:'user', params:{id:item.id}}">
                  <span class="search-res-words"><span class="searching-res-main" v-html="item.nickname_html"></span>
                  <span class="searching-res-sub"> ( {{item.id}} )</span></span></router-link>
              </li></ul>
              <div style="clear:both"></div>
              <div v-if="critics_has_next" class="searching-res-more" @click=handleCriticsSearch()>查看更多</div>
            </div>

            <div v-if="search_users.length&&(search_type==1||search_type==5)" class="cat-contain">
              <h3>相关用户</h3>
              <ul><li
                v-for="(item, index) of search_users" class="searching-res-li col-xs-4">
                <router-link tag="img" :src="server_host_static + item.image" class="searching-res-user-img" :to="{name:'user', params:{id:item.id}}"></router-link>
                <router-link tag="span" :to="{name:'user', params:{id:item.id}}">
                  <span class="search-res-words"><span class="searching-res-main" v-html="item.nickname_html"></span>
                  <span class="searching-res-sub"> ( {{item.id}} )</span></span></router-link>
              </li></ul>
              <div style="clear:both"></div>
              <div v-if="users_has_next" class="searching-res-more" @click=handleUsersSearch()>查看更多</div>
            </div>

            <div class="no">
              <h3 v-if="search_type==1&&!search_movies_by_name.length&&!search_movies_by_people.length&&!search_critics.length&&!search_users.length">未搜索到内容</h3>
              <h3 v-if="search_type==2&&!search_movies_by_name.length">未搜索到内容</h3>
              <h3 v-if="search_type==3&&!search_movies_by_people.length">未搜索到内容</h3>
              <h3 v-if="search_type==4&&!search_critics.length">未搜索到内容</h3>
              <h3 v-if="search_type==5&&!search_users.length">未搜索到内容</h3>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>

// import UserPage from '../components/user_page'
import axios from 'axios'

export default {
  name: 'Search',
  components: {
  },
  data () {
    return {
      para: '',
      errored: false,
      loading: true,
      search_movies_by_name: [],
      search_movies_by_people: [],
      search_critics: [],
      search_users: [],
      search_type: 1,
      movies_by_name_page: 1,
      movies_by_people_page: 1,
      critics_page: 1,
      users_page: 1,
      movies_by_name_has_next: false,
      movies_by_people_has_next: false,
      critics_has_next: false,
      users_has_next: false,
      error_content: '服务器开小差啦>_<'
    }
  },
  watch: {
    '$route': 'handleRouteChange'
  },
  methods: {
    handleChosen (type) {
      this.search_type = type
    },
    handleRouteChange () {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.para = decodeURIComponent(this.$route.query.para)
      this.handleAllSearch()
    },
    handleAllSearch () {
      var url = this.server_host_java + '/v1/search/refine?type=' + 1 + '&para=' + encodeURIComponent(this.para) + '&page=' + 1
      axios
        .get(url)
        .then(response => {
          // console.log(response)
          this.search_movies_by_name = response.data.movies_by_name.data
          this.search_movies_by_people = response.data.movies_by_people.data
          this.search_critics = response.data.critics.data
          this.search_users = response.data.users.data
          // console.log(this.search_movies_by_name)
          this.movies_by_name_has_next = response.data.movies_by_name.has_next
          this.movies_by_people_has_next = response.data.movies_by_people.has_next
          this.critics_has_next = response.data.critics.has_next
          this.users_has_next = response.data.users.has_next
          this.errored = false
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },
    handleMoviesByNameSearch () {
      this.movies_by_name_page++
      var url = this.server_host_java + '/v1/search/refine?type=' + 2 + '&para=' + encodeURIComponent(this.para) + '&page=' + this.movies_by_name_page
      axios
        .get(url)
        .then(response => {
          // console.log('b4,', this.search_movies_by_name)
          this.search_movies_by_name = this.search_movies_by_name.concat(response.data.data)
          // console.log('recv,', response.data.data)
          // console.log('af,', this.search_movies_by_name)
          this.movies_by_name_has_next = response.data.has_next
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },
    handleMoviesByPeopleSearch () {
      this.movies_by_people_page++
      var url = this.server_host_java + '/v1/search/refine?type=' + 3 + '&para=' + encodeURIComponent(this.para) + '&page=' + this.movies_by_people_page
      axios
        .get(url)
        .then(response => {
          this.search_movies_by_people = this.search_movies_by_people.concat(response.data.data)
          this.movies_by_people_has_next = response.data.has_next
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },
    handleCriticsSearch () {
      this.critics_page++
      var url = this.server_host_java + '/v1/search/refine?type=' + 4 + '&para=' + encodeURIComponent(this.para) + '&page=' + this.critics_page
      axios
        .get(url)
        .then(response => {
          this.search_critics = this.search_critics.concat(response.data.data)
          this.critics_has_next = response.data.has_next
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },
    handleUsersSearch () {
      this.users_page++
      var url = this.server_host_java + '/v1/search/refine?type=' + 5 + '&para=' + encodeURIComponent(this.para) + '&page=' + this.users_page
      axios
        .get(url)
        .then(response => {
          this.search_users = this.search_users.concat(response.data.data)
          this.users_has_next = response.data.has_next
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    }
  },
  mounted () {
    this.handleRouteChange()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    padding: 0px;
    margin: 0px;
  }
  .Search{
    min-height: 100%;
  }
  .search-title{
    height: 200px;
    background-color: #2B2B2B;
    color: #D2D2D2;
    font-size: 36px;
    font-weight: 300;
    line-height: 200px;
    text-align: center;
    width: 100%;
    margin-top: -0.1em;
  }
  .search-title-para{
    color: #FF4A4A;
    font-size: 40px;
  }
  .search-res-container{
    padding-top: 20px;
  }
  .ul-search-type{
    margin-top: 40px;
  }
  .ul-search-type li{
    width: 80%;
    height: 52px;
    font-size: 16px;
    line-height: 60px;
    border-bottom: 1px solid #FF8A8A;
  }
  .ul-search-type li:hover{
    cursor: pointer;
    background-color: rgba(255, 66, 66, 0.3);
    box-shadow: -1px 1px 4px 0.5px rgba(255, 70, 90, 0.5);
  }
  li.chosen{
    font-weight: 500;
    background-color: rgba(255, 66, 66, 0.5);
    box-shadow: -1px 1px 4px 0.5px rgba(255, 70, 90, 0.5);
  }
  .cat-contain{
    margin-top: 10px;
    margin-bottom: 40px;
  }
  .searching-res-content *{
    text-align: left;
    font-size: 14px;
  }
  .searching-res-content{
    padding-left: 40px;
    line-height: 18px;
  }
  .searching-res-content h3{
    text-align: left;
    font-weight: 400;
    padding-bottom: 16px;
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 300;
    border-bottom: 1px solid #ff9a9a;
    display: inline-box;
    width: 100%;
    color: #FF2A2A;
  }
  .searching-res-li{
    padding: 15px 10px;
  }
  .searching-res-more{
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    text-align: center;
    margin: 5px 0;
    font-weight: 500;
    background-color: #ff8a8a;
    color: #ffeeee;
  }
  .search-res-movies-li{
    min-height: 140px;
    border-bottom: 1px solid #ffdddd;
  }
  .searching-res-movie-img-container{
    text-align: center;
  }
  .searching-res-movie-containt-container{
    height: 130px;
    overflow: hidden;
    line-height: 20px;
  }
  .searching-res-movie-img{
    height: 100px;
  }
  .searching-res-user-img{
    height: 28px;
    width: 28px;
  }
  .searching-res-movie-summary{
    line-height: 23px;
    font-size: 12.5px;
    margin: 10px 0;
    height: 70px;
    overflow: hidden;
    color: #666666;
  }
  .searching-res-main{
    font-size: 16px;
  }
  .searching-res-sub{
    font-size: 0.95em;
    color: #999999;
    font-weight: 500;
  }
  .manyrow{
    line-height: 24px;
    height: 100px;
    overflow: hidden;
    font-size: 18px;
  }
  .search-res-words:hover, .search-btn:hover, .searching-res-movie-img, .searching-res-user-img{
    cursor: pointer;
  }
  .no h3{
    padding: 20px 40px;
    line-height: 100px;
    border: none;
    color: #0B0B0B;
    font-size: 20px;
    font-weight: 300;
  }
  .clear{
    clear:both;
  }
  .error_list{
    height: 100%;
    font-size: 1.2em;
    text-align: center;
    padding-top: 10%;
  }
  .onerow{
    overflow: hidden;
    height: 22px;
  }
  @media screen and (max-device-width: 992px) {
    .ul-search-type li{
      font-size: 1.5em;
    }
    .searching-res-content h3{
      font-size: 2.8em;
    }
    .search-res-movies-li{
      min-height: 13em;
    }
    .searching-res-movie-img{
      height: 10em;
    }
    .onerow{
      height: 2em;
    }
    .manyrow{
      line-height: 1.8em;
      height: 10em;
      font-size: 1.52em;
    }
    .searching-res-main{
      font-size: 1.5em;
      height: 2em;
      line-height: 1.2em;
    }
    .searching-res-movie-containt-container{
      height: 12em;
      line-height: 20px;
      padding-right: 1em;
    }
    .searching-res-sub{
      font-size: 1.2em;
    }
    .searching-res-movie-summary{
      line-height: 2em;
      font-size: 1.3em;
      height: 6em;
    }
    .searching-res-more{
      height: 2.2em;
      line-height: 2.2em;
      font-size: 2.2em;
    }
  }
</style>
