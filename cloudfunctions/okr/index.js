// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env:"test-5qtqr"
})
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action){
    case "handleState":{
      return handleState(event)
    }
    case "handleDelete":{
      return handleDelete(event)
    }
    case "updateEdit":{
      return updateEdit(event)
    }
    case "getokrDetall":{
      return getokrDetall(event)
    }
    case "updateDatell":{
      return updateDatell(event)
    }
    case "deleteDatell":{
      return deleteDatell(event)
    }
    default: {
      return
    }
  }
}
async function deleteDatell(event){
  try{
    let _id = event.id;
    await db.collection("keyresult").doc(_id).remove()
    await db.collection("todoKeyresult").where({
      keyresult_id:_id
    }).remove()
    return{
      code:200,
      mesagess:"删除成功"
    }
  }catch(err){
    return{
      code:0,
      mesagess:err
    }
  }
}
async function updateDatell(event){
  try{
    let _id = event.id;
    let status = event.status;
    let finish_time = db.serverDate();
    await db.collection('keyresult').doc(_id).update({
      data:{
        status:!status,
        finish_time
      }
    })
    return{
      code:200,
      mesagess:"修改成功"
    }
  }catch(err){
    return{
      code:0,
      mesagess:err
    }
  }
}
async function getokrDetall(event){
  try{
    let _id = event._id;
    let objective =  await db.collection('object').where({_id:_id}).get();
    let keyresult = await db.collection('keyresult').where({
      objective_id: _id
    }).get();
    let keyresult_ids = keyresult.data.map(data => data._id);

    let todoKeyresult =  await db.collection('todoKeyresult').where({
      keyresult_id: _.in(keyresult_ids)
    }).get()
    let todo_id = todoKeyresult.data.map(data =>data.todo_id)
    let todos = await db.collection('todos').where({
      _id: _.in(todo_id)
    }).get()

    let krdata = {};
    keyresult.data.forEach((data,index) => {
      data.todos = [];
      krdata[index] = data
      todoKeyresult.data.forEach(data =>{
        if(keyresult.data[index]._id == data.keyresult_id){
          let todo_id = data.todo_id
          todos.data.forEach(data =>{
            if(todo_id == data._id){
              krdata[index].todos.push(data)
            }
          })
        }
      })
    });
   return{
     code:200,
     objective,
      krdata
   }
  }catch(err){
    return{
      code:0,
      mesagess:err
    }
  }
}
async function handleState(event){
  try{
    let _id = event._id;
    let status = event.status;
    let finish_time = db.serverDate();
    if(!_id || !finish_time){
      return{
        code:0,
        mesagess:"缺少参数"
      }
    }
    await db.collection('object').doc(_id).update({
      data:{
        status: !status,
        finish_time
      }
    })
    return{
      code:200,
      mesagess:'修改成功'
    }
  }catch(err){
    return{
      code: 0,
      mesagess:'服务器错误'
    }
  }
}

async function handleDelete(event){
  try{
    let _id = event._id
    if(!_id){
      return{
        code:0,
        mesagess:"缺少ID"
      }
    }
    await db.collection('object').doc(_id).remove()

    await db.collection('keyresult').where({
      objective_id: _id
    }).remove()
    return{
      code: 200,
      mesagess: '删除成功'
    }
  }catch(err){
    return{
      code: 0,
      mesagess: '服务器错误'
    }
  }
}
// async function updateEdit(event){
//   try{
//     let _id = event.id;
//     let title = event.objTxet;
//     let keyresults = event.keyresults;
//     let deleID = event.deleID;
//     let create_time = db.serverDate();
//     let status = false;
//     let finish_time = ''
//     // await db.collection('object').doc(_id).update({
//     //   data:{
//     //     title:title,create_time:create_time
//     //   }
//     // })
//     keyresults.forEach(async (data) => {
//       if(data._id){
//         let _id = data._id
//         await db.collection('keyresult').doc(_id).update({
//          data:{
//           title:data.title,create_time:create_time
//          }
//         })
//        }
//       // else{
//       //   await db.collection("keyresult").add({
//       //     data:{
//       //       title:data.title, objective_id:_id, create_time, status, finish_time
//       //     }
//       //   })
//       // }
//     })
//     // if(!deleID){
//     //   return{
//     //     code:200,
//     //     mesagess:"修改成功"
//     //   }
//     // }
//     // deleID.forEach(async (data) =>{
//     //   let _id = data;
//     //   await db.collection('keyresult').doc(_id).remove()
//     // })
//     return{
//       code:200,
//       mesagess:"修改成功"
//     }
//   }catch(err){
//    return{
//     code:0,
//     mesagess:err
//    }
//   }
// }