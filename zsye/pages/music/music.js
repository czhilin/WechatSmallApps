var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');

var app = getApp();

import {
  MUSIC_PALY_IMG,
  MUSIC_PAUSE_IMG
} from '../../utils/constants.js'

Page({
  data: {
    musics: [],
    current: 0,
    playId: -1,
    babydate: '',
    loading: false,
    loadingMsg: '加载中...'
  },
  onShareAppMessage: function () {
    return {
      title: '掌上育儿',
      desc: '更懂你的私人育儿管家',
      path: '/pages/music/music'
    }
  },
  onLoad: function () {
    // api.getMusicIdList({
    //   success: (res) => {
    //     if (res.data.res === 0) {
    //       let idList = res.data.data
    //       this.getMusics(idList)
    //     }
    //   }
    // })

    var _this = this;
    //检查账户信息设置
    var babyData = app.globalData.babySetting;
    if (babyData.babyNickName == '' || babyData.babyDateValue == '') {
      wx.redirectTo({
        url: '../baby/setting/setting'
      });
    }

  },
  onReady: function () {
    // wx.setNavigationBarTitle({
    //   title: '音乐'
    // })


    var _this = this;

    var babyData = app.globalData.babySetting;

    _this.setData({

      babydate: babyData.babyDateValue
    });

    let babydate = _this.data.babydate;

    _this.setData({ loading: true });
    requests.getTopStoryList(babydate, (data) => {

      var result = data.result;
      console.log(result);
      for(var i=0;i<result.length;i++){
        result[i].playImg = MUSIC_PALY_IMG
      }
      //music.playImg = MUSIC_PALY_IMG

      _this.setData({ musics: result })
    }, null, () => {
      _this.setData({ loading: false });
    });


  },

  //===============================================================
  // getMusics: function (idList) {
  //   let musics = this.data.musics

  //   if (idList.length > 0) {
  //     api.getMusicDetailById({
  //       query: {
  //         id: idList.shift()
  //       },
  //       success: (res) => {
  //         if (res.data.res === 0) {
  //           let music = res.data.data

  //           music.playImg = MUSIC_PALY_IMG
  //           music.contentType = 'story'
  //           music.story = util.filterContent(music.story)
  //           music.maketime = util.formatMakettime(music.maketime)
  //           musics.push(music)
  //         }
  //         this.getMusics(idList)
  //       }
  //     })
  //   } else {
  //     this.setData({ musics })
  //   }
  // },
  // handleChange: function (e) {
  //   let current = e.detail.current
  //   let length = this.data.musics.length

  //   if (current === length) {
  //     this.setData({
  //       current: length
  //     })
  //     wx.navigateTo({
  //       url: '../history/history?page=music',
  //       success: () => {
  //         this.setData({
  //           current: length - 1
  //         })
  //       }
  //     })
  //   }
  // },
  togglePlay: function (e) {
    let musics = this.data.musics
    let playId = this.data.playId
    let musicId = e.target.dataset.id
    let music = musics.find((music) => music.acskey === musicId)

    musics = musics.map((music) => {
      music.playImg = MUSIC_PALY_IMG
      return music
    })
    if (playId !== musicId) {
      playId = musicId
      music.playImg = MUSIC_PAUSE_IMG
      
      this.playMusic(music)
    } else {
      playId = -1
      music.playImg = MUSIC_PALY_IMG
      this.pauseMusic()
    }

    this.setData({ musics, playId })
  },
  playMusic: function (music) {
    wx.playBackgroundAudio({
      dataUrl: 'https://wx.zsye.com/zhangy'+music.musicurl,
      title: music.title
    })
  },
  pauseMusic: function () {
    wx.pauseBackgroundAudio()
  }

})