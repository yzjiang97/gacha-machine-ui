/*
 * @Author: yz.jiang
 * @Date: 2025-03-28 11:24:36
 * @LastEditTime: 2025-05-28 15:49:20
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /draw-lots-ui/src/modules/index.js
 */
// wzry
import freeSport from './wzry/free-sport.vue';

// options
import iconLayout from './options/icon-layout.vue'

// jx3
import roleDraw from './jx3/role-draw.vue';


const Loading = {
    install: function(Vue) {
        // wzry
        Vue.component('free-sport', freeSport);

        // options
        Vue.component('icon-layout', iconLayout);

        // jx3
        Vue.component('role-draw', roleDraw);
    }
};

//导出
export default Loading;