<!--
 * @Author: yz.jiang
 * @Date: 2025-03-28 11:12:04
 * @LastEditTime: 2025-03-28 16:37:52
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /draw-lots-ui/src/modules/options/icon-layout.vue
-->
<template>
    <div class="icon-layout">
        <div class="img-container">
            <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="fileList"
                :on-change="handleChange">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" title="查看" @click="handlePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                        </span>
                        <span v-if="!disabled" class="el-upload-list__item-delete" title="使用" @click="handleUse(file)">
                            <i class="el-icon-paperclip"></i>
                        </span>
                    </span>
                </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
        <div class="model-container">
            <div class="model-icon">
            </div>
            <div ref="modelCard" class="model-card">
                <div class="cursor-item" v-for="icon in fileIconList" :key="icon.url">
                    <img :src="require(`../../assets/img/options/hualuo-icon/${icon.url}`)" alt="">
                    <span>{{ icon.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList: [],
            fileIconList: [
                { url: '花萝-正常选择.gif', name: '正常选择'},
                { url: '花萝-帮助选择.gif', name: '帮助选择'},
                { url: '花萝-文本选择.gif', name: '文本选择'},
                { url: '花萝-不可用.gif', name: '不可用'},
                { url: '花萝-链接选择.gif', name: '链接选择'},
                // { url: '', name: ''},
                { url: '花萝-后台运行.gif', name: '后台运行'},
                { url: '花萝-忙.gif', name: '忙'},
                { url: '花萝-手写.gif', name: '手写'},
                // { url: '花萝-链接选择.png'},
                { url: '花萝-水平调整大小.png', name: '水平调整'},
                { url: '花萝-垂直调整大小.png', name: '垂直调整'},
                { url: '花萝-沿对角线调整大小1.png', name: '对角线1'},
                { url: '花萝-沿对角线调整大小2.png', name: '对角线2'},
                // { url: '花萝-精确选择.png', name: '精确选择'},
                { url: '花萝-候选.png', name: '候选'},
                { url: '花萝-移动.png', name: '移动'},
            ],
        }
    },
    methods: {
        handleChange(file, fileList) {
            this.fileList = fileList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleUse(file) {
            // 生成临时 URL
            const imageUrl = URL.createObjectURL(file.raw);

            // 设置背景图
            const container = this.$refs.modelCard
            container.style.backgroundImage = `url(${imageUrl})`;
            container.style.backgroundSize = 'cover'; // 按需调整背景样式
        },

        handleIconChange(file, fileList) {
            this.fileIconList = fileList
        },
        getName(name) {
            return name?.split('.')[0].split('-')[1]
        }
    }
}
</script>
<style lang="less" scoped>
.icon-layout {
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #f0f0f0;

    >div {
        flex: 1;
        padding: 8px;
    }

    .img-container {
        border-right: 1px solid #3397F3;
    }

    .model-container {
        .model-icon {

        }

        .model-card {
            display: flex;
            // align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            width: 438px;
            height: 463px;
            background-color: #fff;
            padding: 80px 40px 130px 65px;
            .cursor-item {
                width: 60px;
                height: 60px;
                margin: 0 22px 20px 0;
                    text-align: center;
                span {
                    position: relative;
                    top: -5px;
                    font-size: 10px;
                    color: rgba(215,123,186,.5);
                    font-family:Arial, Helvetica, sans-serif;
                }
            }
        }
    }
}
</style>