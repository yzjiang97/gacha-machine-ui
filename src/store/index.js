/*
 * @Author: yz.jiang
 * @Date: 2025-03-28 10:26:18
 * @LastEditTime: 2025-05-28 15:48:46
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /draw-lots-ui/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    companyName: '发光的木头文化',
    gamesList: [
        { 
            gaName: '王者荣耀', 
            gaId: 'wzry', 
            activityNames: [
                { acId: 'wzry1', path: 'wzry', acName: '自由竞技', component: 'free-sport'},
            ] 
        },
        { 
            gaName: '剑网三', 
            gaId: 'jx3', 
            activityNames: [
                { acId: 'jx3', path: 'jx3', acName: '角色抽签', component: 'role-draw'},
            ] 
        },
        { 
            gaName: '七嘴八舌', 
            gaId: 'qzbs', 
            activityNames: [
                { acId: 'qzbs1', path: 'jtyj', acName: '鸡同鸭讲', pageId: 'free.sport1'},
                { acId: 'qzbs2', path: 'hstz', acName: '画蛇添足', pageId: 'free.sport2'},
            ] 
        },{ 
            gaName: '实用工具', 
            gaId: 'sygj', 
            activityNames: [
                { acId: 'sygj1', path: 'tbpb', acName: '图标排版', component: 'icon-layout'},
            ] 
        },
    ],
    routes: [],
    addRoutes: [],
}
const mutations = {
}
const actions = {
}

export default new Vuex.Store({
    actions,
    mutations,
    state
})