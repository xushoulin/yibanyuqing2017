export default {
  baseURL: process.env.NODE_ENV === 'production'? '/yq' : '', 
  //测试服务 http://10.21.3.91:18080
  //正式服务 http://10.21.68.24:18080
  global: {
    getMenu: '/data/menu.json',
  },
  user: {
    getList: '/data/user.json'
  },
  menu:{
    getYuqing:'/yibanSA/topicCtrl/queryPageTopicBySchemaId.do',//舆情信息列表
    getYuqingPlan:'/yibanSA/schemeCtrl/queryPageSchemaByUserId.do',//舆情方案列表
    deleteYuqingPlans:''
  }
};
