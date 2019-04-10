module.exports = {
    mode: 'development',
    module: {
        noParse: /node_modules\/(?!schnee-ui\/)|React/,
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    require.resolve('../nanachi-loader/loaders/fileLoader'),
                    require.resolve('../nanachi-loader'),
                ],
                exclude: /node_modules\/(?!schnee-ui\/)|React/,
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