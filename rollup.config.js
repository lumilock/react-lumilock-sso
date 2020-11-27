import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'

const input = 'src/index.js'
const output = 'dist/index'

export default [
  {
    input: input,
    output: {
      file: `${output}.js`,
      format: 'cjs'
    },
    external: ['react-cookie', 'react', 'redux-devtools-extension'], // <-- suppresses the warning
    plugins: [
      resolve({
        browser: true,
        dedupe: ['react', 'react-dom'] // Default: []
      }),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          'react-dom': ['createPortal']
        }
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      external(),
      uglify()
    ]
  },
  {
    input: input,
    output: {
      file: `${output}.modern.js`,
      format: 'es'
    },
    external: ['react-cookie', 'react', 'redux-devtools-extension'], // <-- suppresses the warning
    plugins: [
      resolve({
        dedupe: ['react', 'react-dom'] // Default: []
      }),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          'react-dom': ['createPortal']
        }
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      external(),
      terser()
    ]
  },
  {
    input: input,
    output: {
      name: 'ReactUi',
      file: `${output}.umd.js`,
      globals: {
        react: 'React',
        'styled-components': 'styled',
        'prop-types': 'PropTypes',
        'prop-types/checkPropTypes': 'checkPropTypes',
        'react-cookie': 'reactCookie',
        redux: 'redux',
        'redux-thunk': 'thunk',
        'react-redux': 'reactRedux',
        'react-router-dom': 'reactRouterDom',
        'redux-devtools-extension': 'reduxDevtoolsExtension'
      },
      format: 'umd'
    },
    external: ['react-cookie', 'react', 'redux-devtools-extension'], // <-- suppresses the warning
    plugins: [
      resolve(),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          'react-dom': ['createPortal']
        }
      }),
      external({
        dedupe: ['react', 'react-dom'] // Default: []
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
]
