<template>
    <el-dialog class="gf-dialog"
               :class="className"
               :visible.sync="visible"
               :title="title"
               :width="width"
               :top="top"
               :modal="showModal"
               :close-on-click-modal="closeOnClickModal"
               :show-close="showClose"
               :before-close="close"
               :lock-scroll="lockScroll">
        <component
                :is="component" v-bind="args"
                ref="component" @close2="close2">
        </component>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
            },
            className: {
                type: String,
            },
            width: {
                type: String,
                default: '50%',
            },
            showModal: {
                type: Boolean,
                default: true,
            },
            closeOnClickModal: {
                type: Boolean,
                default: false,
            },
            showClose: {
                type: Boolean,
                default: true,
            },
            beforeClose: {
                type: Function,
            },
            lockScroll: {
                type: Boolean,
                default: false,
            },
            // 动态component完成自己的任务后是否关闭弹窗，默认为是
            closeAfterDone: {
                type: Boolean,
                default: true,
            },
            // 动态component
            component: {
                type: [Object, String],
                required: true,
            },
            args: {
                type: Object,
                required: false
            },
            top: {
                type: String,
                default: '15vh'
            }
        },
        data() {
            return {
                visible: true
            }
        },
        methods: {
            close(done) {
                if (this.beforeClose) {
                    if (done && typeof (done) == 'string') {
                        this.beforeClose(this.args, done);
                    } else {
                        this.beforeClose(this.args);
                    }
                }
                // 从handleComponentDone处调用的close没有done参数
                if (done && typeof (done) == 'function') {
                    done()
                } else {
                    this.visible = false
                }
                this.$refs.component.$destroy();
                document.body.removeChild(this.$refs.component.$parent.$el);
            },
            close2(done, data) {
                if (this.beforeClose) {
                    this.beforeClose(done, data);
                }

                // 从handleComponentDone处调用的close没有done参数
                if (done && typeof (done) == 'function') {
                    done()
                } else {
                    this.visible = false
                }

                this.$refs.component.$destroy();
                document.body.removeChild(this.$refs.component.$parent.$el);
            },
            show() {
                this.visible = true
            }
        },
    }
</script>
