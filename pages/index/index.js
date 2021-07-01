// pages/index/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // banner
    recommendList: [], // 推荐歌单
    rankingList:[] // 排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取banner数据
    let bannerListData = await request('/banner', {type: 2})
    console.log('banner结果数据', bannerListData)
    this.setData({
      bannerList: bannerListData.banners
    })

    // 获取推荐歌曲
    let recommendData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendData.result
    })

    
    // 获取排行榜
    /**
     * 分析：
     * - 需要根据idx的值获取对应的数据
     * - idx的取值范围是0-20，这里需要0-4
     * - 需要发送5次请求
     * */
    let index = 0
    let resultArr = []
    while (index < 5) {
      let rankingData = await request('/top/list', {idx: index++})
      let rankingListItem = {name: rankingData.playlist.name, tracks:rankingData.playlist.tracks.slice(0,3)}
      resultArr.push(rankingListItem)
      // 无需等待5次请求全部结束才更新，用户体验好，但渲染次数多
      this.setData({
        rankingList: resultArr
      })
    }
    // 此处更新数据会导致发送请求过程中页面上时间白屏，用户体验差
    // this.setData({
    //   rankingList: resultArr
    // })
  },

  // 跳转至每日推荐recommendSong页面
  goRecommendSong(){
    wx.navigateTo({
      url: '/packageSong/pages/recommendSong/recommendSong'
    })
  },

  // 跳转至每Other页面
  goOther(){
    wx.navigateTo({
      url: '/packageOther/pages/other/other'
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

