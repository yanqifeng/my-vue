import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import aliasPlugin from '@rollup/plugin-alias';

export default {
    input: './src/web/entry-runtime-with-compiler.js', // 引入的文件
    output: {
        format: 'umd', // amd commonjs规范  默认将打包后的结果挂载到window上
        file: 'dist/vue.js', // 打包出的vue.js 文件  new Vue
        name: 'Vue',
        sourcemap: true
    },
    plugins: [
        babel({ // 解析es6 -》 es5
            exclude: "node_modules/**" // 排除文件的操作 glob  
        }),
        serve({ // 开启本地服务
            open: true,
            openPage: '/public/index.html', // 打开的页面
            port: 3000,
            contentBase: ''
        }),
        aliasPlugin({
            entries: [
                { find: 'vue', replacement: __dirname + '/src/platforms/web/entry-runtime-with-compiler' },
                { find: 'compiler', replacement: __dirname + '/src/compiler' },
                { find: 'core', replacement: __dirname + '/src/core' },
                { find: 'shared', replacement: __dirname + '/src/shared' },
                { find: 'web', replacement: __dirname + '/src/web' },
                { find: 'server', replacement: __dirname + '/src/server' },
                { find: 'sfc', replacement: __dirname + '/src/sfc' }
            ]
        })
    ]
}