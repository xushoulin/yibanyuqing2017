/**
 * Created by weijian on 2017/6/22.
 */
 import Vue from 'vue'
 import Vuex from 'vuex'
 import 'babel-polyfill'

 Vue.use(Vuex);


 const state = {
 	planID:''
 };

 const mutations = {
 	SET_PLANID (state,planID){
 		state.planID = planID;
 	}
 };


 export default new Vuex.Store({
 	state,
 	mutations
 })
