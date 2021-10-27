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

  // Configure output types
  bundle: true,
  sourcemap: _DEV_,
  minify: (!_DEV_),

  // Define important variables
  define: {
    _VER_: `"${process.env.npm_package_version}"`,
    _DEV_,
    'process.env.NODE_ENV': (_DEV_ ? '"development"' : '"production"')
  }
}

// Start up server if requested
if (serve) {
  ESBuild.serve({ port: 3000, servedir: 'public' }, options)
    .then(server => {
      console.log(`Serving dev code at ${server.host}:${server.port}`)

      function handleExit (signal) { server.stop() }
      process.on('SIGINT', handleExit)
      process.on('SIGTERM', handleExit)
    })
    .catch(() => {
      process.exit(1)
    })
} else {
  // Attempt to build
  ESBuild.build(options).catch(
    () => {
      process.exit(1)
    }
  )
}
