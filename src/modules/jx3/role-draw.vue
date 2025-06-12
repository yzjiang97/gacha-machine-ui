<template>
    <div class="jx3-draw">
        <div class="left">
            <p class="title">角色池</p>
            <div class="user-list" v-for="(user, index) in userList" :key="user.userName + index">
                <div class="user-header">
                    <span class="user-avatar">{{ user.userName.charAt(0).toUpperCase() }}</span>
                    <span class="user-name">{{ user.userName }}</span>
                    <div class="user-actions">
                        <el-button size="mini" @click="editUser(index)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="removeUser(index)">删除</el-button>
                    </div>
                </div>
                <div class="role-list">
                    <el-tag v-for="(role, _index) in user.roleList" :key="'role' + _index" size="small"
                        :type="getTagType(role.xinfa)" class="role-tag">
                        <span class="role-name">{{ role.roleName }}</span>
                        <span class="role-xinfa">（{{ role.xinfa }}）</span>
                    </el-tag>
                </div>
            </div>
            <div class="add-btn">
                <el-button style="width: 200px;margin-left: 50px;" size="mini" @click="openDialog()">添加玩家</el-button>
            </div>
        </div>
        <!-- 右侧结构调整 -->
        <div class="right">
            <div class="gacha-header">扭蛋机抽签</div>
            <div class="gacha-flex">
                <div class="gacha-machine-outer">
                    <div class="gacha-machine">
                        <div class="gacha-machine-top"></div>
                        <div class="gacha-machine-body">
                            <div class="gacha-balls">
                                <div
                                    v-for="(item, idx) in getVisibleBallsAndPositions()"
                                    :key="item.role.roleName + item.role.xinfa + idx"
                                    class="gacha-ball"
                                    :class="getBallClass(item.role.xinfa)"
                                    :style="item.style"
                                >
                                    <span class="ball-role-name">{{ item.role.roleName }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="gacha-machine-hole"></div>
                        <!-- 扭蛋机把手 -->
                        <div class="gacha-machine-handle"
                            :class="{ 'handle-disabled': isDrawing || selectedUserIndex === null || availableRoles.length === 0 }"
                            @click="handleDraw">
                            <div class="handle-inner"></div>
                        </div>
                        <div class="gacha-machine-bottom"></div>
                    </div>
                </div>
                <div class="gacha-result-table">
                    <!-- 角色选择区标题 -->
                    <div class="gacha-section-title">选择抽签玩家</div>
                    <div class="user-select-container">
                        <div class="user-select-blocks">
                            <div v-for="(user, idx) in userList" :key="user.userName + idx" class="user-block role-tag"
                                :class="{
                                    selected: selectedUserIndex === idx,
                                    disabled: drawResults.some(r => r.userName === user.userName)
                                }" @click="selectUser(idx)">
                                <span class="user-block-name">{{ user.userName }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 结果区标题 -->
                    <div class="gacha-section-title" style="margin-top: 10px;">抽签结果</div>
                    <div class="result-table-wrap">
                        <el-table v-if="drawResults.length" :data="drawResults" border class="theme-table" size="mini"
                            :header-cell-style="{ background: '#e9faf5', color: '#2a87b3', fontWeight: 'bold', border: '1px solid #2a87b3' }"
                            :cell-style="{ border: '1px solid #2a87b3', color: '#2a87b3' }" :row-style="{ background: '#fff' }">
                            <el-table-column prop="userName" label="玩家" />
                            <el-table-column prop="role.roleName" label="抽到角色" />
                            <el-table-column prop="role.xinfa" label="心法" :formatter="xinfaFormatter" />
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <!-- 添加/编辑玩家弹窗 -->
        <el-dialog :title="editIndex === null ? '添加玩家' : '编辑玩家'" :visible.sync="dialogVisible" width="400px"
            :before-close="handleClose">
            <el-form :model="userForm" label-width="60px">
                <el-form-item label="玩家">
                    <el-input v-model="userForm.userName" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <div v-for="(role, idx) in userForm.roleList" :key="'formrole' + idx" class="role-form-row">
                        <el-input v-model="role.roleName" size="mini" placeholder="角色名"
                            style="width: 100px; margin-right: 8px;" />
                        <el-select v-model="role.xinfa" size="mini" placeholder="心法" style="width: 70px;">
                            <el-option label="T" value="T"></el-option>
                            <el-option label="奶" value="奶"></el-option>
                            <el-option label="DPS" value="DPS"></el-option>
                        </el-select>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRole(idx)" />
                    </div>
                    <el-button v-if="userForm.roleList.length < 3" class="button-new-tag" size="mini" @click="addRole"
                        style="margin-top: 8px;">+ 添加角色</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取消</el-button>
                <el-button type="primary" @click="onSave" size="mini">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
function shuffle(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
export default {
    data() {
        return {
            userList: (() => {
                const names = [
                    '玩家一', '玩家二', '玩家三', '玩家四', '玩家五',
                    '玩家六', '玩家七', '玩家八', '玩家九', '玩家十'
                ];
                let allRoles = [];
                let userList = names.map((name, idx) => {
                    let roles = [];
                    for (let i = 1; i <= 3; i++) {
                        roles.push({ roleName: `${name}角色${i}`, xinfa: 'DPS' });
                    }
                    allRoles = allRoles.concat(roles);
                    return { userName: name, roleList: roles };
                });
                let allIdx = [];
                userList.forEach((u, ui) => u.roleList.forEach((r, ri) => allIdx.push([ui, ri])));
                let tIdx = allIdx.splice(Math.floor(Math.random() * allIdx.length), 1)[0];
                userList[tIdx[0]].roleList[tIdx[1]].xinfa = 'T';
                for (let i = 0; i < 3; i++) {
                    let nIdx = allIdx.splice(Math.floor(Math.random() * allIdx.length), 1)[0];
                    userList[nIdx[0]].roleList[nIdx[1]].xinfa = '奶';
                }
                return userList;
            })(),
            dialogVisible: false,
            userForm: {
                userName: '',
                roleList: []
            },
            editIndex: null,
            selectedUserIndex: null,
            availableRoles: [],
            drawResults: [],
            mustT: null,
            mustNai: null,
            isDrawing: false,
            displayRoles: [],
            drawTimer: null,
            isShuffling: false,
            randomBallPositions: [],
        }
    },
    watch: {
        userList: {
            handler() {
                this.resetGacha()
            },
            deep: true
        }
    },
    methods: {
        getTagType(xinfa) {
            if (xinfa === 'T') return 'danger'
            if (xinfa === '奶') return 'success'
            return ''
        },
        getBallClass(xinfa) {
            if (xinfa === 'T') return 'ball-t'
            if (xinfa === '奶') return 'ball-nai'
            return 'ball-dps'
        },
        xinfaFormatter(row) {
            if (row.role.xinfa === 'T') return 'T'
            if (row.role.xinfa === '奶') return '奶'
            return 'DPS'
        },
        openDialog() {
            this.editIndex = null
            this.userForm = { userName: '', roleList: [] }
            this.dialogVisible = true
        },
        editUser(index) {
            this.editIndex = index
            this.userForm = JSON.parse(JSON.stringify(this.userList[index]))
            this.dialogVisible = true
        },
        removeUser(index) {
            this.$confirm('确定删除该玩家及其角色？', '提示', {
                type: 'warning'
            }).then(() => {
                this.userList.splice(index, 1)
            })
        },
        addRole() {
            if (this.userForm.roleList.length >= 3) return
            this.userForm.roleList.push({ roleName: '', xinfa: 'DPS' })
        },
        removeRole(idx) {
            this.userForm.roleList.splice(idx, 1)
        },
        handleClose() {
            this.dialogVisible = false
        },
        onSave() {
            if (!this.userForm.userName) {
                this.$message.warning('请输入玩家名')
                return
            }
            if (this.userForm.roleList.length === 0) {
                this.$message.warning('请至少添加一个角色')
                return
            }
            for (const role of this.userForm.roleList) {
                if (!role.roleName || !role.xinfa) {
                    this.$message.warning('请完善角色信息')
                    return
                }
            }
            if (this.editIndex === null) {
                this.userList.push(JSON.parse(JSON.stringify(this.userForm)))
            } else {
                this.$set(this.userList, this.editIndex, JSON.parse(JSON.stringify(this.userForm)))
            }
            this.dialogVisible = false
        },
        resetGacha() {
            this.availableRoles = []
            this.drawResults = []
            this.selectedUserIndex = null
            let allRoles = []
            this.userList.forEach((user, idx) => {
                user.roleList.forEach(role => {
                    allRoles.push({
                        ...role,
                        ownerIndex: idx,
                        ownerName: user.userName
                    })
                })
            })
            this.mustT = allRoles.find(r => r.xinfa === 'T')
            this.mustNai = allRoles.find(r => r.xinfa === '奶')
            this.availableRoles = allRoles
            this.displayRoles = allRoles.slice()
        },
        // 生成圆内随机不重叠坐标
        getRandomBallPositions(count) {
            const bodyR = 160;
            const ballR = 30;
            let positions = [];
            let tries = 0;
            while (positions.length < count && tries < 1000) {
                tries++;
                const angle = Math.random() * 2 * Math.PI;
                const r = (bodyR - ballR - 6) * Math.sqrt(Math.random());
                const x = bodyR + r * Math.cos(angle);
                const y = bodyR + r * Math.sin(angle);
                let overlap = positions.some(pos =>
                    Math.hypot(pos.x - x, pos.y - y) < ballR * 2 - 4
                );
                if (!overlap) positions.push({ x, y });
            }
            while (positions.length < count) {
                positions.push({ x: bodyR, y: bodyR });
            }
            return positions;
        },
        // 动态堆叠球算法或动画
        getVisibleBallsAndPositions() {
            if (this.isShuffling && this.randomBallPositions.length) {
                return this.displayRoles.slice(0, this.randomBallPositions.length).map((role, idx) => ({
                    role,
                    style: {
                        position: 'absolute',
                        left: `${this.randomBallPositions[idx].x - 30}px`,
                        top: `${this.randomBallPositions[idx].y - 30}px`,
                        zIndex: 100,
                        transition: 'left 0.3s, top 0.3s'
                    }
                }));
            }
            // 正常堆叠
            const bodyR = 160;
            const ballR = 30;
            const ballD = ballR * 2;
            const padding = 2;
            const centerX = bodyR;
            const centerY = bodyR;
            let balls = [];
            let idx = 0;
            let y = bodyR * 2 - ballR - padding;
            const maxLayers = Math.floor((bodyR * 2 - padding) / (ballD + padding));
            for (let layer = 0; layer < maxLayers && idx < this.displayRoles.length; layer++) {
                y = bodyR * 2 - ballR - padding - layer * (ballD + padding);
                const dy = Math.abs(centerY - y);
                const layerR = Math.sqrt(Math.max(0, bodyR * bodyR - dy * dy));
                const layerWidth = layerR * 2 - padding * 2;
                const ballsInLayer = Math.floor((layerWidth + padding) / (ballD + padding));
                if (ballsInLayer <= 0) break;
                const offsetX = centerX - (ballsInLayer * (ballD + padding) - padding) / 2 + ballR;
                for (let i = 0; i < ballsInLayer && idx < this.displayRoles.length; i++, idx++) {
                    const x = offsetX + i * (ballD + padding);
                    balls.push({
                        role: this.displayRoles[idx],
                        style: {
                            position: 'absolute',
                            left: `${x - ballR}px`,
                            top: `${y - ballR}px`,
                            zIndex: 100 - y,
                            transition: 'left 0.3s, top 0.3s'
                        }
                    });
                }
            }
            return balls;
        },
        handleDraw() {
            if (
                this.isDrawing ||
                this.selectedUserIndex === null ||
                this.availableRoles.length === 0
            ) return
            this.isDrawing = true
            this.isShuffling = true
            let pool = this.availableRoles.filter(r => r.ownerIndex !== this.selectedUserIndex)
            let leftUsers = this.userList.length - this.drawResults.length
            let mustDraw = null
            if (this.mustT && !this.drawResults.some(r => r.role.xinfa === 'T')) {
                let tLeft = this.availableRoles.filter(r => r.xinfa === 'T')
                if (tLeft.length > 0 && leftUsers === tLeft.length) {
                    mustDraw = tLeft.find(r => r.ownerIndex !== this.selectedUserIndex)
                }
            }
            if (!mustDraw && this.mustNai && !this.drawResults.some(r => r.role.xinfa === '奶')) {
                let naiLeft = this.availableRoles.filter(r => r.xinfa === '奶')
                if (naiLeft.length > 0 && leftUsers === naiLeft.length) {
                    mustDraw = naiLeft.find(r => r.ownerIndex !== this.selectedUserIndex)
                }
            }
            let drawPool = pool
            if (mustDraw) {
                drawPool = [mustDraw]
            }
            if (drawPool.length === 0) {
                this.$message.warning('没有可抽取的角色')
                this.isDrawing = false
                this.isShuffling = false
                return
            }
            // 动画洗牌
            let shuffleTimes = 0
            let totalDuration = 2000
            let interval = 120
            let elapsed = 0
            let timer = null
            const shuffleStep = () => {
                this.randomBallPositions = this.getRandomBallPositions(this.displayRoles.length)
                shuffleTimes++
                elapsed += interval
                if (elapsed < totalDuration) {
                    interval = Math.max(60, interval - 10)
                    timer = setTimeout(shuffleStep, interval)
                } else {
                    this.isShuffling = false
                    this.randomBallPositions = []

                    // ====== 关键：加权抽取 ======
                    // 统计T、奶、DPS
                    const tList = drawPool.filter(r => r.xinfa === 'T')
                    const naiList = drawPool.filter(r => r.xinfa === '奶')
                    const dpsList = drawPool.filter(r => r.xinfa !== 'T' && r.xinfa !== '奶')
                    let weightedPool = []

                    // T和奶各10%，如果有多个T/奶则平分
                    const tWeight = tList.length > 0 ? 0.1 : 0
                    const naiWeight = naiList.length > 0 ? 0.1 : 0
                    const dpsWeight = 1 - tWeight - naiWeight

                    // 计算每个T/奶/DPS的权重
                    tList.forEach(r => {
                        for (let i = 0; i < Math.round(100 * tWeight / tList.length); i++) {
                            weightedPool.push(r)
                        }
                    })
                    naiList.forEach(r => {
                        for (let i = 0; i < Math.round(100 * naiWeight / naiList.length); i++) {
                            weightedPool.push(r)
                        }
                    })
                    dpsList.forEach(r => {
                        for (let i = 0; i < Math.round(100 * dpsWeight / dpsList.length); i++) {
                            weightedPool.push(r)
                        }
                    })

                    // 防止加权池为空
                    if (weightedPool.length === 0) weightedPool = drawPool.slice()

                    // 随机抽取
                    const idx = Math.floor(Math.random() * weightedPool.length)
                    const drawRole = weightedPool[idx]
                    // ====== 关键结束 ======

                    let finalDisplay = this.availableRoles.slice()
                    finalDisplay = shuffle(finalDisplay)
                    finalDisplay = [drawRole].concat(finalDisplay.filter(r =>
                        !(r.roleName === drawRole.roleName && r.xinfa === drawRole.xinfa && r.ownerIndex === drawRole.ownerIndex)
                    ))
                    this.displayRoles = finalDisplay
                    setTimeout(() => {
                        const user = this.userList[this.selectedUserIndex]
                        this.drawResults.push({
                            userName: user.userName,
                            role: {
                                roleName: drawRole.roleName,
                                xinfa: drawRole.xinfa
                            }
                        })
                        if (drawRole.xinfa === 'T' || drawRole.xinfa === '奶') {
                            this.availableRoles = this.availableRoles.filter(r => r.xinfa !== drawRole.xinfa)
                            if (drawRole.xinfa === 'T') this.mustT = null
                            if (drawRole.xinfa === '奶') this.mustNai = null
                        } else {
                            this.availableRoles = this.availableRoles.filter(r =>
                                !(r.roleName === drawRole.roleName && r.xinfa === drawRole.xinfa && r.ownerIndex === drawRole.ownerIndex)
                            )
                        }
                        this.displayRoles = this.availableRoles.slice()
                        if (this.drawResults.length < this.userList.length) {
                            let next = (this.selectedUserIndex + 1) % this.userList.length
                            while (this.drawResults.find(r => r.userName === this.userList[next].userName)) {
                                next = (next + 1) % this.userList.length
                            }
                            this.selectedUserIndex = next
                        } else {
                            this.selectedUserIndex = null
                        }
                        this.isDrawing = false
                    }, 600)
                }
            }
            shuffleStep()
        },
        selectUser(idx) {
            if (this.isDrawing) return;
            const user = this.userList[idx];
            if (this.drawResults.some(r => r.userName === user.userName)) return;
            this.selectedUserIndex = idx;
        }
    },
    mounted() {
        this.resetGacha()
    }
}
</script>

<style scoped>
.jx3-draw {
    display: flex;
    height: 100%;
    background: hsl(162, 65%, 85%, .3);
    min-height: 0;
}

.left {
    flex: 1;
    padding: 24px 16px 24px 24px;
    background: #e9faf5;
    border-radius: 8px;
    min-width: 320px;
    box-sizing: border-box;
    overflow-y: auto;
    height: 100%;
    border-right: 2px solid #2a87b3;
}

.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    letter-spacing: 2px;
    color: #2a87b3;
}

.user-list {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 18px;
    padding: 16px 18px 12px 18px;
    box-shadow: 0 2px 8px rgba(42, 135, 179, 0.06);
    border-left: 4px solid #2a87b3;
    transition: box-shadow 0.2s;
}

.user-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
}

.user-avatar {
    width: 28px;
    height: 28px;
    background: #2a87b3;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    margin-right: 10px;
    box-shadow: 0 1px 4px rgba(42, 135, 179, 0.15);
}

.user-name {
    font-weight: bold;
    font-size: 16px;
    margin-right: auto;
    letter-spacing: 1px;
    color: #2a87b3;
}

.user-actions {
    display: flex;
    gap: 8px;
}

.role-list {
    padding-left: 38px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.role-tag {
    margin-bottom: 4px;
    font-size: 13px;
    padding: 0 8px;
    background: #e9faf5;
    border: 1px solid #2a87b3;
    color: #2a87b3;
    border-radius: 8px;
}

.role-name {
    font-weight: 500;
}

.role-xinfa {
    color: #2a87b3;
    font-size: 12px;
}

.add-btn {
    margin-top: 24px;
    text-align: center;
}

.right {
    flex: 2;
    padding: 24px;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: none;
    height: 100%;
    min-height: 0;
}

.gacha-header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 18px;
    color: #2a87b3;
    letter-spacing: 2px;
}

.gacha-flex {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;
    width: 100%;
    height: 100%;
    min-height: 0;
}

.gacha-machine-outer {
    width: 380px;
    min-width: 320px;
    height: 520px;
    max-width: 100vw;
    max-height: 520px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-shrink: 0;
}

.gacha-machine {
    position: relative;
    width: 380px;
    height: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.gacha-machine-top {
    width: 180px;
    height: 60px;
    background: linear-gradient(180deg, #b2e6e0 60%, #e9faf5 100%);
    border-radius: 90px 90px 60px 60px/60px 60px 30px 30px;
    margin-bottom: -18px;
    z-index: 2;
    border: 3px solid #2a87b3;
}

.gacha-machine-body {
    width: 320px;
    height: 320px;
    background: #e9faf5;
    border: 6px solid #2a87b3;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.gacha-balls {
    width: 100%;
    height: 100%;
    position: relative;
}

.gacha-ball {
    width: 60px;
    height: 60px;
    background: #fff;
    border: 2px solid #2a87b3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
    color: #2a87b3;
    box-shadow: 0 2px 8px rgba(42,135,179,0.08);
    position: absolute;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: left 0.3s, top 0.3s;
}

.gacha-ball .ball-role-name {
    display: block;
    width: 44px;
    max-width: 44px;
    min-height: 28px;
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
    word-break: break-all;
    white-space: pre-line;
    overflow: hidden;
    margin: 0 auto;
}

.gacha-ball.ball-t {
    background: #e3f1ff;
    border-color: #409EFF;
    color: #409EFF;
}
.gacha-ball.ball-nai {
    background: #e6fff2;
    border-color: #52c41a;
    color: #52c41a;
}
.gacha-ball.ball-dps {
    background: #e9faf5;
    border-color: #2a87b3;
    color: #2a87b3;
}

.gacha-machine-hole {
    width: 60px;
    height: 30px;
    background: #2a87b3;
    border-radius: 0 0 30px 30px/0 0 20px 20px;
    position: absolute;
    left: 50%;
    bottom: 90px;
    transform: translateX(-50%);
    z-index: 3;
    border: 2px solid #2a87b3;
    border-top: none;
}

.gacha-machine-handle {
    width: 60px;
    height: 60px;
    background: #e9faf5;
    border: 4px solid #2a87b3;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    z-index: 4;
    box-shadow: 0 2px 8px rgba(42, 135, 179, 0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: box-shadow 0.2s, background 0.2s;
}

.gacha-machine-handle:hover {
    background: #b2e6e0;
    box-shadow: 0 4px 16px #2a87b3;
}

.gacha-machine-handle.handle-disabled,
.gacha-machine-handle.handle-disabled:hover {
    background: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
    border-color: #bdbdbd;
}

.handle-inner {
    width: 24px;
    height: 24px;
    background: #2a87b3;
    border-radius: 50%;
    box-shadow: 0 2px 8px #b2e6e0;
}

.gacha-machine-bottom {
    width: 180px;
    height: 60px;
    background: linear-gradient(180deg, #e9faf5 60%, #b2e6e0 100%);
    border-radius: 0 0 90px 90px/0 0 60px 60px;
    margin-top: -18px;
    z-index: 2;
    border: 3px solid #2a87b3;
    border-top: none;
}

.el-table {
    font-size: 13px;
}

.user-select-container,
.result-table-wrap {
    max-width: 320px;
    width: 100%;
    margin: 0 auto;
}

.theme-table {
    width: 100%;
    max-width: 320px;
    min-width: 0;
}

.theme-table ::v-deep .el-table__header th,
.theme-table ::v-deep .el-table__cell,
.theme-table ::v-deep .el-table__body td {
    border: 1px solid #2a87b3 !important;
    color: #2a87b3 !important;
    background: #e9faf5 !important;
}

.theme-table ::v-deep .el-table__header th {
    background: #e9faf5 !important;
    color: #2a87b3 !important;
    font-weight: bold;
    border: 1px solid #2a87b3 !important;
}

.theme-table ::v-deep .el-table__body tr {
    background: #fff !important;
}

.theme-table ::v-deep .el-table {
    border: 1px solid #2a87b3 !important;
    border-radius: 0 !important;
    width: 100% !important;
    min-width: 0;
    max-width: 320px;
    box-sizing: border-box;
}

.theme-table ::v-deep .el-table__body-wrapper,
.theme-table ::v-deep .el-table__header-wrapper {
    overflow-x: auto !important;
}

.theme-table ::v-deep .el-table {
    width: 100% !important;
    min-width: 240px;
    max-width: 100%;
}

@media (max-width: 600px) {
    .gacha-machine-outer {
        width: 100%;
        max-width: 100vw;
        height: auto;
        max-height: 60vw;
    }

    .gacha-machine {
        width: 100%;
        max-width: 100vw;
        height: auto;
        max-height: 60vw;
    }

    .gacha-machine-body {
        width: 90vw;
        height: 90vw;
        max-width: 320px;
        max-height: 320px;
    }
}

.user-select-container {
    border: 2px solid #2a87b3;
    border-radius: 8px;
    padding: 10px 8px 4px 8px;
    margin-bottom: 18px;
    background: #fff;
    max-width: 320px;
}

.user-select-blocks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.user-block {
    flex: 0 0 calc(20% - 8px);
    box-sizing: border-box;
    padding: 2px 0;
    border-radius: 8px;
    background: #e9faf5;
    border: 1px solid #2a87b3;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    text-align: center;
    user-select: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
    transition: background 0.2s, color 0.2s, border 0.2s;
    margin-bottom: 4px;
}

.user-block.selected {
    background: #2a87b3;
    color: #fff;
}

.user-block.disabled {
    background: #e0e0e0;
    color: #bdbdbd;
    border-color: #bdbdbd;
    cursor: not-allowed;
}
.user-block.selected .user-block-name {
    color: #fff !important;
}
.user-block-name {
    display: inline-block;
    max-width: 3em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}

.gacha-result-table {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    flex: 1;
}

.gacha-section-title {
    font-size: 15px;
    font-weight: bold;
    color: #2a87b3;
    margin-bottom: 8px;
    margin-top: 4px;
    letter-spacing: 1px;
}

.gacha-section-title::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: linear-gradient(to right, transparent, #2a87b3, transparent);
}
</style>