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

      const url = location.href.split('#')[0]
      console.log(url)
      /**
       * 会调用根目录下 store/services.js，发起一个请求，然后会被 router.js 截获
       */
      this.$store.dispatch('getWechatOAuth', url).then(res => {
        if (res.data.success) {
          console.log(res.data)
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
