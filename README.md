# graduate-recommendation-evaluation-vue

### Update

#### 2025.08.12

扩展 useQuery 虽然抽象，但如果换库或 useQuery 的实现改变，扩展也需要改，无法复用很不灵活，问题也很难排查。重新封装loading组件，包裹useQuery的请求函数，仅需依赖 Promise 而不是具体的库，更灵活。  
vue-query 底层依赖于 Vue 的响应式系统和组件实例上下文，而 Decorators 的静态元编程机制无法访问 vue 组件运行时上下文。  
~~自定义useLoadingQuery，添加全局loading模态框扩展useQuery功能，访问缓存数据时忽略，仅在实际网络请求时启动。依然是在数据量大的请求上使用，避免全局使用影响用户体验。~~

#### 2025.08.08

引入vue-query库管理数据缓存，重写请求业务逻辑。  
实现前端多级限定项判断。  
各种闭包函数递归树形结构、渲染节点、判断限项。  
分离职责，持久化数据后前端重新拉取，虽然多了一次请求，但接口职责单一利于维护。
