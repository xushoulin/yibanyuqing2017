import * as types from './mutation-types';

const mutations = {
  [types.MENUS](state, { menus }) {
    state.menus = menus;
  },
  [types.GET_PLANS](state,{plans}){
    state.plans = plans;
  },
  [types.GET_YUQING](state,{yuqingPlan}){
    state.yuqingPlan = yuqingPlan;
  },
  [types.GET_PAGE](state,{plansPage}){
    state.plansPage = plansPage;
  },
  [types.GET_DIMENSIONS](state, {dimensions}) {
    state.dimensions = dimensions;
  }
};

export default mutations;
