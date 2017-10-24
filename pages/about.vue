<template>
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />
  
  </section>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    asyncData({
      req
    }) {
      return {
        name: req ? 'server' : 'client'
      }
    },
    head() {
      return {
        title: `测试页面`
      }
    },
    computed: {
      ...mapState([
        'baseUrl'
      ])
    },
    beforeMount() {
      const wx = window.wx
      const url = location.href.split('#')[0]
      console.log(url)
      /**
       * 会调用根目录下 store/services.js，发起一个请求，然后会被 router.js 截获
       */
      this.$store.dispatch('getWechatSignature', url).then(res => {
        if (res.data.success) {
          const params = res.data.params
          // 生成签名后，拿到权限，就可以执行下列方法了
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: params.appId, // 必填，公众号的唯一标识
            timestamp: params.timestamp, // 必填，生成签名的时间戳
            nonceStr: params.noncestr, // 必填，生成签名的随机串
            signature: params.signature, // 必填，签名，见附录1
            jsApiList: [
              'previewImage',
              'uploadImage',
              'downloadImage',
              'chooseImage',
              'onMenuShareTimeline',
              'hideAllNonBaseMenuItem',
              'showMenuItems'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });

          wx.ready(() => {
            wx.hideAllNonBaseMenuItem()
            console.log('success');
          })
        }
      })
    }
  }
</script>

<style scoped>
  .title {
    margin-top: 50px;
  }
  
  .info {
    font-weight: 300;
    color: #9aabb1;
    margin: 0;
    margin-top: 10px;
  }
  
  .button {
    margin-top: 50px;
  }
</style>
