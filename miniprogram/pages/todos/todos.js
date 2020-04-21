const App = getApp();
import {formatTime} from "./../../utils/utils.js";
const db = wx.cloud.database()
const _ = db.command
Page({
  data:{
    todo:[],
    value:'',
    status: ""
  },
  onShow:function(){
    const _openid = App.globalData.openid;
    db.collection('todos').where(_.and({
      _openid:_openid,
      status:false
    })).get({
        success: res =>{
          console.log(res.data)
          res.data.forEach(data => {
            data.created_time = formatTime(data.created_time)
          });
          this.setData({
            todo:res.data
          })
        }
        })
  },
  handleChange:function(e){
    let value = e.detail.value;
    this.setData({value})
  },
  addtodos:function(e){
    const _openid = App.globalData.openid;
    let title = this.data.value;
    let dis_time = new Date()
    let created_time = db.serverDate();
    let finish_time = '';
    let status = false
    if(!title){
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }
    if(!_openid){
      wx.showToast({
        icon: 'none',
        title: '请授权登录后操作',
      })
      return
    }
    db.collection('todos').add({
     data:{
      title, dis_time, created_time, finish_time,status
     },
     success: (res) =>{
      this.setData({value: ''})
      wx.showToast({
        icon: 'none',
        title: '添加成功'
      })
      this.onShow()
     },
     fail: err => {
       console.log(err)
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
     },
    complete: () => {
      wx.hideLoading()
    }
    })
  },
  operation:function(e){
   let id = e.currentTarget.dataset.id;
   let status = e.currentTarget.dataset.status;
   this.setData({status})
   wx.showActionSheet({
     itemList: ['关联','完成','删除'],
     itemColor: '#000000',
     success: (res)=>{
       console.log
       switch(res.tapIndex){
        case 0:
          wx.navigateTo({
            url: `../todo_keyresult/todo_keyresult?id=${id}`
          })
          break;
        case 1:
          this.handleState(id)
          break;
        case 2:
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