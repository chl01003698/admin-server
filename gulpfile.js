/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-22 11:04:03
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-01 15:46:48
 */

let gulp = require('gulp');
let aglio = require('gulp-aglio');
let run = require('gulp-run');
let runSequence = require('run-sequence');
let del = require('del');
let git = require('gulp-git');
let ts = require('gulp-typescript');
let tsp = ts.createProject('tsconfig.json'); //使用tsconfig.json文件配置tsc

//目录常量
const PATHS = {
    scripts: ['server/app.ts', 'server/**/*.ts'],
    output: './dist',
};

const MODELS = [
    'extern/chess-model/adminActivity.ts',
    'extern/chess-model/adminBroadcast.ts',
    'extern/chess-model/adminChannel.ts',
    'extern/chess-model/adminDecoration.ts',
    'extern/chess-model/adminGame.ts',
    'extern/chess-model/adminGroup.ts',
    'extern/chess-model/adminGroupPermission.ts',
    'extern/chess-model/adminMessage.ts',
    'extern/chess-model/adminParameter.ts',
    'extern/chess-model/adminPermission.ts',
    'extern/chess-model/adminSms.ts',
    'extern/chess-model/adminSubscript.ts',
    'extern/chess-model/adminUser.ts',
    'extern/chess-model/adminUserGroup.ts',
    'extern/chess-model/curator.ts',
    'extern/chess-model/mail.ts',
    'extern/chess-model/agent.ts',
    'extern/chess-model/user.ts'
];

const DOC = 'server/app/public/api.html';
const PUBLIC = 'server/app/public';

/****************** init ******************/
gulp.task('update-submodules', function() {
    git.updateSubmodule({
        args: '--init'
    });
});

//
// gulp.task('checkout-submodule', ['update-submodules'], function() {
//     git.checkout('develop', {
//         cwd: 'extern/chess-model/'
//     }, function(err) {
//         if (err) throw err;
//     });
// });

// 拷贝
gulp.task('copy-model', function() {
    gulp.src(MODELS)
        .pipe(gulp.dest('server/app/model/'));
});

gulp.task('copy-package.json', function() {
    gulp.src('./package.json')
        .pipe(gulp.dest('./dist'));
});

/****************** init ******************/



//清理文档
gulp.task('clean-doc', function() {
    return del(DOC);
});

//编译文档
gulp.task('build-doc', ['clean-doc'], function() {
    gulp.src('docs/api.apib')
        .pipe(aglio({
            template: 'default'
        }))
        .pipe(gulp.dest(PUBLIC));
});

//清理编译后的文件
gulp.task('clean-build', function() {
    return del(PATHS.output);
});

//编译ts文件
gulp.task('build-ts', ['clean-build'], function() {
    return gulp.src(PATHS.scripts)
        .pipe(tsp())
        .pipe(gulp.dest(PATHS.output));
});

gulp.task('fix', function() {
    gulp.src('server/app/extend/autoIncrement.js')
        .pipe(gulp.dest('dist/app/extend/'));

    gulp.src('server/app/public/*')
        .pipe(gulp.dest('dist/app/public/'));

    gulp.src('server/config/auth_key/*')
        .pipe(gulp.dest('dist/config/auth_key/'));
});

gulp.task('init', function(callback) {
    runSequence(
        'update-submodules',
        'copy-model',
        'copy-package.json',
        callback);
});

gulp.task('build', function(callback) {
    runSequence(
        'build-doc',
        'build-ts',
        'copy-package.json',
        'fix',
        callback);
});

let spawn = require('child_process').spawn,
    node;

gulp.task('start-dev', ['build'], function() {
    if (node) node.kill()
    node = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit'
    })
    node.on('close', function(code) {
        if (code === 8) {
            console.error('Error detected, waiting for changes...');
        }
    });
});

gulp.task('stop-dev', function() {
    if (node) node.kill()
    console.log('stop server...');
});

//监视ts文件变化
gulp.task('watch-ts', ['build'], function() {
    gulp.watch(PATHS.scripts, ['build']);
});


//开发任务
gulp.task('dev', function() {
    gulp.run('start-dev');

    gulp.watch(PATHS.scripts, function() {
        gulp.run('stop-dev');
        node.on('close', (code) => {
            if (code !== 0) {
                console.log(`grep process exited with code ${code}`);
            }
            gulp.run('start-dev');
        });
    });
});