/*
在createStore源码中 createStore(reducer, initialState, applyMiddleWare(...middlewares))形式的时候就会返回
    return enhaner(createStore)(reducer, initialState);将代码拆分开为
    const temp = enhaner(createStore);  temp(reducer, initialState);
    这里的enhaner其实就是applyMiddleWare(...middlewares)返回的函数
*/
function applyMiddleWare(...middlewares) {
    //applyMiddleWare的作用就是增强 store中的dispatch的作用,进行扩展
    return (createStore) => (reducer, initialState, enhaner) => {
        let store = createStore(reducer, initialState, enhaner);
        let dispatch = store.dispatch;
        let china = [];
        //但是action的发起容易从next函数之前被dispatch,不会被中间件调用函数传递,所以我们要加个错误传递
        let dispatch = () => {
            throw new Error(
              `Dispatching while constructing your middleware is not allowed. ` +
                `Other middleware would not be applied to this dispatch.`
            )
          }
        const middlewareAPI = {
            getState: store.getState,
            //在因为在下面使用componse函数的时候会自动dispatch过去, 所以需要在这里进行使用
            dispatch: (action) => dispatch(action)
        }
        //  遍历所有的中间件组件,传入middlewareAPI执行,将返回值放到chain组件, 由于所有的中间件函数都相差不大
        /**
         * 以redux-thunk为例
         * export default thunk =({dispatch, getState}) => next => action => {
         * if(typeof action === "function") {
         *  return action(dispatch, getState)
         * } else {
         *      return next(action)
         * }
         */
        //所以 chain中是 chain = [next=>action=> {} , next=>action=>{}];但是由于闭包,所以可以使用dispatch, getState等参数
        chain = middlewares.map( middleware =>  middleware(middlewareAPI));
        /**
         * 这里的componse使用才是重点,把componse(...china)(store。dispatch)进行拆分
         * const fina = componse(...china); =>   fina = a(b(c(...args))) 这里的args其实指的就是我们的store.dispatch, 这里的next也就是作为next执行 返回的就是
         * action => {return store.dispatch(action)}
         * dispatch = fina(store.dispatch)
         * dispatch = componse(...china)(store.dispatch) === (action => {store.dispatch(action)} )
         */
        dispatch = componse(...china)(store.dispatch) 
        return {
            ...store,
            dispatch
        }
    }
} 