/*
 * @Author: yz.jiang
 * @Date: 2025-06-12 12:18:39
 * @LastEditTime: 2025-06-12 12:19:35
 * @LastEditors: yz.jiang
 * @Description: 
 * @FilePath: /gacha-machine-ui/vue.config.js
 */

const BASE_URL = process.env.NODE_ENV === "production" ? "/gacha-machine-ui/" : "./";
module.exports = {
    publicPath: BASE_URL,
    lintOnSave: false,
    chainWebpack: config => {
        config
        .plugin('html')
        .tap( args => {
            args[0].title = 'finghting！燃烧吧扭扭扭蛋机☆向着未来☆梦想★不断进发~~~'
            return args
        })
    }
}
