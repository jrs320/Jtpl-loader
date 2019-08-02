/**
 * 该loader把jtpl模块通过正则匹配分离dom模块和javacsript脚本
 * 并生成scope，创建模块实例
 * @author jrs
 */

const babel = require("babel-core")
const compile = (source) => {
  let mTpl = source.match(/<template>([\s\S]*?)<\/template>/)
  let mScript = source.match(/<script>([\s\S]*?)<\/script>/)

  tpl = mTpl ? mTpl[1] : ''
  scripts = mScript ? mScript[1] : ''

  // scss样式文件路径后面加入scopeId和模块根元素标签名称
  const scope = createCssScopeId()
  const rootTagName = parseRootTag(tpl)
  let reg = /(import.*?\.scss)(["'])([;\n\s\t])/ig
  scripts = scripts.replace(reg, `$1?scope=${scope}$2$3`)

  // 添加tpl属性和create方法
  let loadConfig = (config) => {
    let varApp = createVarApp()
    return `
      let ${varApp} = ${config}
      ${varApp}.tpl = \`${tpl}\`,
      ${varApp}.scope = "${scope}", 
      ${varApp}.rootTagName = "${rootTagName}", 
      ${varApp}.create = function(data, exData) {
        return new Jtpl(data, this, exData)
      }
      export default ${varApp}
    `
  }

  reg = /export\s+default([\s\S]*)/
  scripts = scripts.replace(reg, ($0, $1) => {
    return loadConfig($1)
  })

  let code = `import Jtpl from 'Jtpl';` + scripts
  return babel.transform(code, {
    minified: true,
    presets: ['env'],
    sourceMaps: true
  })
}

const createCssScopeId = () => ('scope' + random())
const createVarApp = () => ('app' + random())
const random = () =>  Math.floor(Math.random() * 100000000)

const parseRootTag = (tpl) => {
  let reg = /^[\s\n\t]*<([A-Z|a-z|-]*)[\s\S]*?>/
  let m = tpl.match(reg)
  return m && m[1]
}

module.exports = function(source) {
  let result = compile(source)
  this.callback(null, result.code, result.map, result.ast)
  return
}