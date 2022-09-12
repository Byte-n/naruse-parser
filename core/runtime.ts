// 主要是做一些运行时的转换方法，比如迭代器

export function runTimeGenerator(self: any, fn: Function) {
    return () => {
        // 保存当前函数执行的顺序与参数, 因为无法了解函数内具体执行哪一步，需要外部变量来帮忙保存状态
        // 内部state默认从1开始
        const state = { state: 1, value: undefined };
        function next(v: any) {
            state.value = v;
            // 获得当前状态机的状态与yield的值
            const [genState, value] = fn.apply(self, [state]);
            // 当返回继续迭代时则继续向下行走
            if (genState) state.state++;
            return genState ? { value, done: false } : { value, done: true };
        }
        return { next };
    }
}