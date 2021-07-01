// pages/video/video.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroutList:[], //视频导航
    navId: "", // 导航id
    videoList:[], // 视频列表数据
    videoUpdateTime:[], // 记录视频播放时长
    isTriggered: false // 下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getVideoGroutListData()
  },

  // 获取视频导航数据
  async getVideoGroutListData(){
    let videoGroutListData = await request('/video/group/list')
    console.log(videoGroutListData)
    this.setData({
      videoGroutList:videoGroutListData.data.slice(0, 10),
      navId: videoGroutListData.data[0].id
    })

    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },

  // 获取视频列表数据
  async getVideoList(navId){
    let videoListData = await request('/video/group', {id: navId})
    // 获取数据后隐藏加载loadding
    wx.hideLoading()

    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    console.log(videoListData)
    this.setData({
      videoList,
      isTriggered:false // 获取数据后关闭下拉刷新
    })
  },

  // 点击切换导航事件
  changeNav(event){
    let navId = event.currentTarget.id // 通过id向event传参时如果是number会自动转换成string
    // let navId = event.currentTarget.dataset.id // 通过data-xx向event传参时不会转换类型
    this.setData({
      navId:navId*1,  // navId:navId>>>0 也可以使用位移强制转换为数值类型
      videoList:[], // 视频列表
      videoId:"" // 当前播放视频id
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载~'
    })
    // 获取当前导航对应的视频列表
    this.getVideoList(this.data.navId)
  },

  // 播放/继续播放视频
  handlePlay(event){
    /**
     * 问题：多个视频同时播放
     * 需求：
     *  1. 在点击播放事件中需要找到上一个播放的视频
     *  2. 在播放当前视频前关闭上一个正在播放的视频
     * 
     * 关键：
     *  1. 如何找到上一个视频的实例对象
     *  2. 如何确认点击播放的视频和正在播放的视频不是同一个
     * 
     * 单链模式：
     *  1. 需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
     *  2. 节省内存空间
     * 
        // 当前视频id
        let vid = event.currentTarget.id
        // 关闭上一个播放的视频(如果上一个视频id和当前视频id不相等 && this.videoContext当前实例对象属性存在，因为第一次点击播放时this.videoContext不存在)
        this.vid !== vid && this.videoContext && this.videoContext.stop()
        this.vid = vid
        // 创建控制video标签的实例对象
        this.videoContext = wx.createVideoContext(vid)  // API
      * */ 

    // 使用image进行性能优化
    // 当前视频id
    let vid = event.currentTarget.id
    // 更新data中的videoId
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)  // API
    // 判断当前视频是否有播放记录，如果有则跳转至指定的播放位置
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  // 监听视频播放事件
  handleTimeUpdate(event){
    // console.log(event)
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    // 判断记录播放时长的数组videoUpdateTime中是否有当前视频的播放记录
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){ // 之前有播放记录
      videoItem.currentTime = event.detail.currentTime
    }else{ // 没有播放记录
      videoUpdateTime.push(videoTimeObj)
    }
    // 更新videoUpdateTime状态
    this.setData({
      videoUpdateTime
    })
  },

  // 视频播放结束事件回调
  handleEnd(event){
    // 记录播放时长数组中移除当前视频记录的对象
    let {videoUpdateTime} = this.data
    // 获取当前结束视频的播放记录在videoUpdateTime中的下标
    let videoIndex = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id)
    videoUpdateTime.splice(videoIndex, 1) // 移除播放结束视频的记录
    this.setData({
      videoUpdateTime
    })
  },
  
  // 自定义下拉刷新视频列表：scroll-view
  handleRefresher(){
    console.log("scroll-view 下拉刷新")
    // 再次发送请求，获取最新的视频列表数据
    this.getVideoList(this.data.navId)
  },

  // 自定义上拉触底回调：scroll-view
  handleToLower(){
    console.log("scroll-view 上拉触底")
    // 数据分页：1.前端分页  2.后端分页
    console.log("发送请求 || 在前端截取最新的数据 追加到列表最后")
    console.log("网易云音乐暂时没有提供分页的api")
    // 模拟数据:再次使用获取到的数据追加
    let newVideoList = this.data.videoList
    let videoList = this.data.videoList
    // 将视频最新的数据更新到原有视频列表videoList中
    videoList.push(...newVideoList)
    this.setData({
      videoList
    })
  },

  // 跳转至搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
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
    // 需要在app.json的window选项中或页面配置中开启enablePullDownRefresh
    console.log('页面下拉回调')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底')
  },

  /**
   * 用户点击右上角分享
   * 需要在https://mp.weixin.qq.com/配置体验成员
   */
  onShareAppMessage: function ({from}) { // 结构转发事件来
    console.log(from)
    if(from === 'button'){
      return{
        title: '来自button的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/1.jpg'
      }
    }else{
      return{
        title: '来自manu的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/1.jpg'
      }
    }
    
  }
})