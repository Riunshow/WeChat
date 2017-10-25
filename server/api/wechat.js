import { getWechat, getOAuth } from '../wechat'

const wechatApi = getWechat()

/**
 * 获取票据
 * @param {*} url 请求的地址
 */
export async function getSignatureAsync(url) {
    const data = await wechatApi.fetchAccessToken()
    const token = data.access_token
    const ticketData = await wechatApi.fetchTicket(token)
    const ticket = ticketData.ticket

    let params = wechatApi.sign(ticket, url)
    params.appId = wechatApi.appID

    return params
}

export function getAuthorizeURL(...args) {
    const oauth = getOAuth()

    return oauth.getAuthorizeURL(...args)
}

/**
 * 通过 code 得到 user
 * @param {*} code 
 */
export async function getUserByCode(code) {
    const oauth = getOAuth()

    const data = await oauth.fetchAccessToken(code)
    const openid = data.openid
    const user = await oauth.getUserInfo(data.access_token, openid)

    return user
}