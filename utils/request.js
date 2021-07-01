// 发送ajax请求
/*
1. 封装功能函数
  - 功能点明确
  - 函数内部应该保留固定的代码(静态的)
  - 将动态的数据抽离成形参，由使用者根据自身的情况动态的传入实参
  - 一个良好的功能函数应该设置形参的默认值(ES6的形参默认值)
2. 封装功能组件
  - 功能点明确
  - 组件内部保留静态代码
  - 将动态的数据抽离成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
  - 一个良好的组件应该设置组件的必要性及数据类型
*/
import config from './config'
export default (url, data={}, method="GET") => {
  return new Promise ((resolve, reject) => {
    wx.request({
      url: config.host+url,
      data,
      method,
      header: { // 如果登录则cookie存在否则为空
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        // 将用户的cookie存至本地
        if(data.isLogin){ // 如果是登录页
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        // console.log(res)
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  }) 
}