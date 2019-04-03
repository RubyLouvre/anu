module.exports = {
    mode: 'development',
    module: {
        noParse: /node_modules|React/,
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    require.resolve('../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../nanachi-loader'),
                ],
                exclude: /node_modules|React/
            },
            {
                test: /\.(s[ca]ss|less|css)$/,
                use: [
                    require.resolve('../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../nanachi-loader/loaders/nanachiStyleLoader'),
                ]
            }
        ]
    }
};