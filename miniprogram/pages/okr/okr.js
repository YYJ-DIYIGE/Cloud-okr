const App = getApp();
import {formatTime} from "./../../utils/utils.js";
const db = wx.cloud.database()
const _ = db.command
Page({
  data:{
    objective:[],
    status:''
  },
  onShow:function(){
    let _openid =  App.globalData.openid;
    db.collection('object').where(_.and({_openid})).get({
      success: res =>{
       res.data.forEach(data =>{
          data.create_time = formatTime(data.create_time)
          if(data.finish_time){
            data.finish_time  = formatTime(data.finish_time)
          }
       })
       this.setData({objective:res.data})
      }
    })
  },
  operation:function(e){
    let _id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status;
    let change = status ? '标记未完成' : '标记完成'
    this.setData({status})
    wx.showActionSheet({
      itemList: ['查看',change,'编辑','删除'],
      itemColor: '#000000',
      success: (res)=>{
        console.log
        switch(res.tapIndex){
          case 0:
            wx.navigateTo({
              url: `../okrDetall/okrDetall?id=${_id}`
            })
            break;
          case 1:
            this.handleState(_id)
            break;
          case 2:
            wx.navigateTo({
              url: `../okrEdit/okrEdit?id=${_id}`
            })
            break;
          case 3:
            this.handleDelete(_id)
            break;
        }
      }
    })
  },
  handleState:function(_id){
    let status = this.data.status;
    wx.cloud.callFunction({
      name: 'okr',
      data:{
        _id: _id,
        action: "handleState",
        status
      },
      success: (res) =>{
        if(res.result.code == 200){
          this.onShow()
          wx.showToast({
            icon: 'none',
            title: '修改成功'
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.result.mesagess
          })
        }
       }
    })

  },
  handleDelete:function(_id){
    wx.cloud.callFunction({
      name:"okr",
      data:{
        _id:_id,
        action:'handleDelete'
      },
      success: (res) =>{
        if(res.result.code == 200){
          this.onShow()
          wx.showToast({
            icon: 'none',
            title: '删除成功'
          })
        }else{
          wx.showToast({
            icon: 'none',
            title: res.result.mesagess
          })
        }
        }
    })
  }
})