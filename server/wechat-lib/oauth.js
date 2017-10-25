import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'
const api = {
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
    accessToken: base + 'oauth2/access_token?',
    userInfo: base + 'userinfo?'
}

export default class WechatOAuth {
    constructor(opts) {
        this.appID = opts.appID
        this.appSecret = opts.appSecret
    }

    async request(options) {
        options = Object.assign({}, options, { json: true })

        try {
            const response = await request(options)
            return response
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 拼接地址拿到 code
     * @param {*} scope 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），
     *                  snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。
     *                  并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
     * @param {*} target 跳转的地址 
     * @param {*} state 个性化参数
     */
    getAuthorizeURL(scope = 'snsapi_base', target, state) {
        const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

        return url
    }

    /**
     * 获取 token
     * @param {*} code 
     */
    async fetchAccessToken(code) {
        const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
        const data = await this.request({ url: url })

        return data
    }

    /**
     * 获取用户信息
     * @param {*} token 
     * @param {*} openID 
     * @param {*} lang 
     */
    async getUserInfo(token, openID, lang = 'zh_CN') {
        const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`

        const data = await this.request({ url: url })

        return data
    }
}