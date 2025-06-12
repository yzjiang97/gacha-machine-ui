<!--
 * @Author: yz.jiang
 * @Date: 2025-03-28 10:26:18
 * @LastEditTime: 2025-03-28 11:29:36
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /draw-lots-ui/src/components/lots-area.vue
-->
<template>
    <component :is="params.component" :params="params"></component>
</template>

<script>
export default {
    props:{
        params: Object
    },
}
</script>