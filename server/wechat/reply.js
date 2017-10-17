const tip = '欢迎您，我的 master\n' + '<a href="http://123.207.154.174">welcome to my blog</a>'

export default async(ctx, next) => {
    const message = ctx.weixin

    console.log(message)

    ctx.body = tip
}