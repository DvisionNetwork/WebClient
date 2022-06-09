module.exports = {

	// publicPath: '/dev',

	chainWebpack: (config) => {
		config.module.rules.delete('eslint') ///
		config.plugin('html').tap((args) => {
			args[0].title = 'Dvision World'
			return args
		})
	},

	css: {
		loaderOptions: {
			sass: {
				sourceMap: true,
				additionalData: `
					@import "@/assets/styles/global_mixins.scss";
					@import "@/assets/styles/global.scss";
				`,
			},
		},
	},

	devServer: {
		//host: 'kst.com',
		//https: true,
		disableHostCheck: true,
		port: 7381,
	},

	runtimeCompiler: true,

	publicPath: process.env.VUE_APP_BUILD_MODE == 'DEV' ? '/m/app_test/' : '/',

	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableLegacy: false,
			runtimeOnly: false,
			compositionOnly: false,
			fullInstall: true,
		},
	}
}
