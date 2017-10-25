# vue-node-wechat

## 已完成

  * 微信基本接口实现
    1. 微信 Token 验证
    2. 获取 access_token
    3. 处理微信消息
    4. 素材管理
    5. 用户信息与标签管理
    6. 自定义菜单
    7. 获取 Ticket 实现 SDK 接入权限签名算法
        * 签名算法

          签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
          > [微信公众号开发文档 -> 签名算法](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)
    8. 实现微信 JS-SDK 权限接入
        * 记 js-sdk 的坑，配好了js安全域名，调试时仍然报invalid url domain，如果调用js的域名是二级域名，而在JS接口安全域名里面没有配置该二级域名，那么可以直接配置成主域名。比如二级域名是weixin.test.com,那么JS接口安全域名可以配置成test.com.
        * 如果是要命的invalid signature，查看[这个](https://segmentfault.com/q/1010000002520634),但毛貌似都没有实际的意义，仔细看一下微信的官方文档吧[点击这里](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)
        * 可以先判断是否是签名算法写的有问题，[点击这里](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign)微信 JS 接口签名校验工具
    9. 用户授权与用户个人资料获取
  * 公众号开发
    1. <del>利用 [RAP](http://rapapi.org/org/index.do) Mock 数据接口测试</del>
    2. ...
## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install*[see note below]

# serve with hot reload at localhost:3100
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

*Note: Due to a bug in yarn's engine version detection code if you are
using a prerelease version of Node (i.e. v7.6.0-rc.1) you will need to either:
  1. Use `npm install`
  2. Run `yarn` with a standard release of Node and then switch back

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
