;(function() {
	/*
	 * 向mocha Context中注入支持异步的wait方法，最后需要调用done
	 * 例如：this.timeout(Number).wait(executor, interval).done(func).wait(1000).wait("#ready").done(done)，请在最后传递done【mocha的异步回调】或者在.done(func)，func内调用done()告知mocha这个异步的case执行完毕
	 * @param executor {function|number|string} 状态轮询执行的函数，return !!res的时候结束轮询，并将res作为参数传给done配置的回调|为number的时候表示指定数字的延时，单位毫秒|字符串的时候，当做一个query，并通过jQuery获取，直到length不为0，并将执行结果的jQuery dom对象作为参数传递给done回调
	 * @param interval 轮询时间间隔，单位毫秒
	 */
	if(typeof jQuery === "undefined") throw new Error("jQuery is required");
	describe("Inject Async", function() {
		var Context = this.ctx.constructor;
		Context.prototype.async = function(executor, interval, arr) {
			var me = this,
				interval = interval !== false ? interval || 100 : interval,
				_done = arr || [];
			me._stack = me._stack || [];
			me.done = function(cb) {
				cb && _done.push(cb);
				return this;
			};
			// to wait
			if(me.timer) {
				me._stack.push([executor, interval, _done])
			} else {
				$.when((function() {
					var dtd = $.Deferred(),
						fail = dtd.reject,
						success = dtd.resolve;
					// delay
					if(interval === false) {
						me.timer = setTimeout(function() {
							me.timer = 0;
							success();
						}, executor)
					// interval
					} else {
						me.timer = setInterval(function() {
							var res = executor && executor();
							if(res) {
								clearInterval(me.timer);
								me.executedRes = res;
								me.timer = 0
								success(res);
							}
						}, interval)
					}
					return dtd
				})()).done(function(res) {
					$.each(_done, function(i, func) {
						// promise区分是否promise自带的回调，不是，将executor执行结果作为参数传递
						func(func.toString().match(/return done\(err\)/g) ? null : res)
					});
					// goto next call
					if(me._stack.length) {
						me.async.apply(me, me._stack[0]);
						me._stack.shift();
					}
				});
			}
			return this
		};
		Context.prototype.wait = function(timeout, interval) {
			var type = typeof timeout,
				me = this,
				done,
				args = []
			switch(type) {
				case "number":
					var old = me.runnable()._timeout;
					// 只能防止超时 = =||
					if(old - timeout < 5000) {
						me.timeout(timeout + 5000);
						done = function() {
							me.timeout(old)
						}
					}
					args = [timeout, false];
					break;
				case "string":
					// treat string as jQuery query
					args = [function() {
						var res = $(timeout);
						if(res.length) return res
					}, interval];
					break;
				case "function":
					args = [timeout, interval];
					break;
				default:throw new Error("unexpected type of wait");
			}
			return me.async.apply(me, args);
		}
	});
})()