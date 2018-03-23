

## effectTag的所有含义与可应用的组件

| 操作    | 含 义              | class Component | stateless | native Component | native text |
|---------|--------------------|-----------------|-----------|------------------|-------------|
| MOUNT   | 插入DOM树          | ✖️              | ✖️        | ✔️               | ✔️          |
| ATTR    | 修改属性           | ✖️              | ✖️        | ✔️               | ✖️          |
| CONTEXT | 修改文本           | ✖️              | ✖️        | ✖️               | ✔️          |
| NULLREF | ref(null)        | ✔️              | ✔️        | ✔️               | ✖️          |
| HOOK    | 执行生命周期回调    | ✔️              | ✖️        | ✖️               | ✖️          |
| REF     | ref(stateNode)     | ✔️              | ✔️        | ✔️               | ✖️          |
| DELETE  | 移出DOM树          | ✖️              | ✖️        | ✔️               | ✔️          |
| CALLBAL | render/setState cb | ✔️              | ✔️        | ✔️               | ✔️          |
| CATCH   | componentDidCatch  | ✔️              | ✖️        | ✖️               | ✖️          |