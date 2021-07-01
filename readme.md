# 项目预览
* 启动后台服务：wxc_music_server ==> 执行npm start


# 小程序相关

## 1.  数据绑定

1. 小程序
   1. data中初始化数据
   2. 修改数据： this.setData()
      1. 修改数据的行为始终是同步的
   3. 数据流： 
      1. 单项： Model ---> View
2. Vue
   1. data中初始化数据
   2. 修改数据: this.key = value
   3. 数据流： 
      1. Vue是单项数据流： Model ---> View
      2. Vue中实现了双向数据绑定： v-model
3. React
   1. state中初始化状态数据
   2. 修改数据: this.setState()
      1. 自身钩子函数中(componentDidMount)异步的
      2. 非自身的钩子函数中(定时器的回调)同步的
   3. 数据流： 
      1. 单项： Model ---> View

## 2. 获取用户基本信息

1. 用户未授权(首次登陆)
   1. button open-type=‘getUserInfo’
2. 用户已经授权(再次登陆)
   1. wx.getUserInfo

## 3. 前后端交互

1. 语法: wx.request()
2. 注意点: 
   1. 协议必须是https协议
   2. 一个接口最多配置20个域名
   3. 并发限制上限是10个
   4. **开发过程中设置不校验合法域名**： 开发工具 ---> 右上角详情 ----> 本地设置 ---> 不校验

## 4. 本地存储

1. 语法: wx.setStorage() || wx.setStorageSync() || .....
2. 注意点： 
   1. 建议存储的数据为json数据
   2. 单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB
   3. 属于永久存储，同H5的localStorage一样

# 扩展内容

## 1. 事件流的三个阶段

1. 捕获: 从外向内
2. 执行目标阶段
3. 冒泡: 从内向外

## 2. 事件委托

1. 什么是事件委托
   1. 将子元素的事件委托(绑定)给父元素
2. 事件委托的好处
   1. 减少绑定的次数
   2. 后期新添加的元素也可以享用之前委托的事件
3. 事件委托的原理
   1. 冒泡
4. 触发事件的是谁
   1. 子元素
5. 如何找到触发事件的对象
   1. event.target
6. currentTarget VS target
   1. currentTarget要求绑定事件的元素一定是触发事件的元素
   2. target绑定事件的元素不一定是触发事件的元素

## 3. 定义事件相关

1. 分类
   1. 标准DOM事件
   2. 自定义事件
2. 标准DOM事件
   1. 举例： click，input。。。
   2. 事件名固定的，事件由浏览器触发
3. 自定义事件
   1. 绑定事件
      1. 事件名
      2. 事件的回调
      3. 订阅方: PubSub.subscribe(事件名，事件的回调)
      4. 订阅方式接受数据的一方
   2. 触发事件
      1. 事件名
      2. 提供事件参数对象， 等同于原生事件的event对象
      3. 发布方: PubSub.publish(事件名，提供的数据)
      4. 发布方是提供数据的一方



# 获取用户唯一标识openid
   * 官网：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * 通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程(https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)
   * 说明：
      - 调用 wx.login() 获取 临时登录凭证code ，并回传到开发者服务器。
      - 调用 auth.code2Session 接口，换取 用户唯一标识 OpenID 、 用户在微信开放平台帐号下的唯一标识UnionID（若当前小程序已绑定到微信开放平台帐号） 和 会话密钥 session_key。
      - 之后开发者服务器可以根据用户标识来生成自定义登录态，用于后续业务逻辑中前后端交互时识别用户身份。
   * appSecret: https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=238964772&lang=zh_CN ===> 开发管理 ===> 开发设置 ===> 开发者ID  ==> AppSecret(小程序密钥)）
   * 请求地址: url =  `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`






























