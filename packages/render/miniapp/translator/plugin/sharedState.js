/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:34 
 * @Last Modified by: hibad
 * @Last Modified time: 2018-06-24 22:17:47
 */

class SharedState {
    constructor() {
      this.output = {
        wxml:'',
        wxss:'',
        js:'',
        json:'',
        type:''//App||Page||Component
      }
      this.compiled = {
        methods: [], //编译文件的类方法
        data: {}, // 小程序Page或者Component的data
      }
      this.isTemplate = false
      this.unRecognizeImportedModule = {} //存储非Component的依赖
      this.importedComponent = {} //导入的组件
      this.sourcePath = ''//当前文件路径, 用于css抽取
    }
    
    reset() {
      this.output = {
        wxml:'',
        wxss:'',
        js:'',
        json:{},
        type:''//App||page||component
      }
      this.compiled = {
        methods: [],
        data: {},
      }
      this.isTemplate = false
      this.unRecognizeImportedModule = {} 
      this.importedComponent ={} 
      this.sourcePath = ''
    }
  }
  
  
  module.exports = new SharedState();