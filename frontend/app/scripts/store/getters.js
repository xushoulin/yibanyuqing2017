const getters = {
  getMenu(state) {
    return state.menus;
  },
  getYuqing(state){
    if(state.plans){ 
      return state.plans;

    }
  },
  getYuqingPlan(state){
    if(state.yuqingPlan){
      return state.yuqingPlan;
    }
  },
  getYuqingNum(state){
    if(state.plansPage){
      return state.plansPage;
    }
  },
  dimensions(state){
    return state.dimensions;
  }
};

export default getters;
