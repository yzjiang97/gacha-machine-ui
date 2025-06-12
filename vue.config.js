
const BASE_URL = process.env.NODE_ENV === "production" ? "/draw-lots-web/" : "./";
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
