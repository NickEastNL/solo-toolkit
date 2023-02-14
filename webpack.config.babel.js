import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import yaml from 'js-yaml';
import pug from 'pug';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SimpleProgressWebpackPlugin from 'simple-progress-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const packageType = 'module';
const buildMode = process.argv[3] === 'production' ? 'production' : 'development';
const isProductionBuild = buildMode === 'production';

const [outDir, packageName, foundryUri] = (() => {
	const configPath = path.resolve(process.cwd(), 'foundryconfig.json');
	const systemName = path.basename(process.cwd());
	const config = fs.readJSONSync(configPath, { throws: false });
	const outDir =
		config instanceof Object
			? path.join(config.dataPath, 'Data', `${packageType}s`, systemName)
			: path.join(__dirname, 'dist/');
	const foundryUri = (config instanceof Object ? String(config.foundryUri ?? '') : null) || 'http://localhost:30000';
	return [outDir, systemName, foundryUri];
})();

const allTemplates = () => {
	return glob
		.sync('**/*.pug', { cwd: path.join(__dirname, 'src/templates') })
		.map((file) => `'${packageType}s/${packageName}/templates/${path.basename(file, '.pug')}.hbs'`)
		.join(', ');
};

const optimization = isProductionBuild
	? {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						mangle: false,
						module: true,
						keep_classnames: true,
					},
				}),
				new CssMinimizerPlugin(),
			],
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					default: {
						name: 'main',
						test: `src/main.js`,
					},
					vendor: {
						name: 'vendor',
						test: /node_modules/,
					},
				},
			},
	  }
	: undefined;

const config = {
	context: __dirname,
	mode: buildMode,
	entry: {
		main: `./src/main.js`,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						},
					},
					'webpack-glob-loader',
				],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true },
					},
				],
			},
			{
				test: /template-preloader\.js$/,
				use: [
					{
						loader: 'string-replace-loader',
						options: {
							search: `'__ALL_TEMPLATES__'`,
							replace: allTemplates,
						},
					},
				],
			},
			!isProductionBuild
				? {
						test: /\.pug$/,
						use: 'raw-loader',
				  }
				: {
						test: /\.pug$/,
						use: 'null-loader',
				  },
		],
	},
	optimization: optimization,
	devtool: isProductionBuild ? undefined : 'inline-source-map',
	bail: isProductionBuild,
	devServer: {
		devMiddleware: {
			writeToDisk: true,
		},
		proxy: {
			context: (pathname, _request) => {
				return !pathname.match('^/ws');
			},
			target: foundryUri,
			ws: true,
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.WatchIgnorePlugin({
			paths: ['node_modules', 'static'],
		}),
		new webpack.DefinePlugin({
			__BUILD_MODE__: JSON.stringify(buildMode),
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'module.json' },
				// {
				// 	context: 'src/',
				// 	from: '**/*.yml',
				// 	to: '[path][name].json',
				// 	transform(content, srcPath) {
				// 		const data = yaml.load(content.toString(), {
				// 			filename: srcPath,
				// 		});
				// 		return JSON.stringify(data, null, '\t');
				// 	},
				// },
				{
					context: 'src/',
					from: 'templates/**/*.pug',
					to: '[path][name].hbs',
					transform(content, srcPath) {
						const data = pug.render(content.toString(), {
							pretty: '\t',
						});
						return data;
					},
				},
				// {
				// 	from: 'static/',
				// },
			],
		}),
		new MiniCssExtractPlugin({ filename: '[name].css' }),
		new SimpleProgressWebpackPlugin({ format: 'compact' }),
	],
	resolve: {
		alias: {
			'@actor': path.resolve(__dirname, 'src/module/actor'),
			'@data': path.resolve(__dirname, 'src/module/data'),
			'@item': path.resolve(__dirname, 'src/module/item'),
			'@module': path.resolve(__dirname, 'src/module'),
			'@sheets': path.resolve(__dirname, 'src/module/sheets'),
			'@util': path.resolve(__dirname, 'src/util'),
		},
	},
	output: {
		clean: true,
		path: outDir,
		filename: '[name].bundle.js',
		publicPath: `/${packageType}s/${packageName}/`,
	},
};

export default config;
