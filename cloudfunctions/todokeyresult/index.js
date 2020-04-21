// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env:"test-5qtqr"
})
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getTodokey': {
      return getTodokey(event)
    }
    case 'handleOff': {
      return handleOff(event)
    }
    case 'handleBind': {
      return handleBind(event)
    }
    default: {
      return
    }
  }
}
async function getTodokey(event){
  try{
    let _openid = event._openid;
    let todo_id = event.id;
    let objective = await db.collection('object').where({
      _openid:_openid, status: false
    }).get();
    let objective_ids =  objective.data.map(data => data._id);
    let keyresults = await db.collection('keyresult').where({
      objective_id: _.in(objective_ids)
    }).get()
    let todoKeyresults = await db.collection('todoKeyresult').where({
      todo_id: todo_id
    }).get()
    let keyresult_ids = todoKeyresults.data.map(data => data.keyresult_id)
    let okr = {}
    objective.data.forEach((data,index) => {
      data.keyresults = [];
      okr[index] = data;
      objective_id = data._id
      keyresults.data.forEach(data =>{
        if(objective_id == data.objective_id){
          data.active = keyresult_ids.includes(data._id)
          okr[index].keyresults.push(data)
        }
      })
    });
    return{
      conde:200,
      okr
    }
  }catch(err){
    console.log(err)
    return{
      code:0,
      message:"服务器错误" + err,
    }
  }
}

async function handleBind(event){
  try{
    let keyresult_id = event.keyresult_id;
    let todo_id = event.todo_id;
    if(!keyresult_id || !todo_id){
      return{
        code:0,
        message:"缺少参数"
      }
    }
    await db.collection('todoKeyresult').add({
      data:{
        todo_id,keyresult_id
      }
    })
    return{
      code:200,
      message:"添加成功"
    }
  }catch(err){
    return{
      code:0,
      message:err
    }
  }
}

async function handleOff(event){
  try{
    let keyresult_id = event.keyresult_id;
    let todo_id = event.todo_id;
    if(!keyresult_id || !todo_id){
      return{
        code:0,
        message:"缺少参数"
      }
    }
   let todoKeyresult =  await db.collection('todoKeyresult').where({
      keyresult_id,todo_id
    }).get()
   let _id =  todoKeyresult.data[0]._id;
   await db.collection('todoKeyresult').doc(_id).remove()
    return{
      code:200,
     message:'取关成功'
    }
  }catch(err){
    return{
      code:0,
      message:err
    }
  }
}