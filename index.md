###fibre架构的了解: 
    在17版本之前我们可以很平稳的从15-16版本之间平滑的过渡。
    ###我理解的fibre的架构是： 
        改变了之前的react的渲染机制，新的fibre的架构现在可以使用异步渲染，中途可以被打断，执行更高级别的优先级，释放主线程。
    ###现在react同步更新挂载的缺陷： 
        现有的react的更新过程是同步的。这会导致我们的一个性能为问题.当我们需要挂载和更新组件的时候，会调用各个组件的生命周期函数，比对vi rvirtual Dom 更新dom树这些过程都是同步的。 但是当我们有个很多很多组件的时候。更新一个组件1毫秒，200个组件就是200毫秒，但是用户在这200毫秒内用户点击某个按钮，触发了某个操作, 其实是没有任何反应的。因为浏览器主线程被react给占据了， 所以当更新结束后才会有反应。才会有页面卡顿
    ###fibre解决的方式
        fibre其实就是把更新的过程给碎片化。每执行一个更新的过程，就把react的控制权交给负责协调的模块，看看有没有紧急的任务要做， 如果有，就做紧急的任务，如果在通过callback回到当前组件更新的位置，从头开始重新渲染。

###Hooks
    Hooks在16.8版本开始新增的特性， 它的主要作用就是我们在函数组件里面页面使用state和react的特性
    hook中添加了 {useState, useEffcet}这两个。
    useState接受一个参数，可以是字符串，数字， 对象等类型， 但是对于他声明的变量有两个。分别是定义变量的参数 和 改变参数的函数
    const [age, setage]  = useState(0); 这个useState可以有多个， 可以被多次调用。 但是hook是有被规则限制的hook。 react中的hooks必须写在函数的最外城，不能被循环，判断， 嵌套函数中调用。 这样才能保证我们的hook在每一次被渲染的时候都能按照同样的顺序被调用。保证react能够多次的useState和useEffcet调用之间保持hook的正确性
    useEffect的使用其实就是副作用的效果，所谓的副作用就是数据的获取，订阅，修改dom的操作都会触发useEffect, useEffect有两个参数，第一个参数是一个函数, 第二个参数是一个控制器把。如果第二个参数是一个数组的情况下，则useEffect则只是充当了componentDidMount的作用，如果当我们需要根据input框来改变我们的请求数据，则只要修改第二个参数即可。 我们也可以使用hook来自定义，来进行代码的互用性

###http协议 1.0 1.1 2.0的区别
    http理解： http称之为超文本传输协议。是一种服务器端传输到本地浏览器端的一种传输协议。比如网站的图片， css, js都是基于http协议进行的
    http: 无连接，无状态
    说起http,那就先说tcp协议：
        tcp协议分为4层：应用层， 传输层， 网络层， 链路层
        应用层： 当我们输入网址Dns域名系统到ip解析的一个过程
        传输层： 传输层对接上层应用层，提供处于网络连接中两台计算机之间的数据传输所使用的协议
        网络层： 数据通过怎么样的方式到达对方计算机传送给对方
        链路层： 用来处理连接网络的硬件部分。包括操作系统。硬件设备驱动
    http中tcp的连接方式：
        http1.0 使用是串行连接： http有无连接的特性。即每次请求的进行连接， 当收到数据响应的时候即断开连接，每个http请求都要建立一个新的连接，每次都建立新的tcp连接（都有三次握手，4次挥手），增加了通信的开销
        http1.1 使用的是持久连接： 在同一域名的情况下如果两端都没有提出断开连接的话，就持久保持tcp连接的情况。其他请求可以复用这个通道，这样就减少了通信方面的开销，但是持久连接采用了阻塞的模式，下次的请求必须等到上次的响应返回后才能发起，如果上次响应的请求还没有返回， 那么只能等着（线头堵塞）
        http2.0 使用是多路复用： 每一个http请求都有一个序列标识符。浏览器可以并发多个请求，服务器收到数据之后在根据序列标识符重新排列成不同的请求报文。 同样服务器端可以返回多个响应给浏览器端，浏览器根据序列标识符重新排序归入各自的请求响应报文
    http1.0 与 http1.1 区别：
        1. 带宽优化即网络连接的使用： http1.0中存在带宽浪费的情况，比如用户需要只是某个对象的一部分，却传了整个对象，http1.1在请求头引入了range头域。它只是允许请求资源的某个部分
        2. http1.0  中主要使用了if-Modified-since, Expires来作为缓存而在http1.1中添加了Entity tag , if-Matchde等缓存头来控制缓存的策略
        3.tcp的连接（http1.0串行连接  http1.1持久连接）
        4. host头的处理。 http1.0认为每台服务器只有一个ip地址，请求消息中的url没有传递主机名。 但是有了虚拟机了后一个物理服务器有多个虚拟机他们共享一个ip地址，如果请求消息中没有host头域则会报告一个错误
    http2.0:
        http2.0中有帧和流的概念： 帧代表传输最小的数据单位，每个帧都有序列标识表面它是属于那个流，流是多个帧组成的数据流。 每个流都是一个请求
        1.新的二进制格式： http1.x的解析都是基于文本的。所以会存在缺点。 文本的形式是多样性的，必须很全面，但是二进制不同，只识别0和1的组合。
        2.多路复用
        3.头部压缩 http2.0采用了encoder来减少传输头部的大小
    Http报文：
        http报文指的是：http协议交互的信息被称之为报文。 客户端的报文是请求报文  服务端报文是响应报文
        请求报文: 请求行（请求方法， 版本）， 请求首部（请求url， 客户端信息） ， 内容体
        响应报文： 状态行（协议版本， 状态吗）， 响应首部（服务器名称， 资源标识）， 内容体
    状态码：
        301: 永久重定向， 资源被分配到了新的url
        302: 临时重定向， 资源被临时分配到了新的url
        304: 服务器允许访问资源， 但是请求未满足条件的情况（与重定向无关）
    请求字段：
        authority: 网站域名 2-class.com
        method: 请求的方式 GET
        path: 请求的地址 /api/homePage/getChinaMapData
        scheme: 什么协议 https
        accept: 能正常接受的媒体类型 */*,
        accept-encoding: 能正常接受的编码格式列表 gizp, deflate
        accept-language: 能够正常接受语言的列表 zh-ch
        cookie: 发送给服务器的Cookie信息
        referer: 请求发起页面的原始url https://2-class.com/
        user-agent: 客户端信息
        Host: 服务器的域名，用于区分单台服务器多个域名的虚拟主机
    响应字段：
        age: 资源在代理缓存中存在的时间
        ETag: 资源标识， 资源发生变化是标识也会发生变化
        Location: 客户端重定向到某个url
        set-Cookie: 需要客户端的信息，一般用于识别用户身份

###react生命周期
    在react16.3版本当中react添加了2种新的生命周期，同时也准备废除3个生命周期的使用16.x版本还能正常使用,但是在17版本正式废除
    1. componentWillMount   
        在挂载阶段的时候的使用到 - （被废除) ###static getDerivedStateFromProps取代
    #static getDerivedStateFromProps(nextProps, nextState)
        触发的事件在创建实列之后, 或者每次获取到新的props。返回一个Object对象,这里虽然改变了state,但是不会再次触发函数。如果返回值为null,就不更新state。
        注意点: 由于这个生命周期是一个静态的方法所以this是undefined,不指向实例。之所以是静态方式是:以后组件将进行异步渲染,防止实例属性被不安全访问   
    2: render
        将我们虚拟dom转换为真实dom
    3. componentDidMount
        在这里进行异步请求
    4. componentReceiveProps
         当props数据发生改变的时候的,该生命周期进行自执行。 （被废除） ###getDerviedStateFromProps
    ### static getDerivedStateFromProps
    5. shouldComponentUpdate（nextProps, nextState）
         返回true和false。 当函数返回false的时候阻止render的函数的调用,阻止组件的重渲染, 优化性能 
    6. getSnapshotBeforeUpdate
        在最新的数据提交给Dom前被调用, 它让你在组件的数据可能要改变之前改变获取他们, 他的返回值被传递给componentDidUpdate的第三给参数
    7. render 
    8. componentDidUpdate
    9. componentUnWillMount
        清除组件中的一些定时器,移除一些事件dom监听
    10. componentDidCatch（error, errorInfo）
        第一个参数: 抛出的实际错误 第二个参数: 错误信息,他返回带有componentStack的属性对象
         如果一个组件中使用了这个生命周期, 则他将成为一个错误边界(错误边界回捕获渲染期间， 在生命周期方法中和他们整棵树的构造函数中的错误，就像使用了try catch 不会将错误直接抛出)。 错误处理指的是react组件中能捕获子组件树中的javascript的异常, 并打印出来,展示备用的ui组件的生命周期方法, 避免了组件树的崩溃
### react-reudx理解
    redux是一种单向数据流。简单说view通过dispatch一个action后，根据常量进行对应的reducer处理,然后更新store，最后view根据store的改变重新渲染
    Store
        保存数据的地方,整个应用只能有一个Store, react提供了createStor函数用来生成Store
        let Store = createStore(combinReducers(), applyMiddleware());
        stote有三个方法:
            store.getState()   //获取某个时刻的数据state
            store.dispatch()   //发出action方法
            store.subscribe()  // 监听store的变化函数一旦store变化就会执行
    Reduce:
        一个纯函数,接受state和action
        根据action中的type常量来判断更新不同的store;
        一个reducer只能处理一个action
        redux有一个内置的combinReducer用于把不同的reduce的合并成一个reduce
    redux的中间件
        中间件是为了处理不同类型的action,有action到reduce的过程中有一层middleware,是redux可以处理函数promise等类型的action
    Middleware能够实现的原理:
        是因为store会传递store(dispatch， getStore),next,action给中间件函数,这里reducer使用了函数柯里化的写法,其实这三个参数一次传递过来也没有问题, 所以可以在中间件函数对action作出一定的处理在调用dispatch或者next
        （stotre）=> next=>action=>{
            //do sth for action
            next(...)|dispatch(...)
        }
    redux主要组成部分和函数方法
        createStore(reducer, initialState, enhancer) store的创建函数 接受combineReducer创建函数 初始化state， store的增强器
        combineReducers() 接受一个reducer组成的对象, 返回一个函数, store的内部在更新的state时会给这个函数传递state和action并执行从而创建新的state,
        applyMiddleware(): enhancer的创建函数, enhancer是一个store的包装,他将接受的createStore并执行得到createStore返回的{dispatch,getState,subscribe,...}并对dispatch进行扩展1.执行所有中间件,传递dispatch,getState给中间件函数2.compose执行后的中间件数组之所以可以compose是因为所有的中间件都返回一个接受action的函数,这个函数就可以传递给下一代函数当作next3。 将包装后的dispatch和createStore返回一个对象合并
###react中的纯函数
    定义: 一个函数的返回结果只依赖于它的参数,并且在执行的过程当中是没有副作用的
    副作用: 修改外部的变量, 调用Dom Api修改页面, ajax的请求, window.reload刷新页面
    为什么需要纯函数: 因为纯函数不会产生不可预料的行为, 也不会对外部产生什么影响
###高阶组件:
    接受一个组件,返回一个组件, 是一个函数
    高阶组件的实现方式: (区别就是一个是继承React.Component, 一个是要继承使用高阶组件的组件)
        1. 属性代理:
            一个函数接受一个WrappedComponent组件作为参数传入, 并返回一个继承React.Component的组件的类,且在render方法中返回WrappedComponent.
            在属性代理中的操作: 操作props, 抽离state, 用其他元素包裹传入的组件, 通过ref访问组件的实例
        2. 反向继承
            一个函数接受一个WrappedComponent组件作为参数,并返回一个继承了该传入WrappedComponent组件的类, 且在该累的render方法中返回super.render()方法
            反向继承可以用来: 操作state, 渲染劫持
    高阶组件的问题:
        静态方法丢失
            因为原始组件被包裹在一个容器组件内, 也就意味新组件没有原始组件的任何静态方法,所以要做静态方法的拷贝,或者使用第三方库来自动处理
                //import hoistNonReactStatic from "hoist-non-react-static"
                function AppHoc(WrappedComponent) {
                    class Enhance extends React.Component {
                        Enhance.staticMethod = WrappedComponent.staticMethod;
                        //hoistNonReactStatic(Enhance, WrappedComponent)
                    }
                }
        ref属性不能透传
            我们可以使用React.forWardRef这api来解决
        反向继承不能保证完整的子组件被渲染
            react有函数式组件和class组件, 由于反向代理可以劫持渲染过程,所以这个过程我们可以对elements tree, state, props结果做各种操作
            但是是function组件的化,就不能操作组件的子组件了
###原型链
    每一个对象都一个prototype属性, 该属性指向的就是一个prototype对象（原型对象）,每一对象也有一个隐式的__proto__属性, 这个对象上的f.__proto__指向的就是F.prototype原型对象。 访问一个对象的属性的时候,现在对象属性上查找,如果查找不到就在原型对象上查找
###正则
    我们一般有两种方法来定义我们的正则对象:
        1.构造函数
            new RegExp('abc', 'gi')
        2.字面量的方法
            /abc/gi
    通常正则对象一般有3个方法: test, exec, compile,  //   /安徽|河南/.test(str)
        1.test方法,该方法用来测试某个字符是否与正则匹配,匹配就返回true
        2.compile方法能够对正则表达式进行编译,被编译的正则在使用的时候效率更高一点,如果一个正则只是用一两次,没特别明显的效应
        3.exec方法接受的是一个字符串,返回的是一个数组
    但是在js的String类型的对象也拥有一些和正则相关的方法 // str.search(/安徽/)
        1.search
            该方法是一个string对象的一个方法,用来查找第一次匹配的字符串的位置, 找到了就返回该位置的索引,否则返回-1,它返回的只是第一次匹配的位置
        2.replace
            将字符串中的某些字串替换成需要的内容
        3.split
            将一个字符串拆分成一个数组
        4.match
            该方法接受一个正则作为参数,来匹配一个字符串,输出的结果不是全局匹配下和exec方法结果一样,但是在全局匹配下match是返回所有的结果,而exec返回的是下一个lastIndex的结果
        元字符: \d, 数字[0-9]
               \D, 非数字
               \w 匹配0-9，a-z，A-Z _的数字或者字符
               \W 匹配不是数字,字母,下划线的字符
               \s 匹配不可见字符, 包括空格,制表符,换行符
               \S 匹配任意可见的字符
###数据类型
    String, Number, Boolean, Object, undefined, null, symbol
###http缓存
    协商缓存和强缓存
###virtual-dom的diff算法
    diff算法的原则: 1.react只会对同一级别的节点进行比较,不会跨级比较节点,如果跨级比较节点则会在原级删除节点,在另一级新建节点
                  2. 不同的dom元素节点,直接删除新建,不继续比较, 如果相同元素节点则继续沿用虚拟dom树
                  3. 同一节点下和子节点比较: react根据key值比较节点是否相同, 对于已存在的节点,如果顺序修改则移动节点,已删除删除节点,新增则新增节点