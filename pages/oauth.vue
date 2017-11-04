<template lang='pug'>
.container

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
