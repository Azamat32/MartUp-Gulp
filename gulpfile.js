let preprocessor = 'less'
const { src, dest, watch, parallel, series } = require('gulp');

const browserSync = require('browser-sync').create();

const concat = require('gulp-concat');


const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const less = require('gulp-less');

const autoprefixer = require('gulp-autoprefixer');


const cleancss = require('gulp-clean-css');
const imagecomp = require('compress-images');

const del = require('del');

function browsersync() {
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: true
    })
}

function style() {

    return src('app/' + preprocessor + '/main.' + preprocessor + '')
        .pipe(eval(preprocessor)())
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())

}
async function images() {
    imagecomp(
        "app/img/src/**/*", // Берём все изображения из папки источника
        "app/img/dest/", // Выгружаем оптимизированные изображения в папку назначения
        { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Сжимаем и оптимизируем изображеня
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } }, { svg: { engine: "svgo", command: "--multipass" } }, { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function(err, completed) { // Обновляем страницу по завершению
            if (completed === true) {
                browserSync.reload()
            }
        }
    )
}

function build() {
    return src([
            'app/css/**/*.min.css',
            'app/js/**/*.min.js',
            'app/img/**',
            'app/**/*.html'
        ], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('dist'))
}

function scripts() {
    return src([
            'node_modules/jquery/dist/jquery.min.js',
            'app/js/app.js'
        ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

function cleanimg() {
    return del('app/img/dest/**/*', { force: true }) // Удаляем все содержимое папки "app/images/dest/"
}

function startwatch(params) {
    watch([
        'app/**/*.js', '!app/**/*.min.js'
    ], scripts)
    watch('app/**/' + preprocessor + '/**/*', style);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch('app/img/src/**/*', images);
}
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.style = style;
exports.cleanimg = cleanimg;
exports.default = parallel(scripts, cleanimg, style, browsersync, startwatch, images)


exports.build = series(scripts, cleanimg, style, browsersync, startwatch, images)