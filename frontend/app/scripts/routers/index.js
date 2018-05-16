import userRoutes from './user';

const Home = require('../views/home');
const Report = require('../views/report');
const AddAlert = require('../views/addAlert');
const Remark = require('../views/remark');
const AddYuqing = require('../views/addYuqing');
const ShowYuqing = require('../views/showYuqing');
const Detail = require('../views/detail');

let baseRoutes = [{
  path: '/yq/',
  name: 'home',
  component: Home,
  alias: '/yq/home'
},{
  path:'/yq/report',
  name:'report',
  component:Report
},{
  path:'/yq/addAlert',
  name:'addAlert',
  component:AddAlert
},{
  path:'/yq/remark',
  name:'remark',
  component:Remark
},{
  path:'/yq/addYuqing',
  name:'addYuqing',
  component:AddYuqing
},{
  path:'/yq/detail',
  name:'detail',
  component:Detail
  // meta: {
  //   noNav: true
  // }
},{
  path:'/yq/showYuqing',
  name:'/showYuqing',
  component:ShowYuqing
}];

let routes = baseRoutes.concat(userRoutes);

export default routes;
