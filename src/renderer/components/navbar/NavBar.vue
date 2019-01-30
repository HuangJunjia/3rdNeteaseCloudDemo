<template>
  <div class="navbar">
    <!-- logo -->
    <div class="left">
      <img class="navbar-icon"
           src="@/assets/images/icon.png">
      <span>网易云音乐 for electron</span>
    </div>
    <!-- 搜索 -->
    <div class="center">
      <div class="search-bar">
        <input type="text"
               class="no-drag"
               @input="goSuggest"
               @focus="goSuggest"
               @blur="searchMask = false"
               v-model="searchText"
               placeholder="请输入歌手名、歌曲名……">
        <i class="iconfont search-icon no-drag"
           @click="goSearch">&#xe649;</i>
        <div class="search-mask no-drag"
             v-show="searchMask">
          <i class="el-icon-loading"
             style="position: absolute; top: 35%; left: 45%; transform: translate(-50%, -50%); font-size: 30px"
             v-if="!suggestList || suggestList.length === 0"></i>
          <div v-else>
            <p style="background-color: transparent">搜"<span
                    style="color: #1868ff; cursor: pointer">{{searchText}}</span>"相关的结果</p>
            <div class="artists"
                 v-if="suggestList.artists && suggestList.artists.length > 0">
              <p><i class="iconfont">&#xe686;</i> 歌手</p>
              <ul>
                <li v-for="(item, index) of suggestList.artists"
                    :key="index">{{item.name}}
                </li>
              </ul>
            </div>
            <div class="songs"
                 v-if="suggestList.songs && suggestList.songs > 0">
              <p><i class="iconfont">&#xe642;</i> 单曲</p>
              <ul>
                <li v-for="(item, index) of suggestList.songs"
                    :key="index">
                  {{item.name}}
                  <span>{{item.alias}}</span>-
                  <span v-for="(artist, ai) of item.artists"
                        :key="ai">{{artist.name}} </span>
                </li>
              </ul>
            </div>
            <div class="albums"
                 v-if="suggestList.albums && suggestList.albums.length > 0">
              <p><i class="iconfont">&#xe60a;</i> 专辑</p>
              <ul>
                <li v-for="(item, index) of suggestList.albums">
                  {{item.name}} + {{item.artist.name}}
                </li>
              </ul>
            </div>
            <div class="mvs"
                 v-if="suggestList.mvs && suggestList.mvs.length > 0">
              <p><i class="iconfont">&#xe600;</i> 视频</p>
              <ul>
                <li v-for="(mv, index) of suggestList.mvs">{{mv.name}}-{{mv.artistName}}</li>
              </ul>
            </div>
            <div class="playlists"
                 v-if="suggestList.playlists && suggestList.playlists.length > 0">
              <p><i class="iconfont">&#xe640;</i> 歌单</p>
              <ul>
                <li v-for="(playlist, index) of suggestList.playlists">{{playlist.name}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 用户信息及操作 -->
      <div class="user-item">
        <img class="user-icon no-drag"
             @click="login"
             :src="userIcon">
        <span class="username no-drag"
              v-if="loginType === 0"
              @click="login">
            {{username}}
            <i class="el-icon-caret-bottom morefun-icon no-drag"></i>
          </span>
        <el-popover placement="bottom"
                    style="padding: 0"
                    v-if="loginType === 1"
                    trigger="click">
          <div class="user-popover">
            <i class="el-icon-loading"
               style="position: absolute; top: 35%; left: 45%; transform: translate(-50%, -50%); font-size: 30px"
               v-show="searchUserDetail"></i>
            <div class="user-msg-div"
                 v-show="!searchUserDetail">
              <div class="user-msg-top border-bottom">
                <div class="user-msg-detail">
                  <img class="user-icon no-drag"
                       style="width: 45px; height: 45px;"
                       @click="login"
                       :src="userIcon">
                  <span class="no-drag">
                    {{username}}
                  </span>
                </div>
                <div class="user-msg-follow">
                  <span class="user-msg-event-ount border-right">
                    <div class="font-bold" style="font-size: 13px">{{music.userMessage.profile.eventCount}}</div>
                    <div>动态</div>
                  </span>
                  <span class="user-msg-follows border-right">
                    <div class="font-bold" style="font-size: 15px">{{music.userMessage.profile.follows}}</div>
                    <div>关注</div>
                  </span>
                  <span class="user-msg-followeds">
                    <div class="font-bold" style="font-size: 13px">{{music.userMessage.profile.followeds}}</div>
                    <div>粉丝</div>
                  </span>
                </div>
              </div>
              <div class="user-msg-bottom">
                <div class="user-msg-level">
                  <span>
                    <i class="iconfont">&#xe60b;</i>
                    等级
                  </span>
                  <span>
                    Lv.{{music.userMessage.level}} <span style="color: #ccc">></span>
                  </span>
                </div>
                <div class="user-msg-setting">
                  <span>
                    <i class="el-icon-setting"></i>
                    个人信息设置
                  </span>
                  <span style="color: #ccc">
                    >
                  </span>
                </div>
              </div>
              <div class="user-login-out"
                   @click="logOut">
                <i class="iconfont">&#xe60e;</i>
                <span>退出登录</span>
              </div>
            </div>
          </div>
          <span class="username no-drag"
                slot="reference"
                @click="goUserDetails">
            {{username}}
            <i class="el-icon-caret-bottom morefun-icon no-drag"></i>
          </span>
        </el-popover>
      </div>
      <!-- 客户端相关设置 -->
      <div class="fun-item">
        <i class="iconfont no-drag">&#xe743;</i><!-- 皮肤 -->
        <i class="el-icon-message no-drag"></i><!-- 私信 -->
        <i class="el-icon-setting no-drag"
           @click="refreshLogin"></i><!-- 设置 -->
      </div>
      <!-- 控制win操作 -->
      <div class="win-item">
        <i class="iconfont no-drag"
           @click="min">&#xe63b;</i>
        <i class="iconfont no-drag"
           @click="max"
           v-if="isBig">&#xe658;</i>
        <i class="iconfont no-drag"
           @click="max"
           v-if="!isBig">&#xe63f;</i>
        <i class="iconfont no-drag"
           @click="close">&#xe639;</i>
      </div>
    </div>
    <!-- 登录dialog -->
    <el-dialog :visible.sync="loginDialog"
               title="用户登录"
               width="300px"
               style="padding: 0"
               :modal="false">
      <el-tabs v-model="form.loginType"
               :stretch="true"
               type="border-card">
        <el-tab-pane label="手机号登录"
                     name="phone">
          <el-form ref="phoneForm"
                   :rules="rulesPhone"
                   :model="form">
            <el-form-item prop="username">
              <el-input v-model="form.username"
                        clearable
                        placeholder="请输入手机号……"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password"
                        clearable
                        type="password"
                        placeholder="请输入密码……"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮箱登录"
                     name="email">
          <el-form ref="emailForm"
                   :rules="rulesEmail"
                   :model="form">
            <el-form-item prop="username">
              <el-input v-model="form.username"
                        clearable
                        placeholder="请输入邮箱号……"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password"
                        clearable
                        type="password"
                        placeholder="请输入密码……"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <p style="margin-left: 10px; color: red; margin-bottom: 10px">*需要关闭登录保护</p>
      <div class="login-btn">
        <el-button plain @click="goLogin">立即登录</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {ipcRenderer, remote} from "electron"
  import utils from "../../../../util/utils"
  import {mapState, mapMutations, mapActions} from 'vuex'
  import axios from "axios"
  import {getCookie, setCookie, removeCookie} from "../../../../util/cookie";

  export default {
    name: "NavBar",
    data() {
      // 自定义校验密码的规则
      let phonePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.password !== '') {
            this.$refs.phoneForm.validateField('checkPass');
          }
          callback();
        }
      };
      let emailPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.password !== '') {
            this.$refs.emailForm.validateField('checkPass');
          }
          callback();
        }
      };
      let checkPhoneNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入帐号'));
        } else {
          if (!/(^1[3|4|5|7|8]\d{9}$)/.test(value)) {
            callback(new Error("您输入的不是一个手机号码"));
          } else {
            callback()
          }
        }
      };

      return {
        isBig: false, //控制win是否全屏
        searchText: "", //搜索框文本
        userIcon: require("@/assets/images/icon.png"), //用户头像，默认为electron的icon
        username: "未登录", //用户名，默认未登录,
        loginType: 0, //登录状态
        searchRes: [], //搜索change返回结果
        searchMask: false, //控制搜索建议mask显隐
        suggestList: [], //搜索建议list
        hotList: [], //热搜
        loading: true, //加载提示
        searchType: "suggest", //搜索类型，默认suggest，值有：suggest、hot、search
        searchList: [], //搜索结果list
        loginDialog: false, //登录dialog
        userMask: false, // 用户信息详情mask
        uid: 0, // 用户id
        searchUserDetail: true, //判断当前是否获取用户详情
        form: {
          username: "",
          password: "",
          loginType: "phone", //登录方式
        }, //登录表单
        rulesPhone: {
          username: [
            {validator: checkPhoneNum, trigger: 'blur'},
          ],
          password: [
            {validator: phonePass, trigger: 'blur'}
          ]
        },
        rulesEmail: {
          username: [
            {type: "email", message: '您输入的不是一个邮箱', trigger: 'blur'},
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          password: [
            {validator: emailPass, trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      axios.get("api/login/status").then(res => {
        if (res.data.code === 200) {
          this.loginType = 1;
          this.username = res.data.profile.nickname;
          this.userIcon = res.data.profile.avatarUrl;
          this.uid = res.data.profile.userId;
        } else {
          this.loginType = 0;
          this.username = "未登录";
          this.userIcon = require("@/assets/images/icon.png");
        }
      })
    },
    methods: {
      ...mapActions(["changeSearchList", "changeUserMsg"]),
      // 搜索建议操作
      goSuggest() {
        if (this.searchText.length > 0) {
          this.searchMask = true;
          setTimeout(() => {
            axios.get(`api/search/suggest`, { // 搜索建议
              params: {
                keywords: this.searchText,
                type: 1,
                limit: 30,
                offset: 0
              }
            }).then((res) => {
              this.suggestList = res.data.result
            })
          }, 500)
        } else {
          this.searchMask = false;
        }
      },
      goSearch() { // 搜索
        if (this.searchText.length > 0) {
          axios.get(`api/search`, { // 搜索建议
            params: {
              keywords: this.searchText,
              type: 1,
              limit: 30,
              offset: 0
            }
          }).then((res) => {
            this.changeSearchList(res.data.result);
            console.log(this.music)
          })
        }
      },
      // 点击用户名展示粗略信息
      goUserDetails() {
        this.searchUserDetail = true;
        axios.post("api/user/detail", {
          uid: this.uid
        }).then(res => {
          this.searchUserDetail = false;
          if (res.data.code === 200) {
            this.changeUserMsg(res.data)
          } else {
            alert(res.data.msg)
          }
        })
      },
      // 登录操作 显示登录dialog
      login() {
        if (this.loginType === 0) {
          this.loginDialog = true;
        }
        if (this.loginType === 1) {
          axios.post("api/user/detail", {
            uid: this.uid
          }).then(res => {
            if (res.data.code === 200) {
              this.changeUserMsg(res.data)
            }
          })
        }
      },
      // 点击登录
      goLogin() {
        this.$refs[`${this.form.loginType}Form`].validate((valid) => {
          if (valid) {
            if (this.form.loginType === "email") {
              axios.post("api/login", {
                email: this.form.username,
                password: this.form.password
              }).then(res => {
                if (res.data.code === 200) {
                  this.username = res.data.profile.nickname;
                  console.log(this.username);
                  this.loginDialog = false;
                } else {
                  alert(res.data.msg)
                }
              })
            }
            if (this.form.loginType === "phone") {
              axios.post("api/login/cellphone", {
                phone: this.form.username,
                password: this.form.password
              }).then(res => {
                if (res.data.code === 200) {
                  this.username = res.data.profile.nickname;
                  console.log(this.username);
                  this.loginDialog = false;
                } else {
                  alert(res.data.msg)
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 退出登录
      logOut() {
        axios.post("api/logout").then(res => {
          if (res.data.code === 200) {
            this.loginType = 0;
            this.username = "未命名";
            this.changeUserMsg({});
          }
        })
      },
      // 刷新登录状态
      refreshLogin() {
        axios.post("api/login/refresh").then(res => {
          console.log(res.data)
        })
      },
      // 最小化操作
      min() {
        ipcRenderer.send("min");
      },
      // 最大化操作
      max() {
        ipcRenderer.send("max");
        ipcRenderer.on('isMax', (event, arg) => {
          if (arg) {
            this.isBig = true
          } else {
            this.isBig = false
          }
        })
      },
      // 关闭操作
      close() {
        ipcRenderer.send("close")
      },
      // 搜索建议（简略）
      querySearchAsync(queryString, cb) {

      },
    },
    computed: {
      ...mapState({
        music: "Music"
      })
    },
    watch: {
      searchMask(val) {
        if (!val) {
          this.suggestList = []
        }
      },
      loginDialog(val) {
        if (!val) {
          this.$refs["phoneForm"].resetFields();
          this.$refs["emailForm"].resetFields();
        }
      },
      form: {
        handler(val) {
          if (val.loginType === "phone") {
            this.$refs["emailForm"].clearValidate();
          }
          if (val.loginType === "email") {
            this.$refs["phoneForm"].clearValidate();
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .no-drag {
    -webkit-app-region: no-drag;
  }

  .navbar {
    min-width: 1040px;
    height: 50px;
    min-height: 50px;
    max-height: 50px;
    background-color: red;
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    color: #fff;
    cursor: default;
  }

  .navbar >>> .el-dialog__header {
  }

  .navbar >>> .el-dialog__body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }

  .navbar >>> .el-tabs--border-card {
    border-bottom: 0;
    border-right: 0;
    border-left: 0;
    box-shadow: 0 0 0 0 transparent;
  }

  .navbar >>> .el-tabs__content {
    padding-bottom: 5px;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .left > span {
    margin-left: 10px;
  }

  .navbar-icon {
    width: 40px;
    height: 40px;
  }

  .search-bar {
    min-width: 270px;
    max-width: 270px;
    background-color: darkred;
    border-radius: 12.5px;
    padding: 0 10px;
    height: 25px;
    position: relative;
  }

  .search-bar > input {
    height: 25px;
    background-color: transparent;
    color: #fff;
    width: 270px;
    outline: none;
  }

  .search-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #aaa;
  }

  .search-mask {
    color: #000;
    background-color: #fff;
    border: #aaa solid 1px;
    border-radius: 5px;
    width: 320px;
    min-height: 100px;
    position: absolute;
    top: 30px;
    left: 0;
    padding: 0 0 15px 0;
    overflow-x: hidden;
  }

  .search-mask p {
    background-color: #f0f0f0;
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }

  .search-mask i {
    font-size: 14px;
  }

  .center {
    padding: 0 20px;
    flex: 1;
  }

  .right {
    width: 300px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }

  .right > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .user-item {
    min-width: 120px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .user-item > img:hover, .user-item > span:hover {
    cursor: pointer;
  }

  .user-icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .username {
  }

  .fun-item {
    flex: 1;
  }

  .win-item {
    flex: 1;
  }

  .login-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-popover {
    width: 300px;
    min-height: 100px;
    cursor: default;
    color: #000;
  }

  .user-msg-top {
    padding-bottom: 20px;
  }

  .user-msg-detail {
    display: flex;
    align-items: center;
    margin: 10px 0 15px 15px;
  }

  .user-msg-detail > span {
    margin-left: 20px;
    font-size: 16px;
  }

  .user-msg-follow {
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
  }

  .user-msg-follow > span {
    flex: 1;
  }

  .user-msg-bottom > div {
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    color: #555;
  }

  .user-msg-bottom > div:hover {
    background-color: #f5f5f5;
  }

  .user-login-out {
    height: 45px;
    line-height: 45px;
    padding: 0 10px;
    cursor: pointer;
  }

  .user-login-out:hover {
    background-color: #f5f5f5;
  }

  input::placeholder {
    line-height: 25px;
    color: #aaa;
  }

  i {
    cursor: pointer;
  }

  ul {
    list-style: none;
  }

  li {
    padding: 0 10px 0 20px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 35px;
    line-height: 35px;
  }

  li:hover {
    background-color: #e5e5e5;
    cursor: pointer;
  }

  /*控制dialog动画*/
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
