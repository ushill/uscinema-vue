import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import MoviesAll from '@/views/movies/all'
import MoviesComingSoon from '@/views/movies/coming_soon'
import MoviesBnm from '@/views/movies/bnm'
import MoviesTop from '@/views/movies/top'
import MovieDetail from '@/views/movie'
import Home from '@/views/home'
import Critics from '@/views/critics'
// import Critic from '@/views/critic'
import User from '@/views/user'
import CriticComments from '@/views/critic_comments'
import UserComments from '@/views/user_comments'
// import CriticMovies from '@/views/critic'
import UserMovies from '@/views/user'
import Search from '@/views/search'
import Login from '@/views/login'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/movies/all',
      component: MoviesAll
    },
    {
      path: '/movies/coming_soon',
      component: MoviesComingSoon
    },
    {
      path: '/movies/bnm',
      component: MoviesBnm
    },
    {
      path: '/critics',
      component: Critics
    },
    {
      path: '/movies/top',
      component: MoviesTop
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: MovieDetail
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/user/:id/movies',
      name: 'user_movies',
      component: UserMovies
    },
    {
      path: '/movie/:id/critic_comments',
      name: 'critic_comments',
      component: CriticComments
    },
    {
      path: '/movie/:id/user_comments',
      name: 'user_comments',
      component: UserComments
    },
    {
      path: '/search:para?',
      name: 'search',
      component: Search
    },
    {
      path: '/login',
      component: Login
    },
  ]
})

// //进行路由判断
// router.beforeEach((to, from, next) => {
//   console.log(to);
//   console.log(from);
//   console.log(next)
// })

export default router
