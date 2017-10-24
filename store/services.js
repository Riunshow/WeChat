import axios from 'axios'

const baseUrl = ''

class Services {

    /**
     * 这里发一个异步请求到 /wechat-signature，拿到签名回填初始化
     * 生成合法签名，需要依赖传递过去当前页面的完整 URL
     * Koa 通过 ctx.url 获取未必准确
     * 本地测试，可以修改  config/development 中 appId/appSecret/token
     * @return {
     *   success: 1,
     *   params: {
     *     timestamp,
     *     noncestr,
     *     signature
     *   }
     * }
     */
    // 
    getWechatSignature(url) {
        return axios.get(`${baseUrl}/wechat-signature?url=${encodeURIComponent(url)}`)
    }

}

export default new Services()