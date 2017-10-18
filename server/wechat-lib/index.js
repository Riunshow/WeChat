import request from 'request-promise'
import formstream from 'formstream'
import fs from 'fs'
import * as _ from 'lodash'
import { resolve } from 'path'


const base = 'https://api.weixin.qq.com/cgi-bin/'

const api = {
    accessToken: base + 'token?grant_type=client_credential',
    // 临时素材
    temporary: {
        upload: base + 'media/upload?',
        fetch: base + 'media/get?'
    },
    // 永久素材
    permanent: {
        upload: base + 'material/add_material?',
        uploadNews: base + 'material/add_news?',
        uploadNewsPic: base + 'material/uploadimg?',
        fetch: base + 'material/get_material?',
        del: base + 'material/del_material?',
        update: base + 'material/update_news?',
        count: base + 'material/get_materialcount?',
        batch: base + 'material/batchget_material?'
    }
}

function statFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) reject(err)
            else resolve(stat)
        })
    })
}

export default class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)

        this.appID = opts.appID
        this.appSecret = opts.appSecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken

        this.fetchAccessToken()
    }

    /**
     * 请求微信服务器
     * @param {*} options 
     */
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
     * 拿到 access_token
     */
    async fetchAccessToken() {
        let data = await this.getAccessToken()

        // 判断是否合法，不合法则更新，合法则保存
        if (!this.isValidAccessToken(data)) {
            data = await this.updateAccessToken()
        }

        await this.saveAccessToken(data)

        return data
    }

    /**
     * 更新 access_token
     */
    async updateAccessToken() {
        const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

        const data = await this.request({ url: url })
        const now = (new Date().getTime())
        const expiresIn = now + (data.expires_in - 20) * 1000

        data.expires_in = expiresIn

        return data
    }

    /**
     * 判断 access_token 是否合法
     * @param {*} data 
     */
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }

        const expiresIn = data.expires_in
        const now = (new Date().getTime())

        if (now < expiresIn) {
            return true
        } else {
            return false
        }

    }

    /**
     * 
     * @param {*} operation 
     * @param {*} args 剩余参数交给 args
     */
    async handle(operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = this[operation](tokenData.access_token, ...args)
        const data = await this.request(options)

        return data
    }


    /**
     * 上传素材图片
     * @param {*} token token
     * @param {*} type 类型
     * @param {*} material 路径或内容
     * @param {*} permanent 标识 是否为永久素材
     */
    uploadMaterial(token, type, material, permanent) {
        let form = {}
        let url = api.temporary.upload

        if (permanent) {
            url = api.permanent.upload

            _.extend(form, permanent)
        }

        if (type === 'pic') {
            url = api.permanent.uploadNewsPic
        }

        if (type === 'news') {
            url = api.permanent.uploadNews
            form = material
        } else {
            form.media = fs.createReadStream(material)
        }

        let uploadUrl = url + 'access_token=' + token

        if (!permanent) {
            uploadUrl += '&type=' + type
        } else {
            if (type !== 'news') {
                form.access_token = token
            }
        }

        const options = {
            method: 'POST',
            url: uploadUrl,
            json: true
        }

        if (type === 'news') {
            options.body = form
        } else {
            options.formData = form
        }

        return options
    }

    /**
     * 
     * @param {*} token token
     * @param {*} mediaId mediaId
     * @param {*} type 类型
     * @param {*} permanent 是否永久标识
     */
    fetchMaterial(token, mediaId, type, permanent) {
        let form = {}
        let fetchUrl = api.temporary.fetch

        if (permanent) {
            fetchUrl = api.permanent.fetch
        }

        let url = fetchUrl + 'access_token=' + token
        let options = { method: 'POST', url: url }

        if (permanent) {
            form.mediaId = mediaId
            form.access_token = token
            options.body = form
        } else {
            if (type === 'video') {
                url = url.replace('https://', 'http://')
            }

            url += '&media_id=' + mediaId
        }

        return options
    }

    /**
     * 删除永久素材
     * @param {*} token 
     * @param {*} mediaId 
     */
    deleteMaterial(token, mediaId) {
        const form = {
            media_id: mediaId
        }
        const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 修改永久图文素材
     * @param {*} token 
     * @param {*} mediaId 
     * @param {*} news 
     */
    updateMaterial(token, mediaId, news) {
        const form = {
            media_id: mediaId
        }

        _.extend(form, news)
        const url = api.permanent.update + 'access_token=' + token + '&media_id=' + mediaId

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 获取素材总数
     * @param {*} token 
     */
    countMaterial(token) {
        const url = api.permanent.count + 'access_token=' + token

        return { method: 'POST', url: url }
    }

    /**
     * 获取素材列表
     * @param {*} token 
     * @param {*} options 
     */
    batchMaterial(token, options) {
        options.type = options.type || 'image'
        options.offset = options.offset || 0
        options.count = options.count || 10

        const url = api.permanent.batch + 'access_token=' + token

        return { method: 'POST', url: url, body: options }
    }

}