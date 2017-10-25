import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'
import { signature, redirect, oauth } from '../controllers/wechat'

export const router = app => {
    const router = new Router()

    router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

    // 来到了这里，执行 signature
    router.get('/wechat-signature', signature)

    router.get('/wechat-redirect', redirect)
    router.get('/wechat-oauth', oauth)

    app
        .use(router.routes())
        .use(router.allowedMethods())
}