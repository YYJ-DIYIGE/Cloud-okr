const db = wx.cloud.database() 
Page({
  data:{
    okrArr:[],
    krdata:[],
    status:'',
    id:''
  },
  onLoad:function(options){
    this.setData({id:options.id})
    this.getOkrDetall()
  },
  getOkrDetall:function(){
    let _id = this.data.id;
    wx.cloud.callFunction({
      name: "okr",
      data:{
        _id,
        action:"getokrDetall"
      },
      success:res =>{
        this.setData({okrArr:res.result.objective.data,krdata:res.result.krdata})
      }
    })
  },
  operation:function(e){
    let id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status;
    let change = status ? '标记未完成' : '标记完成'
    this.setData({status})
    wx.showActionSheet({
      itemList: [change,'删除'],
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
    let status = this.data.status;
    wx.cloud.callFunction({
      name: 'okr',
      data:{
        id: id,
        action: "updateDatell",
        status
      },
      success: (res) =>{
        if(res.result.code == 200){
          this.getOkrDetall()
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
      name: 'okr',
      data:{
        id: id,
        action: "deleteDatell",
      },
      success: (res) =>{
        if(res.result.code == 200){
          this.getOkrDetall()
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