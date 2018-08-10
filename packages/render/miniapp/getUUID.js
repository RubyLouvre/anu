function _uuid(){
    return (Math.random()+"").slice(-4)
}

export function getUUID(){
   return _uuid()+_uuid()
}