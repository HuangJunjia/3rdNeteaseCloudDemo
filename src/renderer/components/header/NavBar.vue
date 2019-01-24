<template>
  <div>
    <div class="header">
      <span class="icon">
        <img src="@/assets/images/icon.png">
        网易云音乐 for electron
      </span>
      <span class="search">
        <input class="search-input"
               placeholder="请输入歌手名、歌曲名等……"
               v-model="searchInput">
      </span>
      <span class="fun">
        <img class="person-icon"
             :src="personIcon">
        <span class="username">{{username.length > 0 ? username : "请登录"}}</span>
      </span>
    </div>
    <div class="center"></div>
    <div class="bottom"></div>
  </div>
</template>

<script>
	export default {
		name: "NavBar",
    data() {
			return {
        searchInput: "", //搜索框输入内容
				personIcon: require("@/assets/images/icon.png"), //用户头像
				username: "", //用户昵称
      }
    }
	}
</script>

<style scoped>
  .header {
    height: 50px;
    background-color: red;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }

  .icon {
    display: flex;
    align-items: center;
    height: 50px;
    margin-left: 10px;
  }

  .icon > img {
    width: 45px;
    height: 45px;
    margin-right: 5px;
  }

  .search {
    width: 250px;
    height: 24px;
    margin: 13px 0;
    background-color: darkred;
    border-radius: 12px;
  }

  .search-input {
    background-color: transparent;
    border: 0;
    height: 24px;
    width: 230px;
    margin: 0 10px;
    color: #fff;
  }

  .search-input::placeholder {
    color: #bbb;
  }

  .fun {
    display: flex;
    align-items: center;
  }

  .person-icon {
    width: 40px;
    height: 40px;
    margin-right: 5px;
  }
</style>
