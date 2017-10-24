/**
 * 微信业务相关的控制逻辑
 */

import * as wechat from '../api/wechat'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

/**
 * 签名
 * @param {*} ctx 
 * @param {*} next 
 */
export async function signature(ctx, next) {
    // 拿到 url 参数
    let url = ctx.query.url

    if (!url) ctx.throw(404)
    url = decodeURIComponent(url)
        // 生成签名
    let params = await wechat.getSignatureAsync(url)

    ctx.body = {
        success: true,
        params: params
    }
}