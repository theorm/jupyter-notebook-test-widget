/**
 * Overrides for JupyterLab supplied extension build config.
 * Make it pick the source maps generated by `tsc`.
 */
module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]  
  }
}