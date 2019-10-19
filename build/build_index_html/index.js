import gulp from 'gulp'

// 文件内容替换
import replace from 'gulp-str-replace'

// 压缩HTML
// import minifyHtml from 'gulp-minify-html'

import conf, {DEV} from '../../conf.js'

// 构建index html
export default function() {
    return gulp.src(`${conf.src_path}/index.html`)
            .pipe(replace({
                original : {
                    bundlejs: /<script src='bundle\.js' charset='utf-8'><\/script>/g,
                    bundlecss: /<link rel='stylesheet' href='bundle\.css' charset='utf-8'><\/link>/g,
                    // description: /<meta name='description' content=''\/>/g,
                    // keywords: /<meta name='keywords' content=''\/>/g,
                    title: /<title><\/title>/g,
                    // author: /<meta name='author' content=''\/>/g,
                },
                target : {
                    bundlejs: `<script src='bundle${conf.env === DEV ? '' : `-${conf.bundle_time}`}.js?v=${conf.bundle_time}' charset='utf-8'></script>`,
                    bundlecss: `<link rel='stylesheet' href='bundle${conf.env === DEV ? '' : `-${conf.bundle_time}`}.css?v=${conf.bundle_time}' charset='utf-8'></link>`,
                    // description: '<meta name="description" content="' + conf.info.description + '"/>',
                    // keywords: '<meta name="keywords" content="' + conf.info.keyword + '"/>',
                    title: '<title>' + conf.system_name + '</title>',
                    // author: '<meta name="author" content="' + conf.info.author + '"/>',
                },
            }))
            // .pipe(minifyHtml())
            .pipe(gulp.dest(conf.dist_path))
}
