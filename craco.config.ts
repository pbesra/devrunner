export {};
const path = require("path");

module.exports = {
	webpack: {
		alias: {
			"@hooks": path.resolve(__dirname, "src/v1/apphooks"),
			"@utils": path.resolve(__dirname, "src/v1/utils"),
			"@appcontext": path.resolve(__dirname, "src/v1/app-context"),
			"@wrapper": path.resolve(
				__dirname,
				"src/v1/components/WrapperComponent"
			),
		},
	},
};
