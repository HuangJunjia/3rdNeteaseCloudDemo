<template>
  <div class="navbar">
    <div class="left">
      <img class="navbar-icon"
           src="@/assets/images/icon.png">
      <span>网易云音乐 for electron</span>
    </div>
    <div class="center">
      <div class="search-bar">
        <input type="text"
               class="no-drag"
               @input="goSuggest"
               @blur="searchMask = false"
               v-model="searchText"
               placeholder="请输入歌手名、歌曲名……">
        <i class="iconfont search-icon no-drag"
           @click="goSearch">&#xe649;</i>
        <div class="search-mask no-drag"
             v-show="searchMask">
          <div class="artists"
               v-if="suggestList.artists">
            <p>歌手</p>
            <ul>
              <li v-for="(item, index) of suggestList.artists"
                  :key="index">{{item.name}}</li>
            </ul>
          </div>
          <div class="songs"
               v-if="suggestList.songs">
            <p>单曲</p>
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
               v-if="suggestList.albums">
            <p>专辑</p>
            <ul>
              <li v-for="(item, index) of suggestList.albums">
                {{item.name}} + {{item.artist.name}}
              </li>
            </ul>
          </div>
          <div class="mvs"
               v-if="suggestList.mvs"></div>
          <div class="playlists"
               v-if="suggestList.playlists"></div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="user-item">
        <img class="user-icon no-drag"
             :src="userIcon">
        <span class="username no-drag">
          {{username}}
          <i class="el-icon-caret-bottom morefun-icon no-drag"
             @click="moreUserFun"></i>
        </span>

      </div>
      <div class="fun-item">
        <i class="el-icon-message no-drag"></i>
        <i class="el-icon-setting no-drag"></i>
      </div>
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
  </div>
</template>

<script>
  import {ipcRenderer, remote} from "electron"
  import utils from "../../../../util/utils"
  import {mapState, mapMutations, mapActions} from 'vuex'
  import axios from "axios"

  export default {
    name: "NavBar",
    data() {
      return {
        isBig: false, //控制win是否全屏
        searchText: "", //搜索框文本
        userIcon: require("@/assets/images/icon.png"), //用户头像，默认为electron的icon
        username: "未登录", //用户名，默认未登录,
        searchRes: [], //搜索change返回结果
        searchMask: false, //控制搜索建议mask显隐
        suggestList: [], //搜索建议list
        hotList: [], //热搜
        loading: true, //加载提示
        searchType: "suggest", //搜索类型，默认suggest，值有：suggest、hot、search
        searchList: [], //搜索结果list
      }
    },
    methods: {
      ...mapActions(["changeSearchList"]),
      // 搜索建议操作
      goSuggest() {
        if (this.searchText.length > 0) {
          this.searchMask = true;
          axios.get(`api/search/suggest`, { // 搜索建议
            params: {
              keywords: this.searchText,
              type: 1,
              limit: 30,
              offset: 0
            }
          }).then((res) => {
            this.suggestList = res.data.result
            // this.changeSearchList(res.data);
          })
        } else {
          this.searchMask = false;

        }
      },
      /*getHot() { // 获取热搜
        this.searchMask = true;
        axios.get("api/search/hot").then(res => {
          this.hotList = res.data.result.hots
        })
      },*/
      goSearch() { // 搜索

      },
      // 用户更多操作
      moreUserFun() {

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

      }
    },
    computed: {
      ...mapState(["Music"])
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
    min-width: 300px;
    min-height: 100px;
    position: absolute;
    top: 30px;
    left: 0;
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
    width: 150px;
    display: flex;
    align-items: center;
  }

  .user-item *:hover {
    cursor: pointer;
  }

  .user-icon {
    width: 35px;
    height: 35px;
  }

  .fun-item {
    flex: 1;
  }

  .win-item {
    flex: 1;
  }

  input::placeholder {
    line-height: 25px;
    color: #aaa;
  }

  i {
    cursor: pointer;
  }
</style>
