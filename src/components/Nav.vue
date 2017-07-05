<template>
  <nav class="navbar navbar-default">
    <div class="user-block">
      <img src="/static/images/默认头像.svg" alt="">
      <span class="username-span">{{ username }}</span>
      <i class="vertical-center rotate-45"></i>
    </div>
    <!-- arrange reverse！ -->
    <div class="toolbar">
      <form id="upload-form" :action= "baidu" method="POST" enctype="multipart/form-data">
        <div class="logout w80" @click="logout()" title=登出>
          <img src="/static/images/doctor-nav-black/logout.png" alt="登出">
          <span class="vertical-span">登出</span>
        </div>
        <div class="upload btn btn-default purple darken-4 hhide w110" type="submit" id="upload-button" title=上传图片>
          <img src="/static/images/doctor-nav-black/上传.png" alt="上传">
          <img class="hhide" src="/static/images/doctor-nav-white/上传_1.png" alt="上传">
          <span class="vertical-span">上传图片</span>
        </div>
        <div class="file-picker-outter hhide w110" title=选择图片>
          <img src="/static/images/doctor-nav-black/标记显示.png" alt="文件选择">
          <span class="vertical-span">选择图片</span>
        </div>
        <input id="file-picker" class="hhide" type="file" name="file" multiple>
        <div class="upload-filename hhide"></div>
      </form>
    </div>
  </nav>
</template>

<script>
    export default {
        computed: {
            time() {
                return this.$store.state.totalTime
            },
        },
        data() {
            return {
                baidu: 'https://www.baidu.com',
                username: 'AC',
            }
        },
        method: {
            logout() {
                console.log('logout')
            },

        }
    }
</script>

<style>
  .w80 {
    width:80px;
  }
  .w110 {
    width: 110px;
  }
  .vertical-span {
    float:right;
    margin-right:8px;
    position: relative;
    top: 45%;
    transform: translateY(-50%);
  }
    .username-span {
        font-weight: 500;
        -webkit-font-smoothing: antialiased;
    }
</style>
