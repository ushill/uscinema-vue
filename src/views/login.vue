<template>
  <div class="Login container" :style="'width:'+appwid()+'px;margin:0 auto'">
    <!-- <user-page :type="'user'"></user-page> -->
    <div :style="'height: '+0.1*appwid()+'px'"></div>
    <div class="col-xs-3"></div>
    <div class="col-xs-6 login-container" v-if="!register_showed">
      <div class="col-xs-2"></div>
      <div class="col-xs-10">
        <h2>登录</h2>
      </div>
      <form class="form-horizontal">
        <div class="form-group">
          <!-- <label for="inputEmail3" class="col-xs-12 control-label" style="text-align: left">Email</label> -->
          <div class="col-xs-2"></div>
          <div class="col-xs-10">
            <input type="" class="form-control login-form" placeholder=" 邮箱 / 用户名" v-model="login_userinfo">
            <span class="must">*</span>
            <span class="invalid" v-if="!login_userinfo_check">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="login_userinfo_error"></span>
            </span>
          </div>
        </div>
        <div class="form-group">
          <!-- <label for="inputPassword3" class="col-sm-2 control-label">Password</label> -->
          <div class="col-xs-offset-2 col-xs-10">
            <input type="password" class="form-control login-form" placeholder=" 密码" v-model="login_password">
            <span class="must">*</span>
            <span class="invalid" v-if="!login_password_check">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="login_password_error"></span>
            </span>
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-offset-2 col-xs-10">
            <div class="checkbox">
              <label>
                <div class="">
                  <input type="checkbox" class="input-checkbox" v-model:checked="auto_login">
                  <div class="auto-l">自动登录</div>
                </div>
              </label>
            </div>

            <!-- <div class="checkbox">
                <label>
                    <div><input type="checkbox" class="checkbox" v-model:checked="critic_checked"> 我是作者</div>
                </label>
            </div> -->
          </div>
        </div>
        <!-- <button type="button">Sign inin</button> -->
        <div class="form-group">
          <div class="col-xs-offset-2 col-xs-9">
            <button type="button" class="btn btn-default button-login" @click=login()>登录</button>
            <span class="checking" v-if="1==login_check_loading">登录中...</span>
          </div>
        </div>
      </form>
    </div>

    <div class="col-xs-6 register-container" v-if="register_showed">
      <div class="col-xs-2"></div>
      <div class="col-xs-10">
        <h2>注册</h2>
      </div>
      <form class="form-horizontal">
        <div class="form-group">
          <!-- <label for="inputEmail3" class="col-xs-12 control-label" style="text-align: left">Email</label> -->
          <div class="col-xs-2"></div>
          <div class="col-xs-10">
            <input type="" class="form-control" placeholder=" 邮箱" v-model="regiester_email" @blur=checkEmail()>
            <span class="must">*</span>
            <span class="invalid" v-if="!regiester_email_check&&1!=email_check_loading">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="regiester_email_error"></span>
            </span>
            <span class="checking" v-if="1==email_check_loading">检测中...</span>
            <span class="valid" v-if="regiester_email&&regiester_email_check&&2==email_check_loading">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </span>
          </div>
        </div>

        <div class="form-group">
          <!-- <label for="inputPassword3" class="col-sm-2 control-label">Password</label> -->
          <div class="col-xs-offset-2 col-xs-10">
            <!-- <input type="text" class="hidden"> -->
            <input type="text" class="form-control regiester-form" placeholder=" 密码" v-model="regiester_password" onfocus="this.type='password'"
                   @blur=checkPassword()>
            <span class="must">*</span>
            <span class="invalid" v-if="!regiester_password_check&&pwd_check_loading">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="regiester_pwd_error"></span>
            </span>
            <span class="valid" v-if="regiester_password_check&&pwd_check_loading">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </span>
          </div>
        </div>
        <div class="form-group">
          <!-- <label for="inputPassword3" class="col-sm-2 control-label">Password</label> -->
          <div class="col-xs-offset-2 col-xs-10">
            <input type="text" class="form-control regiester-form" placeholder=" 重复密码" v-model="regiester_password2" onfocus="this.type='password'"
                   @blur=checkPasswordRpt()>
            <span class="must">*</span>
            <span class="invalid" v-if="!regiester_password2_check&&pwd2_check_loading">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="regiester_pwd2_error"></span>
            </span>
            <span class="valid" v-if="regiester_password2_check&&pwd2_check_loading">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </span>
          </div>
        </div>

        <div class="form-group">
          <!-- <label for="inputEmail3" class="col-xs-12 control-label" style="text-align: left">Email</label> -->
          <div class="col-xs-2"></div>
          <div class="col-xs-10">
            <input type="" class="form-control regiester-form" placeholder=" 用户名" v-model="regiester_username" @blur=checkUsername()>
            <span class="must">*</span>
            <span class="info">
              <span class="glyphicon glyphicon-question-sign" aria-hidden="true" @click=handleUsernameInfo(true)></span>
              <span v-if="username_info_flag" class="info-info">
                  用户名可由6-24位数字、字母或字符_ - 或. 组合而成，将作为用户的唯一标识；<span style="color: #FF0a0a">注册后不能更改</span>
                <span class="glyphicon glyphicon-remove info-info-close" aria-hidden="true" @click=handleUsernameInfo(false)></span>
              </span>
            </span>
            <span class="invalid" v-if="!regiester_username_check&&1!=username_check_loading">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="regiester_username_error"></span>
            </span>
            <span class="checking" v-if="1==username_check_loading">检测中...</span>
            <span class="valid" v-if="regiester_username&&regiester_username_check&&2==username_check_loading">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </span>
          </div>
        </div>

        <div class="form-group">
          <div class="col-xs-2"></div>
          <div class="col-xs-10">
            <input type="" class="form-control" placeholder=" 昵称" v-model="regiester_nickname" @blur=checkNickname()>
            <span class="must">*</span>
            <span class="invalid" v-if="!regiester_nickname_check&&nickname_check_loading">
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
              <span class="wrong-info" v-html="regiester_nickname_error"></span>
            </span>
            <span class="valid" v-if="regiester_nickname_check&&nickname_check_loading">
              <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            </span>
          </div>
        </div>

        <!-- <div class="form-group">
            <div class="col-xs-offset-2 col-xs-4">
                <div class="checkbox">
                    <label>
                        <input type="checkbox"> 记住账号
                    </label>
                </div>
            </div>
        </div> -->
        <!-- <button type="button">Sign inin</button> -->
        <div class="form-group">
          <div class="col-xs-offset-2 col-xs-9">
            <button type="button" class="btn btn-default" @click=regiester()>注册</button>
            <span class="checking" v-if="0!=register_loading">{{register_load_info}}</span>
          </div>
        </div>
      </form>
    </div>

    <div class="col-xs-3">
      <div class="type_change">
        <div v-if="!register_showed">没有账号？ 点击 <span @click=handleRegiester() class="change_click">注册</span></div>
        <div v-if="register_showed">已有账号？ 点击 <span @click=handleRegiester() class="change_click">登录</span></div>
        <div class="test-login">
          <p>懒得注册？ </p>
          <p>使用测试账号登录：</p>
          <p>username: <span class="test-login-i">woshiyizhiji</span></p>
          <p>password: <span class="test-login-i">123456</span></p>
        </div>
        <div class="test-login-2">
          <p>目前没上域名和HTTPS保护</p>
          <p>请不要输入常用的密码!</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

// import UserPage from '../components/user_page'
// import NodeRSA from 'node-rsa'
// let Base64 = require('js-base64').Base64

export default {
  name: 'Login',
  components: {
    // 'user-page': UserPage,
  },
  data () {
    return {
      register_showed: false,
      login_userinfo: '',
      login_username: '',
      login_email: '',
      login_password: '',
      regiester_email: '',
      regiester_username: '',
      regiester_password: '',
      regiester_password2: '',
      regiester_nickname: '',
      login_userinfo_type: 1,
      login_userinfo_check: true,
      login_password_check: true,
      regiester_email_check: true,
      regiester_username_check: true,
      regiester_password_check: true,
      regiester_password2_check: true,
      regiester_nickname_check: true,
      login_userinfo_error: '输入格式不正确，请输入邮箱，或6-24位数字、字母或字符组成的用户名',
      login_password_error: '邮箱 / 用户名或密码不正确',
      regiester_email_error: '邮箱格式不正确',
      regiester_username_error: '用户名格式不正确',
      regiester_pwd_error: '密码需要由8-18位数字、字母或下划线组成',
      regiester_pwd2_error: '两次输入的密码不一致',
      regiester_nickname_error: '昵称长度应为1-16',
      loading: false,
      errored: false,
      email_check_loading: 0,
      nickname_check_loading: 0,
      login_check_loading: 0,
      pwd_check_loading: 0,
      pwd2_check_loading: 0,
      username_check_loading: 0,
      username_info: '用户名可由6-24位数字、字母或字符_ - 或. 组合而成，且只能以字母或_开头；用户名将作为用户的唯一标识；若不填写将由系统随机生成；<span style="color: #FF0a0a">注册后不能更改</span>',
      register_loading: 0, /* 0 init， 1 idle， 2 fail， 3 success */
      register_load_info: '注册中，请稍后...',
      username_info_flag: false,
      // critic_checked: false,
      auto_login: false
    }
  },
  mounted () {
    window.pageYOffset = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    // var t = this.jiami('123456')
    // console.log(t)
  },
  methods: {
    // encrypt(password){

    //  let key=new NodeRSA({b:512});
    //  let publicDer=key.exportKey('pkcs8-public');
    //  let privateDer=key.exportKey('pkcs8-private');
    //  console.log(publicDer)

    //   let clientKey = new NodeRSA({b: 512});
    //   console.log(clientKey)
    //   var publicKey=publicDer;  //从服务端接收到的公钥，缓存到本地

    //   clientKey.importKey(publicKey);
    //   console.log(clientKey)
    //   let encrypted = clientKey.encrypt(password, 'base64');
    //   return  encrypted;
    // },
    handleRegiester () {
      this.register_showed = !this.register_showed
    },
    handleUsernameInfo (flag) {
      this.username_info_flag = flag
    },
    checkUserInfoType (userinfo) {
      var email_pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (email_pattern.test(userinfo)) {
        return 1
      } else if (/^.*\@.*$/.test(userinfo)) {
        return 101
      }

      var username_pattern = /^[A-Za-z0-9_\-\.]{6,24}$/
      if (username_pattern.test(userinfo)) {
        return 2
      } else {
        return 102
      }
    },
    checkUserEmailBE (email) {
      this.email_check_loading = 1
      this.axios
        .get(this.server_host_java + '/v1/auth/check/email?email=' + email)
        .then(response => {
          this.regiester_email_check = (response.data.is_valid == '1')
          if (!this.regiester_email_check) {
            this.regiester_email_error = response.data.error/* ["email"][0] */
          }
        })
        .catch(error => {
          console.log('error: ', error)
          this.regiester_email_check = false
          this.regiester_email_error = '服务器开小车了，请稍后再试'
        })
        .finally(() => {
          this.email_check_loading = 2
        })
    },
    checkUsernameBE (username) {
      this.username_check_loading = 1
      this.axios
        .get(this.server_host_java + '/v1/auth/check/username?username=' + username)
        .then(response => {
          this.regiester_username_check = (response.data.is_valid == '1')
          if (!this.regiester_username_check) {
            this.regiester_username_error = response.data.error/* ["email"][0] */
          }
        })
        .catch(error => {
          console.log('error: ', error)
          this.regiester_username_check = false
          this.regiester_username_error = '服务器开小车了，请稍后再试'
        })
        .finally(() => {
          this.username_check_loading = 2
        })
    },
    checkLoginUserInfo () {
      if (this.login_userinfo) {
        this.login_userinfo_type = this.checkUserInfoType(this.login_userinfo)
        if (this.login_userinfo_type == 101) {
          this.login_userinfo_check = false
          this.login_userinfo_error = '邮箱格式不正确'
        }
        // username_err
        else if (this.login_userinfo_type == 102) {
          this.login_userinfo_check = false
          this.login_userinfo_error = '用户名格式不符合规范'
        } else {
          this.login_userinfo_check = true
        }
      } else {
        this.login_userinfo_check = false
        this.login_userinfo_error = '用户名 / 邮箱不能为空'
      }
    },
    checkEmail () {
      this.regiester_email_check = true
      if (this.regiester_email) {
        if (this.checkUserInfoType(this.regiester_email) == 1) {
          this.checkUserEmailBE(this.regiester_email)
        } else {
          this.regiester_email_check = false
          // this.regiester_email_error = '用户名只能由6-24位数字、字母或字符组成，字符只能为_或-或.'
        }
      } else {
        this.regiester_email_check = false
      }
      return this.regiester_email_check
    },
    checkNickname () {
      if (this.regiester_nickname.length > 16 || this.regiester_nickname.length < 1) {
        this.regiester_nickname_check = false
        this.nickname_check_loading = 1
      } else {
        this.regiester_nickname_check = true
        this.nickname_check_loading = 1
      }
    },
    checkUsername () {
      // console.log(this.regiester_username)
      if (this.regiester_username) {
        this.regiester_username_check = true
        if (this.checkUserInfoType(this.regiester_username) == 2) {
          this.checkUsernameBE(this.regiester_username)
        } else {
          this.regiester_username_check = false
        }
      } else {
        this.regiester_username_check = false
      }
      return this.regiester_username_check
    },
    checkPassword () {
      var pwd_pattern = /^([A-Za-z0-9_]){6,18}$/
      if (pwd_pattern.test(this.regiester_password)) {
        this.regiester_password_check = true
      } else {
        this.regiester_password_check = false
      }
      this.pwd_check_loading = 2
      return this.regiester_password_check
    },
    checkPasswordRpt () {
      if (this.regiester_password && this.regiester_password === this.regiester_password2) {
        this.regiester_password2_check = true
      } else {
        this.regiester_password2_check = false
      }
      this.pwd2_check_loading = 2
      return this.regiester_password2_check
    },
    get_user () {
      this.axios({
        method: 'get',
        url: this.server_host_java + '/v1/user/',
        headers: {
          // 'Authorization': 'basic ' + Base64.encode(this.global.token+':'),
          'Authorization': 'Bearer ' + this.global.token,
          'Content-type': 'application/json;charset=utf-8'
        }
      }).then(response => {
        // console.log(response)
        if (response.data) {
          console.log(response.data)
          this.global.user = response.data
          if (this.global.user.id) {
            console.log(this.global)
            // this.$router.push('/')
            // alert('欢迎回来')
            sessionStorage.setItem('user_id', this.global.user.id)
            sessionStorage.setItem('user_nickname', this.global.user.nickname)
            sessionStorage.setItem('user_image', this.global.user.image)
            sessionStorage.setItem('is_critic', this.global.user.is_critic)
            sessionStorage.setItem('user_authority', this.global.user.authority)
            sessionStorage.setItem('username', this.global.user.username)
            if (this.auto_login) {
              localStorage.setItem('user_id', this.global.user.id)
              localStorage.setItem('user_nickname', this.global.user.nickname)
              localStorage.setItem('user_image', this.global.user.image)
              localStorage.setItem('is_critic', this.global.user.is_critic)
              localStorage.setItem('username', this.global.user.username)
              sessionStorage.setItem('user_authority', this.global.user.authority)
            }
            // console.log('us,', sessionStorage.getItem("user"))
            this.$router.push(this.global.route_before_login)
          }
        }
      })
        .catch(error => {
          console.log('pp', error)
        })
        .finally(() => {
          this.login_password_check = false
          this.login_password_error = '登录认证失败'
        })
    },
    login () {
      // this.x = 0
      // console.log(this.login_userinfo)
      // console.log(this.login_password)
      this.checkLoginUserInfo()
      if (!this.login_userinfo_check) {
        return
      } else if (!this.login_password) {
        this.login_password_check = false
        this.login_password_error = '密码不能为空'
        return
      } else {
        this.login_userinfo_check = true
        this.login_password_check = true
        this.login_check_loading = 1
      }
      var login_by_type = (this.login_userinfo_type == 1) ? 'email' : 'username'

      this.axios({
        method: 'post',
        url: this.server_host_java + '/v1/auth/login/by/' + login_by_type,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          info: this.login_userinfo,
          password: this.login_password
        },
        transformRequest: [function (data) {
          var ret = ''
          for (var it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      }).then(response => {
        console.log(response)
        this.login_password_check = response.data.result
        this.login_password_error = response.data.msg
        if (this.login_password_check) {
          console.log(response.data.msg)
          this.global.token = response.data.msg
          sessionStorage.setItem('token', this.global.token)
          if (this.auto_login) {
            localStorage.setItem('token', this.global.token)
          }
          this.get_user()
        }
      })
        .catch(error => {
          console.log(error)
          this.login_password_check = false
          this.login_password_error = '服务器开小车了，请稍后再试'
        })
        .finally(() => this.login_check_loading = 2)

        // return false
    },
    regiester () {
      if (this.checkEmail() && this.checkUsername() && this.checkPassword() && this.checkPasswordRpt()) {
        this.register_loading = 1
        this.register_load_info = '注册中，请稍后...'
        this.axios({
          method: 'post',
          url: this.server_host_java + '/v1/auth/register/by/email',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            email: this.regiester_email,
            username: this.regiester_username,
            password: this.regiester_password,
            password2: this.regiester_password2,
            nickname: this.regiester_nickname
          },
          transformRequest: [function (data) {
            var ret = ''
            for (var it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }]
        }).then(response => {
          console.log(response)
          this.register_loading = (response.data.result == true) ? 3 : 2
          this.register_load_info = response.data.msg
          if (response.data.result) {
            alert('注册成功，请登录')
            this.regiester_password = ''
            this.regiester_password2 = ''
            this.register_showed = false
          }
        })
          .catch(error => {
            console.log(error)
            this.register_loading = 2
            this.register_load_info = '服务器开小车了，请稍后再试'
          })
      } else {
        this.register_loading = 2
        this.register_load_info = '参数不合法，请按提示修改参数'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    text-align: left;
    padding: 0px;
  }
  .form-horizontal .form-group {
    margin-right: 0;
    margin-left: 0;
  }
  h2{
    margin: 20px 0;
    padding: 20px 0 0 0;
    font-weight: 300;
    color: #6f6f6f;
    font-weight: 400;
  }
  button{
    padding: 5px 20px;
    background-color: #FF5A5A;
    color: #F0F0F0;
    font-weight: 500;
    font-size: 16px;
    border: none;
    color: #FFFAF0;
    font-weight: 500;
    font-family: Copperplate;
    letter-spacing: 1px;
    border-radius: 0;
  }
  .button-login{
    background-color: #4A80aB;
    color: #F8FAFF;
  }
  input.form-control{
    width: 50%;
  }
  .must, .valid, .invalid, .checking, .info{
    position: absolute;
    top: 30%;
    left: 52%;
    color: #FF4A4A;
    font-size: 12px;
  }
  .valid, .invalid, .checking{
    top: 20%;
    left: 55%;
    color: #DD2248;
    width: 45%;
  }
  .valid{
    color: #2BD56F;
  }
  .info{
    left: 53%;
    top: 50%;
    color: #4b4b4b;
    width: 42%;
  }
  .wrong-info, .info-info{
    display: inline-block;
    position: absolute;
    top: 0;
    left: 10%;
    width: 90%;
    line-height: 20px;

  }
  .info-info{
    top: 15%;
    left: 7%;
    width: 97%;
    background-color: rgba(200, 240, 240, 1);;
    padding: 2% 5% ;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.1), 3px 2px 3px 0 rgba(0, 0, 0, 0.15);
    z-index: 999
  }
  .info-info-close{
    position: absolute;
    top: 90%;
    right: -1%;
    border: 1px solid #4b4b4b;
    border-radius: 50%;
  }
  .login-container{
    min-height: 400px;
    background-color: rgba(90, 165, 230, 0.4);
  }
  .register-container{
    min-height: 400px;
    background-color: rgba(255, 128, 128, 0.4);
  }
  .type_change{
    font-size: 18px;
    color: #666666;
    margin-left: 40px;
  }
  .change_click{
    color: #ff6a6a;
    text-decoration: underline;
    cursor: pointer;
  }
  .checkbox{
    display: inline-block;
    width: 45%;
    height: 20px;
    line-height: 20px;
    text-align: left;
  }
  .test-login{
    padding-left: 1em;
    padding-top: 1em;
    margin-top: 3em;
    font-size: 0.7em;
    width: 14em;
    border: solid 1px #ff9a9a;
  }
  .test-login-2{
    /*padding-left: 1em;*/
    padding-top: 2em;
    margin-top: 1em;
    font-size: 0.8em;
    width: 14em;
    color: #ff8a8a;
  }
  .test-login-i{
    color: #ff2a2a;
  }
  @media screen and (max-device-width: 992px) {
    *{
      font-size: 1.25em;
    }
    h2{
      font-size: 1.8em;
    }
    input{
      font-size: 0.8em;
      height: 1.5em;
      margin: 0.2em 0;
    }
    input.form-control{
      width: 60%;
    }
    .login-container, .register-container{
      margin-left: -20%;
      width: 92%;
      margin-bottom: 4em;
      height: 30em;
    }
    .auto-l{
      font-size: 0.4em;
      width: 100%;
      line-height: 3em;
      padding-left: 1.5em;
    }
    .input-checkbox{
      font-size: 0.6em;
      width: 9%;
    }
    .button-login, .btn-default{
      margin-top: 0.4em;
      font-size: 0.9em;
    }
    .type_change{
      width: 20em;
      font-size: 1.5em;
    }
    .must{
      left: 62%;
      font-size: 0.9em;
    }
    .invalid,.valid,.checking{
      left: 65%;
      font-size: 0.5em;
    }
    .info{
      left: 63%;
    }
    .test-login{
      padding-left: 1em;
      padding-top: 1em;
      margin-top: 3em;
      font-size: 0.7em;
      line-height: 2em;
      width: 22em;
      border: solid 1px #ff9a9a;
    }
    .test-login-2{
      padding-left: 1em;
      /*padding-top: 1em;*/
      /*margin-top: 3em;*/
      font-size: 0.8em;
      line-height: 2em;
      width: 22em;
      /*border: solid 1px #ff9a9a;*/
    }

  }
</style>
