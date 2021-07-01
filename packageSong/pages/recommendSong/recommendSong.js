// pages/recommendSong/recommendSong.js
import PubSub from "pubsub-js"
import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月
    recommendList: [], //推荐列表
    index: 0, // 点击音乐的小标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let usnerInfo = wx.getStorageSync('userInfo')
    if (!usnerInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    // 更新日期状态
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    // 获取推荐列表
    this.getRecommendList()

    // 订阅来自songDetail页面发布的消息(切歌)
    PubSub.subscribe('switchType',(msg, type)=>{
      console.log(msg, type)
      let {recommendList, index} = this.data
      if(type === 'pre'){ // 上一首
        (index === 0) && (index = recommendList.length) // 如果当前是第一首，则跳转至最后一首
        index -=1
      }else{ // 下一首 
        (index === recommendList.length -1) && (index = -1)// 如果当前是最后一首，则跳转至第一首
        index +=1
      }
      // 更新歌曲下标
      this.setData({
        index
      })
      let musicId = recommendList[index].id
      // 将音乐id回传给songDetail页面
      PubSub.publish('musicId', musicId)
    })
  },

  // 获取推荐列表
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs')
    let recommendList = recommendListData.recommend
    this.setData({
      recommendList
    })
  },

  // 跳转至歌曲详情播放页songDetail：传递当前歌曲参数
  toSongDetail(event) {
    let {song, index} = event.currentTarget.dataset
    // 更新歌曲下标
    this.setData({
      index
    })

    // 路由跳转传参：query参数
    wx.navigateTo({
      /**
       * 方式1：传递歌曲对象
       *  结果：不能直接将song对象作为参数传递，长度过长会被截取掉
       * */
      // url: '/pages/songDetail/songDetail?song=' + song // 在url地址里不能有js对象,如果有会自动调用原型上的toString方法转换为字符串[object, object]
      // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song) // 先将其转为json字符串对象
      /**
       * 方式2：传递歌曲id
       *  结果：详情页接收到id，再发请求获取歌曲详情
       * */
      url: '/packageSong/pages/songDetail/songDetail?musicId=' + song.id
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})