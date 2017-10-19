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
    },
    tag: {
        create: base + 'tags/create?',
        fetch: base + 'tags/get?',
        update: base + 'tags/update?',
        del: base + 'tags/delete?',
        fetchUsers: base + 'user/tag/get?',
        batchTag: base + 'tags/members/batchtagging?',
        batchUnTag: base + 'tags/members/batchuntagging?',
        getTagList: base + 'tags/getidlist?'
    },
    user: {
        remark: base + 'user/info/updateremark?',
        info: base + 'user/info?',
        batchInfo: base + 'user/info/batchget?',
        fetchUserList: base + 'user/get?',
        getBlackList: base + 'tags/members/getblacklist?',
        batchBlackUsers: base + 'tags/members/batchblacklist?',
        batchUnblackUsers: base + 'tags/members/batchunblacklist?'
    },
    menu: {
        create: base + 'menu/create?',
        get: base + 'menu/get?',
        del: base + 'menu/delete?',
        addCondition: base + 'menu/addconditional?',
        delCondition: base + 'menu/delconditional?',
        getInfo: base + 'get_current_selfmenu_info?'
    },
    ticket: {
        get: base + 'ticket/getticket?'
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
     * @param {*} operation 方法名
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

    /**
     * 创建标签
     * @param {*} token 
     * @param {*} name 标签名
     */
    createTag(token, name) {
        const form = {
            tag: {
                name: name
            }
        }

        const url = api.tag.create + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 获取标签
     * @param {*} token 
     */
    fetchTags(token) {
        const url = api.tag.fetch + 'access_token=' + token

        return { url: url }
    }

    /**
     * 编辑标签
     * @param {*} token 
     * @param {*} tagId 
     * @param {*} name 
     */
    updateTag(token, tagId, name) {
        const form = {
            tag: {
                id: tagId,
                name: name
            }
        }

        const url = api.tag.update + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 删除标签
     * @param {*} token 
     * @param {*} tagId 
     */
    delTag(token, tagId) {
        const form = {
            tag: {
                id: tagId
            }
        }

        const url = api.tag.del + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 获取标签下粉丝列表
     * @param {*} token 
     * @param {*} tagId 
     * @param {*} openId 
     */
    fetchTagUsers(token, tagId, openId) {
        const form = {
            tagid: tagId,
            next_openid: openId || ''
        }
        const url = api.tag.fetchUsers + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 批量为用户打标签 || 批量为用户取消标签
     * @param {*} token 
     * @param {*} openIdList 粉丝列表
     * @param {*} tagId 
     * @param {*} unTag true|false
     */
    batchTag(token, openIdList, tagId, unTag) {
        const form = {
            openid_list: openIdList,
            tagid: tagId
        }
        let url = api.tag.batchTag

        if (unTag) {
            url = api.tag.batchUnTag
        }

        url += 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 获取用户身上的标签列表
     * @param {*} token 
     * @param {*} openId 
     */
    getTagList(token, openId) {
        const form = {
            openid: openId
        }
        const url = api.tag.getTagList + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 设置用户备注名 
     * @param {*} token 
     * @param {*} openId 
     * @param {*} remark 备注名
     */
    remarkUser(token, openId, remark) {
        const form = {
            openid: openId,
            remark: remark
        }
        const url = api.user.remark + 'access_token=' + token

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 获取用户基本信息(UnionID机制)
     * @param {*} token 
     * @param {*} openId 
     * @param {*} lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
     */
    getUserInfo(token, openId, lang) {
        const url = `${api.user.info}access_token=${token}&openid=${openId}&lang=${lang || 'zh_CN'}`

        return { url: url }
    }

    /**
     * 批量获取用户基本信息
     * @param {*} token 
     * @param {*} userList 
     */
    batchUserInfo(token, userList) {
        const url = api.user.batchInfo + 'access_token=' + token
        const form = {
            user_list: userList
        }

        return { method: 'POST', url: url, body: form }
    }

    /**
     * 获取用户列表
     * @param {*} token 
     * @param {*} openId 
     */
    fetchUserList(token, openId) {
        const url = `${api.user.fetchUserList}access_token=${token}&next_openid=${openId || ''}`

        return { url: url }
    }

}