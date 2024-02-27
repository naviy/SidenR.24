export function $log(...args: any[]): any
{
	return $log.log(...args);
}




export module $log
{


	//---



	var indent = "";
	var _blockLogCounts: number[] = [];



	//---



	export var allowLogTrace: boolean = true;
	var forceAllowLogTrace: boolean | undefined = undefined;


	export function useLogTrace()
	{
		return forceAllowLogTrace || allowLogTrace && forceAllowLogTrace !== false;
	}



	//---




	export function log(...args: any[])
	{
		return _log(args, msgs =>
		{
			if (useLogTrace())
				printLogTrace(msgs);
			else
				console.log(...msgs);
		});
	}


	export function _(...args: any[])
	{
		return log('    ', ...args);
	}

	export function __(...args: any[])
	{
		return log('        ', ...args);
	}

	export function ___(...args: any[])
	{
		return log('            ', ...args);
	}

	export function ____(...args: any[])
	{
		return log('                ', ...args);
	}



	//---



	export function debug(...args: any[])
	{
		return _log(args, msg =>
		{
			console.debug(...msg);
		});
	};


	export function _debug(...args: any[])
	{
		return debug('    ', ...args);
	}

	export function __debug(...args: any[])
	{
		return debug('        ', ...args);
	}

	export function ___debug(...args: any[])
	{
		return debug('            ', ...args);
	}

	export function ____debug(...args: any[])
	{
		return debug('                ', ...args);
	}



	//---



	export function error(...args: Array<any>)
	{

		if (!console || !console.error)
			return undefined;


		const msg: any[] = [/*line + '   ' +*/];

		indent && msg.push(indent);


		if (
			args.length === 1 &&
			args[0] && typeof args[0] === 'object' && args[0].message
		)
		{

			console.groupCollapsed(msg[0], args[0] instanceof Error ? args[0] : args[0].message);

			args[0].stackTrace && console.error(args[0].stackTrace);

			if (useLogTrace())
				console.trace();

			console.groupEnd();

		}


		else if (
			args.length === 2 &&
			typeof args[0] === 'string' &&
			args[1] && args[1] && typeof args[1] === 'object' && args[1].message
		)
		{

			if (useLogTrace())
			{

				let args2 = [];

				if (Array.isArray(msg[0]))
				{
					args2.push(...msg[0]);
				}
				else if (msg[0])
				{
					args2.push(msg[0]);
				}


				args.push(args[0]);

				printLogTrace(args2);

			}
			else
			{
				console.error(msg[0], args[0]);
			}


			console.groupCollapsed(args[1] instanceof Error ? args[1] : args[1].message);


			args[1].stackTrace && console.error(args[1].stackTrace);


			if (useLogTrace())
			{
				console.trace();
			}


			console.groupEnd();

		}

		else
		{

			msg.push.apply(msg, args);


			if (useLogTrace())
				printLogTrace(msg);
			else
				console.log(...msg);

		}



		return args[0];

	}



	export function _error(...args: any[])
	{
		return error('    ', ...args);
	}

	export function __error(...args: any[])
	{
		return error('        ', ...args);
	}

	export function ___error(...args: any[])
	{
		return error('            ', ...args);
	}

	export function ____error(...args: any[])
	{
		return error('                ', ...args);
	}



	//---



	function _log(args: any[], print: (msgs: any[]) => any)
	{

		if (!console?.log)
			return undefined;


		let msgs = toLogValues(args);

		if (typeof msgs[0] === 'string')
		{
			msgs[0] = indent + msgs[0];
		}
		else
			msgs = [indent, ...msgs];


		print(msgs);



		if (_blockLogCounts.length)
		{
			_blockLogCounts[_blockLogCounts.length - 1]++;
		}



		return args[args.length - 1];

	}



	function printLogTrace(msgs: any[])
	{
		console.groupCollapsed(...msgs);
		//console.groupCollapsed('%c%s', 'font-weight: normal', ...msgs);
		console.trace();
		console.groupEnd();
	}



	//---



	function toLogValues(args: any[]): any[]
	{

		let msgs: any[] = [];

		for (let a of args)
		{
			pushLogValue(msgs, a, true);
		}

		return msgs;



		function pushLogValue(msg: any[], value: any, flatten: boolean): void
		{

			if (!value)
			{
				msg.push(value);
			}
			else if (Array.isArray(value))
			{
				let value2: any[] = [];

				for (let a of value)
				{
					pushLogValue(value2, a, false);
				}

				msg.push(value2);
			}

			else if (typeof value === 'object' && value['toLogValue'])
			{
				let value2: any;

				try
				{
					value2 = value['toLogValue']();
				}
				catch (ex)
				{
					value2 = value;
				}


				if (flatten && Array.isArray(value2))
					msg.push(...value2);
				else
					msg.push(value2);
			}
			else
			{
				msg.push(value);
			}

		}


	}



	//---



	export function $try<T>(action: () => T)
	{
		try
		{
			return action();
		}
		catch (ex)
		{
			error(ex);
			return undefined;
		}
	}



	//---



	export function b<T>(msg?: string | any[], action?: () => T): T | undefined
	{

		blockHeader(msg);


		if (action)
		{
			let result = action();

			e();

			return result;
		}


		return undefined;

	}



	export function e(...msgs: any[])
	{

		indent = indent.substring(0, indent.length - 4) || '';


		forceAllowLogTrace = false;

		console.groupEnd();

		let logCount = _blockLogCounts[_blockLogCounts.length - 1];
		logCount && log('}', ...msgs);

		forceAllowLogTrace = undefined;


		_blockLogCounts.length--;

	}



	function blockHeader(msg?: string | any[])
	{

		forceAllowLogTrace = true;


		if (Array.isArray(msg))
		{
			log(...msg /*, ' {'*/);
		}
		else if (msg)
		{
			log(msg /*, '{'*/);
		}
		else
		{
			log('{');
		}


		forceAllowLogTrace = undefined;


		indent += '    ';
		_blockLogCounts.push(0);

	};



	//---



	export interface MethodLogConfig
	{
		filter?: (target: any, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => boolean;
		async?: boolean;
	}



	export function m(originalMethod: any, context: ClassMethodDecoratorContext): any;
	export function m(cfg: MethodLogConfig): ((originalMethod: any, context: ClassMethodDecoratorContext) => any);



	export function m(arg0: any, arg1?: any): ((this: any, ...args: any[]) => any)
	{

		if (typeof arg0 === 'object')
		{
			return (originalMethod: any, context: ClassMethodDecoratorContext) =>
			{
				return _logm(originalMethod, context, arg0 as MethodLogConfig);
			}
		}


		return _logm(arg0, arg1);

	}




	function _logm(
		originalMethod: any,
		context: ClassMethodDecoratorContext,
		cfg?: MethodLogConfig
	)
	{

		let methodName = String(context.name);


		return function (this: any, ...args: any[])
		{

			if (cfg?.filter && !cfg.filter(this, ...args))
			{
				return originalMethod.apply(this, args);
			}


			let logPrms = methodLogParams(this, originalMethod, methodName, args);

			blockHeader([logPrms.fmt, ...logPrms.args]);


			let logValue = this['toLogValue'] ? this['toLogValue']() : this;

			if (logValue !== null && logValue !== undefined)
			{

				let valueFmt = '';

				if (!Array.isArray(logValue))
					logValue = [{ this: logValue }];

				for (let val of logValue)
				{
					valueFmt += consoleFormatParamTypeOf(val);
				}


				//$disablePrintStack = true;

				log(`%cthis: %c${valueFmt}`,
					'color: blue; font-weight: 400;',
					'color: gray; font-weight: 400;',
					...logValue
				);

				//$disablePrintStack = false;

			}



			let startTime = new Date().getTime();

			let result = originalMethod.apply(this, args);
			//$log(`%c${methodName}%c.result: `, 'color: #c5790f; font-weight: bold;', '', result);


			if (result === undefined)
			{
				let endTime = new Date().getTime();

				e(endTime - startTime, 'ms');
			}


			else if (result && cfg?.async !== false && Promise.resolve(result) === result)
			{

				//$log(`... await %c${methodName} ...`, 'color: #c5790f; font-weight: bold;');

				result = result
					.then((aresult: any) =>
					{

						let endTime = new Date().getTime();


						if (aresult !== void 0)
						{
							forceAllowLogTrace = false;
							log(`~ %c${methodName}%c ~> `, 'color: #c5790f; font-weight: bold;', '', aresult);
						}

						e(endTime - startTime, 'ms');


						return aresult;

					})
					.catch((err: any) => error(err));

			}


			else
			{

				let endTime = new Date().getTime();


				if (!result || typeof result !== 'object' || result['$$typeof'] !== Symbol.for('react.element'))
				{
					forceAllowLogTrace = false;
					log(`= %c${methodName}%c => `, 'color: #c5790f; font-weight: bold;', '', result);
				}

				e(endTime - startTime, 'ms');

			}



			return result;

		}

	}



	function methodLogParams(obj: any, method: Function, methodName: string, args: any)
	{
		let objName: string;

		try
		{
			objName =
				!obj ?
					null :
					obj.toLogName ?
						obj.toLogName() :
						obj.toString ?
							obj.toString() :
							obj + '';
		}
		catch (ex)
		{
			objName = obj ? obj.constructor.name : obj;
		}



		if (objName === '[object Object]')
			objName = obj.constructor.name;



		let argCount = args.length;

		for (let i = argCount - 1; i >= 0; i--)
		{
			if (args[i] !== undefined)
				break;

			--argCount;
		}



		let argsFmt = '';
		let args2 = [];


		for (let i = 0; i < argCount; i++)
		{

			let arg = args[i];

			arg = !arg || typeof arg !== 'object' ?
				arg :
				arg.toLogName ?
					arg.toLogName() :
					arg;
			//arg.toString ?
			//	arg.toString() :
			//	arg + '';

			args2.push(arg);


			if (argsFmt)
				argsFmt += ', ';

			argsFmt += consoleFormatParamTypeOf(arg);

		}



		// all emoji: https://unicode.org/emoji/charts/full-emoji-list.html
		let icon = String.fromCodePoint(0x1F4D1);


		let fmt = `${icon} %c${objName ? objName + '.' : ''}%c${methodName}%c(%c${argsFmt}%c)    %O`;


		return {
			fmt,
			args: [
				'color: #1f3795; font-weight: normal;',
				'color: #c5790f; font-weight: bold;',
				'',
				'color: gray; font-style: italic; font-weight: normal;',
				...args2,
				'',
				{ method }
			]


		};

	}



	function consoleFormatParamTypeOf(arg: any)
	{
		return typeof arg === 'number' ? '%d' : typeof arg === 'string' ? '%s' : '%o';
	}



	//---


}