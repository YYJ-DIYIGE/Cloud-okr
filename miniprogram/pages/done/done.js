const App = getApp();
import {formatTime} from "./../../utils/utils.js";
const db = wx.cloud.database()
const _ = db.command
Page({
  data:{
    todo:[],
    status: ""
  },
  onShow:function(){
    const _openid = App.globalData.openid;
    db.collection('todos').where(_.and({
      _openid:_openid,
      status:true
    })).get({
      success: res =>{
        res.data.forEach(data => {
          data.created_time = formatTime(data.created_time)
          if(data.finish_time){
            data.finish_time = formatTime(data.finish_time)
          }
        });
      this.setData({
        todo:res.data
      });
      }
    })
  },
  operation:function(e){
   let id = e.currentTarget.dataset.id;
   let status = e.currentTarget.dataset.status;
   this.setData({status})
   wx.showActionSheet({
     itemList: ['标记未完成','删除'],
     itemColor: '#000000',
     success: (res)=>{
       console.log
       switch(res.tapIndex){
        case 0:
          this.handleState(id)
          break;
        case 1:
          this.handleDelete(id)
          break;
       }
     }
   })
  },
  handleState:function(id){
  let status = this.data.status
   wx.cloud.callFunction({
     name: 'todos',
      data:{
        _id: id,
        action: 'handleState',
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
  handleDelete:function(id){
    wx.cloud.callFunction({
      name:"todos",
      data:{
        _id:id,
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