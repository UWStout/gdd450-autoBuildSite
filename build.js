// Import esbuild
import ESBuild from 'esbuild'

// Is server requested?
const serve = process.argv.some((arg) => (arg.toLowerCase() === 'serve'))

// Is this a dev build?
const _DEV_ = process.argv.some((arg) => (arg.toLowerCase() === 'dev'))

// esbuild options
const options = {
  // List of all separate entry points
  entryPoints: [
    './src/main.jsx'
  ],

  // Configure output location and names
  outdir: './public',
  entryNames: '/[name]',

  // Configure loaders
  loader: {
    '.woff': 'dataurl',
    '.woff2': 'dataurl'
  },

  // Configure output types
  bundle: true,
  sourcemap: _DEV_,
  minify: (!_DEV_),

  // Define important variables
  define: {
    _VER_: `"${process.env.npm_package_version}"`,
    _DEV_: (_DEV_ ? 'true' : 'false'),
    'process.env.NODE_ENV': (_DEV_ ? '"development"' : '"production"')
  }
}

async function main () {
  try {
    if (serve) {
      // Start up server if requested
      const ctx = await ESBuild.context(options)
      const { host, port } = await ctx.serve({ port: 3000, servedir: 'public' })
      if (host === '0.0.0.0') {
        console.log(`Serving dev code at http://localhost:${port}`)
      } else {
        console.log(`Serving dev code at ${host}:${port}`)
      }
    } else {
      // Attempt to build
      await ESBuild.build(options)
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
