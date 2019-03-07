# WEB
### 目录结构
- coinfig：create-my-app 配置文件
- public : 项目html文件所在（本地服务主文件夹）
- scripts：自动化脚本：运行，打包以及测试
    - 打包前为了设置路由控制要把package.json中的\[homepage]设置为项目运行根目录
- package.json：依赖配置文件
- src(项目文件)
    - index.css : 可视为全局css
    - index.js : app入口文件
    - registerServiceWorker.js：热加载用服务配置文件?
    - components ：组件
        - Chat：聊天所在
        - expmple：组件样板，新组件复制粘贴即可
        - generics：通用组件，例：头像组件
        - Login：登录组件及其相关组件
        - Main：项目入口组件
        - Square：广场及其相关组件

    - configs：配置文件
        - _config.scss：scss配置
        - initConfig.js：从服务器获取config以及设置redux的config部分
        - localConfig.js：本地配置信息，包括接口url等
    - redux：redux部分
        - actions：action部分
            - 每个文件包含与文件名所代表的store state相关的action
            - index.js 用来方便外部文件导入相关action
        - actionTypes：action类型常量
            - index.js：action类型常量定义
        - reducers：reducer部分
            - 每个文件包含与文件名所代表的store state相关的reducer
            - index.js：合并所有reducer为一个reducer用于创建store
        - store：store部分
            - index.js：根据reducer创建store
            - storeBridge.js：store包装方法，方便获取store中的值
    - requests：接口部分
        - 每个文件包含与文件名相关的数据的接口
        - index.js：包含对axios的包装以及对接口返回值的简单过滤（401等），以及导出其他文件的方法方便外部文件导入
    - SDK：云信SDK部分
        - init.js：根据配置信息（token等）初始化sdk并设置store
        - msgHandler.js：消息处理方法
        - NIM_WEB_NIM_v*.js：sdk文件（为了防止二次编译出错，项目引用cdn文件，此处仅为备用）
        - IMBridge.jssdk初始化，事件监听设置以及对nim方法的包装
    - util：方法类
        - index.js：项目用到的各种工具方法
        - jquery：全局导出jquery
### 工程规范
- css类名：\[module]-\[component]-\[state]
- 模块文件夹命名：大驼峰（AaBbCc）,模块文件统一为index.js,index.css