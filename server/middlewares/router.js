import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'

export const router = app => {
    const router = new Router()

    router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

    router.get('/upload', async(ctx, next) => {
        let mp = require('../wechat')
        let client = mp.getWechat()

        // 永久素材 视频
        // const data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../../test.mp4'), { type: 'video', description: '{"title": "haha", "introduction": "heihei" }' })

        // 永久素材 图片
        // const data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../../logo.png'), { type: 'image' })

        // 临时素材 图片
        // const data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../../logo.png'))

        // 永久素材 图文
        // const news = {
        //     articles: [{
        //         "title": "SSR",
        //         "thumb_media_id": 'JjZAaRsuA-pf_LCfTAPFFx_84ol-7nhqh_u2Abmnqbc',
        //         "author": "Botai",
        //         "digest": "没有东西",
        //         "show_cover_pic": 1,
        //         "content": "没有内容",
        //         "content_source_url": "http://123.207.154.174"
        //     }]
        // }
        // const data = await client.handle('uploadMaterial', 'news', news, {})

        console.log(data);
    })

    app
        .use(router.routes())
        .use(router.allowedMethods())
}