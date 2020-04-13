<template>
  <nav>
    <ul class="pagination">
      <li :class="{'disabled': curpage == 1}"><a href="javascript:;" @click="setCurrent(curpage - 1)"> < < </a></li>
      <li :class="{'disabled': curpage == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
      <li v-for="p in grouplist" :class="{'active': curpage == p.val}">
        <a href="javascript:;" @click="setCurrent(p.val)"> {{ p.text }} </a>
      </li>
      <li :class="{'disabled': curpage == page}">
        <a href="javascript:;" @click="setCurrent(page)"> 尾页 </a>
      </li>
      <li :class="{'disabled': curpage == page}"><a href="javascript:;" @click="setCurrent(curpage + 1)"> > > </a></li>
    </ul>
  </nav>
</template>

<script type="es6">
export default{
  name: 'pagination',
  data () {
    return {
      // current: this.curpage,
    }
  },
  props: {
    total: {// 数据总条数
      type: Number,
      default: 0
    },
    display: {// 每页显示条数
      type: Number,
      default: 10
    },
    curpage: {// 当前页码
      type: Number,
      default: 1
    },
    pagegroup: {// 分页条数
      type: Number,
      default: 5,
      coerce: function (v) {
        v = v > 0 ? v : 5
        return v % 2 === 1 ? v : v + 1
      }
    }
  },
  computed: {
    page: function () { // 总页数
      // console.log(this.total, this.display, Math.ceil(this.total / this.display))
      return Math.ceil(this.total / this.display)
    },
    grouplist: function () { // 获取分页页码
      // console.log('cal page', this.current, this.current, this.pagegroup)
      var len = this.page, temp = [], list = [], count = Math.floor(this.pagegroup / 2), center = this.curpage
      if (len <= this.pagegroup) {
        while (len--) {
          temp.push({text: this.page - len, val: this.page - len})
        };
        return temp
      }
      while (len--) {
        temp.push(this.page - len)
      };
      var idx = temp.indexOf(center);
      (idx < count) && (center = center + count - idx);
      (this.curpage > this.page - count) && (center = this.page - count)
      temp = temp.splice(center - count - 1, this.pagegroup)
      do {
        var t = temp.shift()
        list.push({
          text: t,
          val: t
        })
      } while (temp.length)
      if (this.page > this.pagegroup) {
        (this.curpage > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
        (this.curpage < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1})
      }
      return list
    }
  },
  methods: {
    setCurrent: function (idx) {
      // console.log('innn', this.curpage)
      if (this.curpage != idx && idx > 0 && idx < this.page + 1) {
        // this.curpage = idx;
        this.$emit('pagechange', idx)
      }
    }
  }
}

</script>

<style scoped>
.pagination {
  overflow: hidden;
  display: table;
  margin: 0 auto;
  /*width: 100%;*/
  height: 50px;

  li {
    float: left;
    height: 30px;
    border-radius: 5px;
    margin: 3px;
    color: #666;

    &
    :hover {
       background: #000;

       a {
         color: #fff;
       }

    }
    a {
      display: block;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      text-decoration: none;
    }

  }

  .active {
    background: #000;

    a {
      color: #fff;
    }

  }
}

.pagination>li>a{
  padding: 6px 20px;
  font-size: 1.2em;
  font-weight: 700;
  color: #ff7a8a;
  border: solid 1px #efaaaa;
}
.pagination>.active>a{
  background-color: #FF4a4a;
  border-color: #FF6a6a;
  color: #FFFAF0;
}
@media screen and (max-device-width: 992px) {
  .pagination>li>a{
    font-size: 1.65em;
    margin: 1em 0;
    font-weight: 700;
    color: #ff7a8a;
    border: solid 1px #efaaaa;
  }
}

</style>
