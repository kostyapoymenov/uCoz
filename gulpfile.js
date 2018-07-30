'use strict';

const   gulp            = require('gulp'),
        pug             = require('gulp-pug'),
        sass            = require('gulp-sass'),
        rename          = require('gulp-rename'),
        postcss         = require('gulp-postcss'),
        autoprefixer    = require('autoprefixer'),
        normalize       = require('node-normalize-scss'),
        imagemin        = require('gulp-imagemin'),
        rigger          = require('gulp-rigger'),
        del             = require('del'),
        svgSprite       = require('gulp-svg-sprite'),
        svgmin          = require('gulp-svgmin'),
        cheerio         = require('gulp-cheerio'),
        replace         = require('gulp-replace'),
        browserSync     = require('browser-sync').create(),
        sourcemaps      = require('gulp-sourcemaps'),
        gulpWebpack     = require('gulp-webpack'),
        webpack         = require('webpack'),
        nodemon         = require('gulp-nodemon'),
        webpackConfig   = require('./webpack.config.js');

const path = {
    root: './build',
    template: {
        pages: 'src/template/pages/*.pug',
        html: 'src/template/**/*.pug'
    },
    style: {
        src: 'src/styles/**/*.scss',
        dest: 'build/styles/'
    },
    image: {
        src: 'src/images/',
        dest: 'build/images/'
    },
    scripts: {
        src: 'src/js/',
        dest: 'build/js/'
    }
};

// pug
function template() {
    return gulp.src(path.template.pages)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(path.root));
}

// Сборка стилей
function style() {
    let processors = [
        autoprefixer({browsers: ['last 6 version']})
    ];
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: normalize.includePaths}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(path.style.dest));
}

// Сборка изображений
function image() {
    return gulp.src(path.image.src + '**/*.*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progessive: true,
            interlaced: true,
            removeViewBox:false,
            removeDimensions: false,
            removeComments:true,
            removeUselessStrokeAndFill:false,
            cleanupIDs:true
        }))
        .pipe(gulp.dest(path.image.dest));
}

// Сборка svg
function svg(done)  {
    const prettySvgs = function() {
    return gulp
        .src(`src/images/icons/*.svg`)
        .pipe(
            svgmin({
                js2svg: {
                    pretty: true
                }
            })
        )
        .pipe(
            cheerio({
                run($) {
                    $("[fill], [stroke], [style], [width], [height]")
                        .removeAttr("fill")
                        .removeAttr("stroke")
                        .removeAttr("style")
                        .removeAttr("width")
                        .removeAttr("height");
                },
                parserOptions: { xmlMode: true }
            })
        )
        .pipe(replace("&gt;", ">"));
};

prettySvgs()
    .pipe(
        svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        })
    )
    .pipe(gulp.dest(`build/images/icons`));
done();
}

// Сборка шрифтов
function fonts() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
}

// js
function script() {
    return gulp.src('./src/js/main.js')
        // .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(path.scripts.dest));
}
// libs js
function scriptLib() {
    return gulp.src('./src/js/libs/*')
        .pipe(gulp.dest(path.scripts.dest));
}

// очистка
function clean() {
    return del(path.root);
}

// watcher
function watch() {
    gulp.watch(path.style.src, style);
    gulp.watch(path.template.pages, template);
    gulp.watch(path.image.src, image);
    gulp.watch(path.scripts.src, script);
}

// локальный сервер
function server() {
    browserSync.init({
        server: path.root
    });
    browserSync.watch(path.root + '/**/*.*', browserSync.reload);
}

exports.template = template;
exports.style = style;
exports.image = image;
exports.script = script;
exports.clean = clean;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(style, template, fonts, image, script, svg, scriptLib),
    gulp.parallel(watch, server)
));