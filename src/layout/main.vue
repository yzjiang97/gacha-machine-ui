<!--
 * @Author: yz.jiang
 * @Date: 2025-03-28 10:26:18
 * @LastEditTime: 2025-03-28 11:29:29
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /draw-lots-ui/src/layout/main.vue
-->
<template>
    <div class="lots-page">
        <div class="lots-header">
            <div class="lots-logo">
                <img src="../assets/img/logo.png" alt="">
                <h3>{{ companyName }}</h3>
            </div>
        </div>
        <div class="lots-tabs">
            <!-- <div class="lots-tabs-game" :class="{'lots-tabs-game-split': index < gamesList.length - 1 }" v-for="(game, index) in gamesList" :key="game.id">
                {{ game.name }}
            </div> -->
            <el-dropdown class="lots-tabs-game" :class="{ 'lots-tabs-game-split': index < gamesList.length - 1 }"
                v-for="(game, index) in gamesList" :key="game.gaId"
                @command="(command) => handleCommand(command, game.gaName)">
                <div class="el-dropdown-link">
                    {{ game.gaName }}
                </div>
                <el-dropdown-menu slot="dropdown" style="width: 200px;background-color: #85d0d3;">
                    <el-dropdown-item v-for="activity in game.activityNames" :key="activity.acId"
                        style="color: #2a87b3;text-align: center;" :command="activity.component">
                        {{ activity.acName }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="lots-area">
            <lots-area :params="params" ></lots-area>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            params: {
                component: 'free-sport',
                headerTitle: '王者荣耀 -> 自由竞技'
            }
        }
    },
    computed: {
        companyName() {
            return this.$store.state.companyName
        },
        gamesList() {
            return this.$store.state.gamesList
        },
    },
    components: {
    },
    methods: {
        handleCommand(command, gaName) {
            this.params.component = command
            this.gamesList.forEach(game => {
                if (game.gaName === gaName) {
                    game.activityNames.forEach(activity => {
                        if (activity.component === command) {
                            this.params.headerTitle = gaName + ' -> ' + activity.acName
                        }
                    })
                }
            })
        }
    }
}
</script>