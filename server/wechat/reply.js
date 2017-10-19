const tip = '欢迎您，我的 master\n' + '<a href="http://123.207.154.174">welcome to my blog</a>'

export default async(ctx, next) => {
    const message = ctx.weixin

    console.log("---------------------");
    console.log(message)

    let mp = require('../wechat')
    let client = mp.getWechat()




    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            ctx.body = tip
        } else if (message.Event === 'unsubscribe') {
            console.log('取消关注了');
        } else if (message.Event === 'LOCATION') {
            ctx.body = message.Latitude + ' : ' + message.Longitude
        }
    } else if (message.MsgType === 'text') {
        if (message.Content === '1') {
            // const data = await client.handle('fetchUserList')

            // let userList = [{
            //         openid: 'oG6cE1HpQ82-r_c7WwSJoXgs61a0',
            //         lang: 'zh_CN'
            //     },
            //     {
            //         openid: 'oG6cE1AUFlcoBnHKBxBCaO3BbFJM',
            //         lang: 'zh_CN'
            //     },
            //     {
            //         openid: 'oG6cE1DngdZro6-Q--qbIw2o83js',
            //         lang: 'zh_CN'
            //     },
            //     {
            //         openid: 'oG6cE1Cj4xqCRwAPrGjSXRyok9pk',
            //         lang: 'zh_CN'
            //     }
            // ]
            // const data = await client.handle('batchUserInfo', userList)

            // const data = await client.handle('fetchTags')

            // const data = await client.handle('createTag', 'SSR')

            // const data = await client.handle('fetchTagUsers', 2)

            // const data = await client.handle('batchTag', ['oG6cE1AUFlcoBnHKBxBCaO3BbFJM'], 100)

            // const data = await client.handle('getTagList', 'oG6cE1AUFlcoBnHKBxBCaO3BbFJM')

            const data = await client.handle('getUserInfo', 'oG6cE1AUFlcoBnHKBxBCaO3BbFJM', 'zh_CN')


            console.log(data)
        }
        ctx.body = message.Content
    } else if (message.MsgType === 'image') {
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'voice') {
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'video') {
        ctx.body = {
            title: message.ThumbMediaId,
            type: 'video',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'location') {
        ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
    } else if (message.MsgType === 'link') {
        ctx.body = message.title
    }

}