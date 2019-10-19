// 规则查考: http://eslint.org/docs/rules/

module.exports = {
    "env": {                      // 添加各类全局变量定义
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true,
        "jquery": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,          // ECMA版本
        "ecmaFeatures": {          // ECMA 特性支持
            "experimentalObjectRestSpread": true,
            "jsx": true,
        },
        "sourceType": "module",     // commonjs 模块支持
    },
    "plugins": [
        "react",                    // react 支持
    ],
    "rules": {                      // 0 忽略 1 警告 2 错误
        "comma-spacing": [          // 在逗号之前和之后强制执行一致的间距
            2,
            {
                "before": false,
                "after": true,
            },
        ],
        "indent": [                 // 缩进
            2,
            4,                      // 4个空格一个tab
            {"SwitchCase": 1},      // switch 缩进设置
        ],
        "linebreak-style": [        // 折行风格
            2,
            "unix",
        ],
        "valid-jsdoc": 2,           // 有效的文档格式
        "no-var": 2,                // 禁用var
        "quotes": [                 // 引号数量
            2,
            "single",
        ],
        "semi": [                   // 省略分号
            2,
            "never",
        ],
        "no-console": [             // 无console
            0,
        ],
        "no-unused-vars": [         // 未使用变量
            0,
        ],
        "no-const-assign": 2,       // 禁止修改 const 声明的变量
        "space-infix-ops": 2,       // 操作符周围有空格
        "curly": [                  // 单行作用域总是需要添加{} 比如 if (foo) foo++; => if (foo) { foo++; }
            2,
            "all",
        ],
        "comma-dangle": [           // 数组,()和{}最后 单行不加逗号, 多行总是需要添加逗号
            2,
            "always-multiline",
        ],
        "no-extra-boolean-cast": [  // !!转bool
            0,
        ],
        "no-case-declarations": 1,
        "linebreak-style": 0,       // 断行风格
        "no-trailing-spaces": 2,    // 不允许在语句后存在多余的空格
        "eqeqeq": 2,                // 消除不安全类型的全等操作
        "no-debugger": 1,           // debugger关键字
    },
    "globals": {                    // 自定义全局变量
        // "Log": true,
        "React": true,
        // "REQ_PREFIX": true,
    },
}
