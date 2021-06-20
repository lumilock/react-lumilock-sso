import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import { uglify } from 'rollup-plugin-uglify';

const input = 'src/index.js';
const output = 'dist/index';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  {
    input,
    output: {
      file: `${output}.js`,
      format: 'cjs',
    },
    external: ['react-cookie', 'react', 'redux-devtools-extension'], // <-- suppresses the warning
    plugins: [
      resolve({
        browser: true,
        dedupe: ['react', 'react-dom'], // Default: []
        extensions,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          'react-dom': ['createPortal'],
        },
      }),
      external(),
      uglify(),
    ],
  },
  {
    input,
    output: {
      file: `${output}.modern.js`,
      format: 'es',
    },
    external: ['react-cookie', 'react', 'redux-devtools-extension'], // <-- suppresses the warning
    plugins: [
      resolve({
        dedupe: ['react', 'react-dom'], // Default: []
        extensions,
      }),
      babel({
        exclude: 'node_modules/**',
        extensions,
      }),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          'react-dom': ['createPortal'],
        },
      }),
      external(),
      terser(),
    ],
  },
  {
    input,
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
        'redux-devtools-extension': 'reduxDevtoolsExtension',
      },
      format: 'umd',
    },
    external: ['react-cookie', 'react', 'redux-devtools-extension'], // <-- suppresses the warning
    plugins: [
      resolve({
        extensions,
      }),
      external({
        dedupe: ['react', 'react-dom'], // Default: []
        extensions,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs({
        include: ['node_modules/**'],
        namedExports: {
          'react-dom': ['createPortal'],
        },
      }),
      terser(),
    ],
  },
];
