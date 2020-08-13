const path = require('path')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware');

const PORT = process.env.PORT || 3000;
const config = require('./webpack.config.js');
const webpack = require('webpack');
const compiler = webpack(config);

const app = express(),
DIST_DIR = __dirname,
HTML_FILE = path.join(DIST_DIR, 'index.html')
	
app.use(express.static(DIST_DIR));

app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));
		
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})