const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const postcss = require( 'gulp-postcss' );
const sourcemaps = require( 'gulp-sourcemaps' );
const browser_sync = require( 'browser-sync' );
const autoprefixer = require( 'autoprefixer' );
const cssnano = require( 'cssnano' );
const rename = require( 'gulp-rename' );
const tinypng = require( 'gulp-tinypng-compress' );
const copy_webpack_plugin = require( 'copy-webpack-plugin' );
const webpack_stream = require( 'webpack-stream' );
const webpack = require( 'webpack' );

const config = {
	src_path: './src/',
	dist_path: './dist/',
	environment: 'production',
	tiny_png_api_key: 'axN_g3gPEVQ3DqEBpAfnQD7VZ8C0Tp5O'
};

// Styles
const styles = () => {
	return gulp.src( config.src_path + 'scss/**/*.scss' )
	           .pipe( sourcemaps.init() )
	           .pipe( sass() )
	           .on( 'error', sass.logError )
	           .pipe( postcss( [
		           autoprefixer(),
		           cssnano( {
			           discardComments: {
				           removeAll: true
			           },
			           minifySelectors: {
				           disable: true
			           }
		           } )
	           ] ) )
	           .pipe( sourcemaps.write() )
	           .pipe( rename( {
		           suffix: '.min'
	           } ) )
	           .pipe( gulp.dest( config.dist_path + 'css' ) );
};

// Scripts
const scripts = (_watch) => {
	const watch = typeof _watch !== 'undefined' ? _watch: true;
	return gulp
		.src( config.src_path + 'js/main.js' )
		.pipe( webpack_stream( {
			mode: config.environment,
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}
				]
			},
			output: {
				filename: 'bundle.min.js'
			},
			plugins: [
				new webpack_stream.webpack.ProvidePlugin( {
					$: 'jquery',
					jquery: 'jQuery',
					'window.jQuery': 'jquery'
				} ),
				new copy_webpack_plugin( {
						patterns: [
							{ from: './node_modules/@fortawesome/fontawesome-pro/webfonts', to: '../font' }
						]
					}
				)
			],
			externals: {
				jquery: 'jQuery'
			},
			devtool: 'source-map',
			watch: watch
		}, webpack ) )
		.pipe( gulp.dest( config.dist_path + 'js' ) );
};

// Images
const images = () => {
	return gulp.src( config.dist_path + 'img/**/*.{png,jpg,jpeg}' )
	           .pipe( tinypng( {
		           key: config.tiny_png_api_key,
		           sigFile: config.dist_path + 'img/.tinypng-sigs',
		           log: true,
				   summarize: true
	           } ) )
	           .pipe( gulp.dest( config.dist_path + 'img' ) );
};

// Browsersync
const reload = () => {
	browser_sync.init( {
		files: [
			'**/*.html',
			config.dist_path + 'css/**/*.css',
			{
				match: [config.dist_path + 'js/**/*.js'],
				fn: ( event, file ) => {
					browser_sync.reload();
				}
			},
			{
				match: ['**/*.php'],
				fn: ( event, file ) => {
					browser_sync.reload();
				}
			}
		],
		server: true
	} );
};

// Watch
const watch = () => {

	reload();

	// Styles
	gulp.watch( config.src_path + 'scss/**/*.scss', styles );
};

// Build
const build = async () => {
	scripts( false );
	styles();
};

// Tasks
gulp.task( 'default', gulp.parallel( [scripts, watch] ) );
gulp.task( 'build', build );
gulp.task( 'images', images );