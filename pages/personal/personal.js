// pages/personal/personal.js
import request from '../../utils/request.js'

let startY = 0 // 手指开始坐标
let moveY = 0 // 手指结束坐标
let moveDistance = 0 // 手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}, // 用户登录信息
    coverTransform: 'translateY(0)', // 移动的距离动画
    coverTransition: '', // 移动过渡动画
    recentPlayList: [], // 用户最近播放记录 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户登录信息
    let userInfo = JSON.parse(wx.getStorageSync("userInfo"))
    if(userInfo.nickname){
      this.setData({
        userInfo
      })

      this.getRecentPlayList(this.data.userInfo.userId)
      // 获取用户播放记录
    }
  },

  // 获取用户播放记录
  async getRecentPlayList(userId){  // 此处函数单独出来，避免在生命周期函数中使用async
    let recentPlayData = await request('/user/record',{uid:userId, type:0})
    let index = 0
    // 获取数据后为每条数据添加id值，
    let recentPlayList = recentPlayData.allData.slice(0, 10).map(item=>{
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList 
    })
  },

  handleTouchStart(event){ 
    this.setData({ // 开始滑动时取消过渡动画
      coverTransition: ''
    })
    // 获取起始坐标
    startY = event.touches[0].clientY  // 第一个手指的坐标
  }, 
  handleTouchMove(event){
    // 获取结束坐标
    moveY = event.touches[0].clientY
    // 手指移动距离
    moveDistance = moveY - startY
    // 根据手指移动的距离更新 coverTransform的状态值
    if(moveDistance<=0){ // 如果移动距离小于0，则不向上滑动
      return
    }
    if(moveDistance>=80){ // 如果移动距离大于80，就不再往下滑动
      this.setData({
        coverTransform: `translateY(${moveDistance}rpx)`
      })
    }
  },
  handleTouchEnd(){ 
    // 当手指滑动结束，回弹位移
    this.setData({
      coverTransform: 'translateY(0)',
      coverTransition: 'transform 1s linear'
    })
  },

  // 跳转至登录界面
  tologin(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

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