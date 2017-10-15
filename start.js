require('babel-core/register')({
    'presets': [
        'stage-3',
        "latest-node"
    ]
})

require('babel-polyfill')
require('./server')