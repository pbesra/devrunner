export {};
const path = require("path");

module.exports = {
	webpack: {
		alias: {
			"@hooks": path.resolve(__dirname, "src/apphooks"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@appcontext": path.resolve(__dirname, "src/app-context"),
			"@wrapper": path.resolve(
				__dirname,
				"src/components/WrapperComponent"
			),
		},
	},
};
