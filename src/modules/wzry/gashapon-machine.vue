<template>
    <div class="draw-lots-page">
        <div class="gashapon-machine">
            <div class="title">抽签小助手</div>
            <!-- <div> -->
            <!-- <el-button type="primary" size="small">点击添加成员</el-button> -->
            <!-- </div> -->
            <div class="container-comm member-add">
                <div :class="{'label-active': currentLabel === 1 }" class="container-label blue-leader" @click="chooseLabel(1)">蓝队队长</div>
                <div :class="{'label-active': currentLabel === 2 }" class="container-label red-leader" @click="chooseLabel(2)">红队队长</div>
                <div :class="{'label-active': currentLabel === 3 }" class="container-label common" @click="chooseLabel(3)">添加成员</div>
                <div class="member-input">
                    <el-input v-model="menberName" style="margin-right: 10px;"></el-input>
                    <el-button type="primary" style="width: 80px;" size="small" @click="appendMember"
                        :disabled="!menberName">添加</el-button>
                </div>
            </div>
            <div class="container-comm member-list">
                <div class="container-label">全部成员</div>
                <div class="member-tag">
                    <el-tag v-for="(tag, index) in memberList" :key="tag.id" :closable="true" :type="tag.type" :title="tag.name"
                        @close="clearMember(tag,index)">
                        {{ tag.name }}
                    </el-tag>
                </div>
            </div>
            <div class="gashapon-machine-allocation">
                <div class="team blue-team">
                    <div class="team-label">蓝队</div>
                    <div class="team-content blue-team-content" v-for="(blue, blueIndex) in blueTeam" :key="blueIndex">
                        <div class="team-member blue-team-member" :title="blue.name">
                            <span>{{ blue.name || '待定' }}</span>
                            <i class="el-icon-s-flag" title="队长" v-if="blue.id === 'blueLeader'"></i>
                        </div>
                    </div>
                    <el-popover placement="right" title="手动添加成员" width="400" trigger="click" v-model="bluePopoverVisible">
                        <div class="hand-select">
                            <div class="hand-select-content">
                                <div class="hand-select-member hand-blue" :class="{ 'hand-active': currentIndex === index }"
                                    v-for="(member, index) in filterList" :key="member.id" @click="currentIndex = index">
                                    {{ member.name }}
                                </div>
                            </div>
                            <div style="text-align:right">
                                <el-button type="primary" plain size="mini" @click="bluePopoverVisible = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="handleSelect(filterList[currentIndex], 'blue');bluePopoverVisible = false">确定</el-button>
                            </div>
                        </div>
                        <i class="el-icon-thumb hand" slot="reference" title="手动添加成员"></i>
                    </el-popover>
                </div>
                <div class="draw-block">
                    <div style="text-align:center">
                    </div>
                    <img src="../../assets/img/dog.gif" @click="refresh" title="点击重置队伍">
                    <div>幸运儿</div>
                    <div class="lucky-dom" :style="{ 'color': currentTeamType === 'blue' ? '#3387F3': currentTeamType === 'red' ? '#E84D4D' : ''}">{{ showName || '会是谁呢？' }}</div>
                    <div class="draw-block-btn">
                        <div class="draw-block-btn-blue" @click="start('blue')">获取蓝队</div>
                        <div class="draw-block-btn-red" @click="start('red')">获取红队</div>
                    </div>
                </div>
                <div class="team red-team">
                    <div class="team-label">红队</div>
                    <div class="team-content blue-team-content" v-for="(red, redIndex) in redTeam" :key="redIndex">
                        <div class="team-member blue-team-member" :title="red.name">
                            <span>{{ red.name || '待定' }}</span>
                            <i class="el-icon-s-flag" title="队长" v-if="red.id === 'redLeader'"></i>
                        </div>
                    </div>

                    <el-popover placement="left" title="手动添加成员" width="400" trigger="click" v-model="redPopoverVisible">
                        <div class="hand-select">
                            <div class="hand-select-content">
                                <div class="hand-select-member hand-red" :class="{ 'hand-active': currentIndex === index }"
                                    v-for="(member, index) in filterList" :key="member.id" @click="currentIndex = index">
                                    {{ member.name }}
                                </div>
                            </div>
                            <div style="text-align:right">
                                <el-button type="primary" plain size="mini" @click="redPopoverVisible = false">取消</el-button>
                                <el-button type="primary" size="mini" @click="handleSelect(filterList[currentIndex], 'red');redPopoverVisible = false">确定</el-button>
                            </div>
                        </div>
                        <i class="el-icon-thumb hand" slot="reference" title="手动添加成员"></i>
                    </el-popover>
                </div>
            </div>
            <div class="draw-dialog" v-if="isShowDialog">
                <audio src="../../assets/mp3/dog.mp3" controls autoplay></audio>
                <div class="draw-box" v-for="item in 9" :key="item">
                    <div style="width: 150px;height: 100px;text-align: center;font-size: 20px;" v-if="item === 5">
                        <p>恭喜你这个B</p>
                        <p>抽到了</p>
                        <p style="color: lightcoral;">{{ showName }}</p>
                        <p>这个帅比！</p>
                    </div>
                    <img src="../../assets/img/yeah.gif" alt="" style="width: 100px;height: 100px;" v-else>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            memberList: [
                // { name: '蓝队队长', type: 'default', id: 'blueLeader',},
                // { name: '红队队长', type: 'danger', id: 'redLeader' },
                // { name: '成员3', type: 'info', id: 3 },
                // { name: '成员4', type: 'info', id: 4 },
                // { name: '成员5', type: 'info', id: 5 },
                // { name: '成员6', type: 'info', id: 6 },
                // { name: '成员7', type: 'info', id: 7 },
                // { name: '成员8', type: 'info', id: 8 },
                // { name: '成员9', type: 'info', id: 9 },
                // { name: '成员10', type: 'info', id: 10 },
            ],
            menberName: '',
            inputVisible: false,
            inputValue: '',
            blueTeam: [],
            redTeam: [],
            currentTeamType: '',
            teamLeader: '蓝队',
            showName: '',
            timerId: null,
            flag: true,
            time: 10,
            currentIndex: 0,
            bluePopoverVisible: false,
            redPopoverVisible: false,
            isShowDialog: false,
            currentLabel: 1,
        };
    },
    computed: {
        filterList() {
            return this.memberList.filter(item => {
                return item.type === 'info'
            })
        }
    },
    methods: {
        chooseLabel(type){
            let index = -1
            if(type === 1){
                index = this.memberList.findIndex( item => {
                    return item.id === 'blueLeader'
                })
            }else if(type === 2){
                index = this.memberList.findIndex( item => {
                    return item.id === 'redLeader'
                })
            }
            if(index !== -1) return
            this.currentLabel = type
        },
        appendMember() {
            this.memberList.push({
                name: this.menberName,
                type: this.currentLabel === 1 ? 'default' : this.currentLabel === 2 ? 'danger' : 'info',
                id: this.currentLabel === 1 ? 'blueLeader' : this.currentLabel === 2 ? 'redLeader' : this.memberList && this.memberList.length ? this.memberList[this.memberList.length -1].id + 1 : 1
            })
            if(this.currentLabel === 1){
                this.blueTeam.unshift({
                    name: this.menberName,
                    type: 'default',
                    id: 'blueLeader'
                })
                if(this.redTeam.findIndex(item => item.id === 'redLeader') === -1 ){
                    this.currentLabel = 2
                }else{
                    this.currentLabel = 3
                }
            }else if(this.currentLabel === 2){
                this.redTeam.unshift({
                    name: this.menberName,
                    type: 'danger',
                    id: 'redLeader'
                })
                if(this.blueTeam.findIndex(item => item.id === 'blueLeader') === -1 ){
                    this.currentLabel = 1
                }else{
                    this.currentLabel = 3
                }
            }
            this.$message.success(`队员 ${this.menberName} 添加成功`)
            this.menberName = ''
        },
        clearMember(tag, index) {
            this.$message.success(`你移除了队员 ${tag.name}`)
            this.memberList.splice(index, 1);
            if(!tag.type || tag.type === 'default'){
                console.log(this.blueTeam.findIndex(blue => blue.id === tag.id));
                this.blueTeam.splice(this.blueTeam.findIndex(blue => blue.id === tag.id),1)
            }else if( tag.type === 'danger'){
                this.redTeam.splice(this.redTeam.findIndex(red => red.id === tag.id),1)
            }
        },
        handleSelect(member, teamType) {
            if(!member) return
            if (teamType === 'blue') {
                this.blueTeam.push({
                    name: member.name,
                    type: teamType,
                    id: member.id
                })
            }else if(teamType === 'red'){
                this.redTeam.push({
                    name: member.name,
                    type: teamType,
                    id: member.id
                })
            }
            this.memberList.forEach( item => {
                if( item.name === member.name){
                    item.type = teamType === 'blue' ? 'default' : 'danger'
                }
            })
            this.$message.success('作弊成功')
        },
        refresh(){
            let blueIndex = this.memberList.findIndex(item => {
                return item.id === 'blueLeader'
            } )
            let redIndex = this.memberList.findIndex(item => {
                return item.id === 'redLeader'
            } )
            this.blueTeam = [
                {
                    name: this.memberList[blueIndex].name,
                    type: 'default',
                    id: 'blueLeader'
                }
            ]
            this.redTeam = [
                {
                    name: this.memberList[redIndex].name,
                    type: 'default',
                    id: 'blueLeader'
                }
            ]
            this.memberList.forEach( item => {
                if( item.id !== 'blueLeader' && item.id !== 'redLeader'){
                    item.type = 'info'
                }
            })
            this.$message.success('如果能重来，那我就重来')
        },
        start(teamType) {
            if (!this.flag) return
            if(this.isShowDialog) return
            if(this.memberList.filter(item => item.type === 'info').length === 0){
                this.$message.warning('没人了，别抽了')
                return
            }
            let t = 2000
            if(this.memberList.filter(item => item.type === 'info').length === 1) t = 500
            this.currentTeamType = teamType
            this.flag = false
            const fn = () => {
                // 随机数
                // random() 生成 0 ~ 1 的随机数, 左闭右开
                const ReMembers = this.memberList.filter(item => item.type === 'info')
                const random = parseInt(Math.random() * ReMembers.length)
                // 3. 随机修改页面上显示的名字
                this.showName = ReMembers[random].name
                // 做完任务后, 再开启定时器
                this.timerId = setTimeout(fn, this.time)
            }
            this.timerId = setTimeout(fn, this.time)

            // 同时开启一个延时定时器, 3 秒后清除上面的定时器
            setTimeout(() => {
                // this. 除了可以访问 data 中的属性, 也可以访问 methods 中定义的方法
                this.stop(teamType,t)
            }, t)
        },
        stop(teamType, t) {
            // 迷惑用户的, 让速度变慢
            let slowId = setInterval(() => {
                this.time += 20
            }, 200)
            // 这里是直接停下
            setTimeout(() => {
                this.flag = true
                clearInterval(this.timerId)
                // 彻底停下时, 还需要清除刚刚开启的修改 time 的定时器
                clearInterval(slowId)
                // 还需要将 time 还原成 10
                this.time = 10

                // 为全部成员添加状态 '' 为蓝队，  'danger' 为红队
                this.memberList.forEach(item => {
                    if (item.name === this.showName) {
                        item.type = teamType === 'blue' ? '' : 'danger'
                        if (teamType === 'blue') {
                            this.blueTeam.push({
                                name: item.name,
                                type: teamType,
                                id: item.id
                            })
                        } else if (teamType === 'red') {
                            this.redTeam.push({
                                name: item.name,
                                type: teamType,
                                id: item.id
                            })
                        }
                    }
                })
                this.isShowDialog = true
                setTimeout(() => {
                    this.isShowDialog = false
                },3000)
            }, t)
        },
    }
}
</script>

<style scoped lang="less">
.draw-lots-page {
    position: relative;
    height: 100%;
    padding: 10px;

    .gashapon-machine {
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 600px;
        height: 700px;
        padding: 10px;
        border: 1px solid #3387F3;
        border-radius: 8px;

        .title {
            text-align: center;
        }

        .container-comm {
            position: relative;
            display: flex;
            border: 1px solid #3387F3;
            border-radius: 0 4px 4px 4px;
            margin-top: 40px;
            padding: 10px;

            .container-label {
                position: absolute;
                top: -28px;
                left: -1px;
                width: 80px;
                // height: 30px;
                font-size: 14px;
                background-color: #3387F3;
                padding: 4px;
                color: #fff;
                text-align: center;
                border-radius: 4px 4px 0 0;
                cursor: pointer;
            }
            .blue-leader {
                left: -1px;
                background-color: #3387F3;
                opacity: .3;
            }
            .red-leader {
                left: 100px;
                background-color: #E84D4D;
                opacity: .3;
            }
            .common {
                left: 200px;
                background-color: #3387F3;
                opacity: .3;
            }
            .label-active {
                opacity: 1;
            }

            .member-tag {
                flex: 1;
                min-height: 30px;
                .el-tag {
                    margin: 0 8px 8px 0;
                    white-space: nowrap; // 防止文字换行
                    overflow: hidden; // 隐藏超出容器的部分
                    text-overflow: ellipsis; // 显示省略号
                }

            }
        }

        .member-add {
            .member-input {
                flex: 1;
                display: flex;
                justify-content: space-between;

                /deep/.el-input__inner {
                    height: 30px;
                }
            }
        }

        .gashapon-machine-allocation {
            flex: 1;
            display: flex;
            justify-content: space-between;
            margin-top: 50px;

            .draw-block {
                position: relative;
                width: 38%;
                text-align: center;

                img {
                    margin-top: 50px;
                    width: 50%;
                    aspect-ratio: 1 / 1;
                }
                .lucky-dom{
                    padding: 5px 10px;
                    font-size: 20px;
                }

                .draw-block-btn {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: absolute;
                    left: 50%;
                    top: 80%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    text-align: center;
                    color: #fff;

                    .draw-block-btn-blue {
                        border-radius: 4px;
                        padding: 10px;
                        flex: 1;
                        background-color: #3387F3;
                        margin-right: 5px;
                        box-shadow: 0 4px 10px 0 #ebf5ff;
                        cursor: pointer;
                    }

                    .draw-block-btn-red {
                        border-radius: 4px;
                        padding: 10px;
                        flex: 1;
                        margin-left: 5px;
                        background-color: #E84D4D;
                        box-shadow: 0 4px 10px 0 #F8D8D8;
                        cursor: pointer;
                    }
                }
            }

            .team {
                position: relative;
                width: 30%;
                padding: 10px;
                display: flex;
                flex-direction: column;
                // justify-content: space-around;

                .team-label {
                    position: absolute;
                    top: -28px;
                    width: 80px;
                    font-size: 14px;
                    padding: 4px;
                    color: #fff;
                    text-align: center;
                    border-radius: 4px 4px 0 0;
                }

                .team-content {
                    padding: 10px 5px;
                    border-radius: 4px;
                    margin-bottom: 15px;

                    .team-member {
                        display: flex;

                        i {
                            width: 30px;
                            font-size: 20px;
                        }

                        span {
                            flex: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }

            .blue-team {
                border: 1px solid #3387F3;
                border-radius: 0 4px 4px 4px;

                .hand {
                    position: absolute;
                    right: 0;
                    top: -20px;
                    color: #3387F3;
                    cursor: pointer;
                }

                .team-label {
                    background-color: #3387F3;
                    left: -1px !important;
                }

                .team-content {
                    border: 1px solid #3387F3;

                    .team-member {
                        i {
                            color: #3387F3;
                        }
                    }
                }
            }

            .red-team {
                border: 1px solid #E84D4D;
                border-radius: 4px 0 4px 4px;

                .hand {
                    position: absolute;
                    left: 0;
                    top: -20px;
                    color: #E84D4D;
                    cursor: pointer;
                }

                .team-label {
                    background-color: #E84D4D;
                    right: -1px !important;
                }

                .team-content {
                    border: 1px solid #E84D4D;

                    .team-member {
                        i {
                            color: #E84D4D;
                        }
                    }
                }
            }
        }
    }
    .draw-dialog{
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 400px;
        height: 330px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fff;
        audio {
            position: absolute;
            opacity: 0;
        }
        // .draw-dialog-box {
        // }
    }
}
</style>
<style lang="less">
.el-popover {
    .hand-select {
        .hand-select-content {
            display: flex;
            flex-wrap: wrap;
            padding: 10px;

            .hand-select-member {
                padding: 5px 10px;
                margin: 0 8px 8px 0;
                border-radius: 4px;
                cursor: pointer;
            }

            .hand-blue {
                border: 1px solid #3387F3;
            }

            .hand-red {
                border: 1px solid #E84D4D;
            }

            .hand-blue.hand-active {
                background-color: #ebf5ff;
                color: #3387F3;
            }

            .hand-red.hand-active {
                background-color: #fbd8d9;
                color: #E84D4D;
            }
        }
    }
}</style>