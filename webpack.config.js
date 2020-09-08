module.exports = {
    entry: {
        home:'./app/homepage/homepage.js'
    },
    output: {
      path: __dirname,
      filename: './public/bundle/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/react"]
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader','css-loader'],
        },
        {
          test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|woff2|woff|eot|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "./public/assets/imgs",
              publicPath: "../../assets/imgs"
            }
          }
        }
      ]
    }
}