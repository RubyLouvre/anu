
export function fixFilePath(api, name){
  return function(a){
     a.apFilePath = a.filePath;
     api[name](a)
  }
}

       