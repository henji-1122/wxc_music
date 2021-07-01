import PubSub from "pubsub-js"
import request from "../../../utils/request"
import monent from "moment"
// 获取全局实例
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情对象
    musicId: '', // 歌曲id
    musicLink: '', // 歌曲链接
    currentTime:'00:00', // 当前歌曲实时时间
    durationTime:'00:00', // 当前歌曲总时长
    currentWidth: 0, // 实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options) // options:用于接收理由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
    // let song = JSON.parse(options.song)

    let musicId = options.musicId
    // console.log(options, musicId)
    this.setData({
      musicId
    })
    // 获取歌曲详情
    this.getMusicInfo(musicId)

    /**
     * 问题：如果用户操作系统的控制音乐播放/暂停按钮，页面监听不到，会导致页面显示是否播放的状态和真实的音乐播放状态不一致
     * 解决方案：
     *  1. 通过控制音乐的实例backgroundAudioManager监视音乐的播放/暂停
     * */
    // 判断当前页面是否有音乐在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      // 修改当前页面音乐播放状态为true
      this.setData({
        isPlay:true
      })
    }
    // 创建控制音乐播放的实例--api
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监视音乐播放/暂停
    this.backgroundAudioManager.onPlay(()=>{
      this.changePlayState(true)

      // 修改全局音乐播放状态
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(()=>{
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
    })

    // 监听歌曲播放的进度:监听onTimeUpdate
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // console.log(this.backgroundAudioManager.duration)
      let currentTime = monent(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })

    // 监听歌曲播放结束
    this.backgroundAudioManager.onEnded(()=>{
      // 自动切换至下一首歌曲，并自动播放
      PubSub.publish('switchType', 'next')  // 只需发布切个消息即可
      // 将实时进度条长度置为0
      this.setData({
        currentTime:'00:00',
        currentWidth: 0
      })
    })
  },

  // 修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })

    // 修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 获取歌曲详情
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {ids: musicId})
    // 获取歌曲总时长 单位：ms
    let durationTime = monent(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    // 动态修改窗口标题title
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  // 点击播放/暂停回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let {musicId, musicLink} = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },

  // 控制音乐播放/暂停功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) { // 音乐播放
      if(!musicLink){ // 如果音乐链接不存在，获取音乐的播放连接
        let musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name // title必须有，否则音乐不播放
    } else { // 音乐暂停
      this.backgroundAudioManager.pause()  // 还需要在配置文件中配置字段requiredBackgroundModes
    }
  },

  // 点击切歌事件回调
  handleSwitch(event){
    let type = event.currentTarget.id
    // 关闭正在播放的音乐
    this.backgroundAudioManager.stop()
    // 订阅recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId)
      // 获取音乐详情信息
      this.getMusicInfo(musicId)
      // 自动播放音乐
      this.musicControl(true, musicId) // 此处不能传递musicLink,需要发请求获取新歌曲的链接
      // 取消订阅,防止多次订阅
      PubSub.unsubscribe('musicId')
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
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