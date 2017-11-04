import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rapapi.org/mockjsdata/28398'

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

    /**
     * 这里发一个异步请求到 /wechat-oauth，拿到服务器获得的用户资料
     * @return {
     *   success: true,
     *   user: {
     *     nickname,
     *     headurl,
     *     ...
     *   }
     * }
     */
    getWechatOAuth(url) {
        return axios.get(`${baseUrl}/wechat-oauth?url=${encodeURIComponent(url)}`)
    }

    fetchHouses() {
        return axios.get(`${apiUrl}/wiki/houses`)
    }

    fetchCities() {
        return axios.get(`${apiUrl}/wiki/cities`)
    }

    fetchCharacters() {
        return axios.get(`${apiUrl}/wiki/characters`)
    }
}

export default new Services()