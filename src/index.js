import './index.less'

require.ensure([
    'ramda',
    'react',
    'react-dom',
    'react-redux',
    'moment',
    'react-router-dom',
    'react-addons-css-transition-group',
    'redux-persist',
    'classnames',
    'redux-actions',
    'redux-persist-transform-compress',
    'redux-persist-transform-encrypt',
    'redux-persist-transform-filter',
    'redux-thunk',
    // 'antd',
], () => {

    // module: 160KB 压缩89KB
    require.ensure([], () => {
        require('./start')
    }, 'module')

}, 'lib')
