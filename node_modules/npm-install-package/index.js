var exec = require('child_process').exec

module.exports = npmInstallPackage

// Install an npm package
// ([str]|str, obj, obj, fn) -> null
function npmInstallPackage (deps, opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }
  deps = Array.isArray(deps) ? deps : [ deps ]
  opts = opts || opts
  cb = cb || noop

  var args = []
  if (opts.save) args.push('-S')
  if (opts.saveDev) args.push('-D')
  if (opts.global) args.push('-g')
  if (opts.cache) args.push('--cache-min Infinity')

  if (opts.silent === false) {
    deps.forEach(function (dep) {
      process.stdout.write('pkg: ' + dep + '\n')
    })
  }

  var cliArgs = ['npm i'].concat(args, deps).join(' ')
  exec(cliArgs, function (err, name) {
    if (err) return cb(err)
    cb()
  })
}

function noop () {}
