<template>
    <div class="draw-lots-page">
        <div class="draw-lots-item">
            <div class="header"> {{ gameData.headerTitle }} </div>
            <div class="content">
                <div class="content-header">选择成员</div>
                <div class="content-wrap">
                    <div class="history-member" style="flex: 1;">
                        <div class="history-member-item" v-for="member in historyMember" :key="member.id">
                            <div class="head-portrait">
                                <img alt="" :src="member.headPortrait">
                            </div>
                            <span>{{ member.memberName }}</span>
                            <i class="el-icon-close" title="删除"></i>
                        </div>
                        <div class="history-member-item" @click="isAddMember = true"><i class="el-icon-plus"></i> 添加队员</div>
                    </div>
                    <el-form label-width="70px" :model="memberInfo" v-if="isAddMember">
                        <el-form-item label="选择头像">
                            <div class="head-portrait-item">
                                <el-button size="mini">更换头像</el-button>
                                <div class="head-portrait">
                                    <img alt="" :src="memberInfo.headPortrait">
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="成员名称">
                            <el-input v-model="memberInfo.memberName" size="mini" placeholder="请输入成员名称" style="width: 300px"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="成员定位">
                            <el-radio v-model="memberInfo.memberShip" label="leader">队长</el-radio>
                            <el-radio v-model="memberInfo.memberShip" label="underling">队员</el-radio>
                        </el-form-item> -->
                        <div class="form-footer">
                            <el-button size="mini" @click="addMember">确定</el-button>
                            <el-button size="mini" @click="isAddMember = false">取消</el-button>
                        </div>
                    </el-form>
                    <!-- <gashaponMachineVue></gashaponMachineVue> -->
                </div>
            </div>
            <div class="content">
                <div class="content-header">参加成员</div>
                <div class="content-wrap">
                    <div class="history-member" style="flex: 1;min-height: 100px;">
                        已有成员
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import gashaponMachineVue from './gashapon-machine.vue'
export default {
    props: {
        gameData: Object
    },
    components: {
        gashaponMachineVue
    },
    data(){
        return {
            memberInfo: {
                headPortrait: require('../../assets/img/dog.gif'),
                memberName: '',
                memberShip: 'underling',
                id: ''
            },
            historyMember: [
                { id: '1', memberName: '胡歌', memberShip: 'leader',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '2', memberName: '彭于晏', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '3', memberName: '陈冠希', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '4', memberName: '吴彦祖', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '5', memberName: '刘亦菲', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '6', memberName: '刘诗诗', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '7', memberName: '刘诗诗1', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '8', memberName: '无上太乙救苦天尊', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
                { id: '9', memberName: '九天应元雷声普化天尊', memberShip: 'underling',headPortrait: require('../../assets/img/dog.gif'),},
            ],
            isAddMember: false
        }
    },
    methods: {
        addMember() {
            if(!this.memberInfo.memberName){
                return
            }
            this.memberInfo.id = this.memberInfo.memberName + this.historyMember.length
            this.historyMember.push(this.memberInfo)
            this.memberInfo = {
                headPortrait: require('../../assets/img/dog.gif'),
                memberName: '',
                memberShip: 'underling',
                id: ''
            }
        },
    }
}
</script>
<style lang="less" scoped>
.draw-lots-page {
    .history-member {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        border: 1px solid #2a87b3;
        border-radius: 8px;
        margin-right: 10px;
        padding: 10px;
        min-height: 150px;
        .history-member-item {
            position: relative;
            display: flex;
            align-items: center;
            height: 46px;
            padding: 8px 14px;
            border: 1px solid #2a87b3;
            border-radius: 6px;
            margin-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            .el-icon-close {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 12px;
                color: #fff;
                background-color: #2a87b3;
                border-radius: 0 0 0 50% ;
            }
        .head-portrait {
            width: 34px;
            height: 34px;
            margin-right: 10px;
            border-radius: 50%;
            overflow: hidden;
        }
        }
    }
    .head-portrait-item {
        height: 100%;
        .head-portrait {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
        }
    }

}
</style>