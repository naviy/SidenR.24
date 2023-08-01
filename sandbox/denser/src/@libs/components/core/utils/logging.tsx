export var $log_printStack = false;
$log_printStack = true;
let $forcePrintStack = false;
let $disablePrintStack = false;


//export var $log_ = $log;




let indent = '';
//let lineNo = 0;
let _blockLogCounts: number[] = [];






//===






export function $trace(groupTitle?: string)
{
	if (!groupTitle)
	{
		groupTitle = /*$trace.caller && $trace.caller.name ||*/ 'trace';
	}

	//let line = (++lineNo).toString();
	//while (line.length < 4) line = ' ' + line;

	console.groupCollapsed(/*line + '     ' +*/ indent + groupTitle);
	console.trace();
	console.groupEnd();
}




export function $alert(message: any)
{
	$log(message);

	let msg = message;
	if (typeof msg === 'object')
		msg = JSON.stringify(message);

	alert(msg);

	return message;
}




export function _log(args: any[], print: (msg: any[]) => any)
{

	if (!console?.log)
		return undefined;


	//let line = (++lineNo).toString();

	//while (line.length < 4)
	//{
	//	line = ' ' + line;
	//}



	let msg = toLogValue(args);

	if (typeof msg[0] === 'string')
	{
		msg[0] = /*line + '    ' +*/ indent + msg[0];
	}
	else
		msg = [/*line + '    ' +*/ indent, ...msg];


	print(msg);



	if (_blockLogCounts.length)
	{
		_blockLogCounts[_blockLogCounts.length - 1]++;
	}



	return args[args.length - 1];

}




//export function _logg(args: any[])
//{
//	return _log(args, msg => msg);
//	//return _log(args, msg => console.group(...msg));
//}



export function $log(...args: any[])
{

	return _log(args, msg =>
	{
		if ($forcePrintStack || $log_printStack && !$disablePrintStack)
			$printStack(msg);
		else
			console.log(...msg);

	});

};



export function _$log(...args: any[])
{
	return $log('    ', ...args);
}



export function __$log(...args: any[])
{
	return $log('        ', ...args);
}



export function ___$log(...args: any[])
{
	return $log('            ', ...args);
}



export function $debug(...args: any[])
{

	return _log(args, msg =>
	{
		//if ($forcePrintStack || $log_printStack && !$disablePrintStack)
		//	$printStack(msg);
		//else
		console.debug(...msg);

	});

};



export function _$debug(...args: any[])
{
	return $debug('    ', ...args);
}



export function __$debug(...args: any[])
{
	return $debug('        ', ...args);
}



export function ___$debug(...args: any[])
{
	return $debug('            ', ...args);
}



export function _$error(...args: any[])
{
	return $error('    ', ...args);
}



export function __$error(...args: any[])
{
	return $error('        ', ...args);
}



export function ___$error(...args: any[])
{
	return $error('            ', ...args);
}




export function $warn(...args: any[])
{

	return _log(args, msg =>
	{
		//if ($forcePrintStack || $log_printStack && !$disablePrintStack)
		//	$printStack(msg);
		//else
		console.warn(...msg);

	});

};



export function _$warn(...args: any[])
{
	return $warn('    ', ...args);
}



export function __$warn(...args: any[])
{
	return $warn('        ', ...args);
}



export function ___$warn(...args: any[])
{
	return $warn('            ', ...args);
}






function toLogValue(args: any[]): any[]
{

	let msg: any[] = [];

	for (let a of args)
	{
		pushLogValue(msg, a, true);
	}

	return msg;

}



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



export function unprintStack<T>(log: T): T
{
	return ((...args: any[]) =>
	{
		$disablePrintStack = true;
		try
		{
			return (log as any)(...args);
		}
		finally
		{
			$disablePrintStack = false;
		}
	}) as any as T;
}



export function $error(...args: Array<any>)
{

	if (!console || !console.error)
		return undefined;



	//let line = (++lineNo).toString();

	//while (line.length < 4)
	//	line = ' ' + line;

	const msg: any[] = [/*line + '   ' +*/];

	indent && msg.push(indent);


	if (
		args.length === 1 &&
		args[0] && typeof args[0] === 'object' && args[0].message
	)
	{

		console.groupCollapsed(msg[0], args[0] instanceof Error ? args[0] : args[0].message);

		args[0].stackTrace && console.error(args[0].stackTrace);

		if ($forcePrintStack || $log_printStack && !$disablePrintStack)
			console.trace();

		console.groupEnd();

	}


	else if (
		args.length === 2 &&
		typeof args[0] === 'string' &&
		args[1] && args[1] && typeof args[1] === 'object' && args[1].message
	)
	{

		if ($forcePrintStack || $log_printStack && !$disablePrintStack)
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

			$printStack(args2);

		}
		else
		{
			console.error(msg[0], args[0]);
		}


		console.groupCollapsed(args[1] instanceof Error ? args[1] : args[1].message);


		args[1].stackTrace && console.error(args[1].stackTrace);


		if ($forcePrintStack || $log_printStack && !$disablePrintStack)
		{
			console.trace();
		}


		console.groupEnd();

	}

	else
	{

		msg.push.apply(msg, args);


		if ($forcePrintStack || $log_printStack && !$disablePrintStack)
			$printStack(msg);
		else
			console.log(...msg);

	}



	return args[0];

};



export function $try<T>(action: () => T)
{
	try
	{
		return action();
	}
	catch (ex)
	{
		$error(ex);
		return undefined;
	}
}



function blockHeader(message?: string | any[])
{

	//let stack = new Error().stack;

	//if (Array.isArray(message))
	//	_logg([...message, stack]/*, ' {'*/);
	//else if (message)
	//	_logg([message, stack]/*, '{'*/);
	//else
	//	_logg(['{', stack]);


	$forcePrintStack = true;


	if (Array.isArray(message))
	{
		$log(...message /*, ' {'*/);
	}
	else if (message)
	{
		$log(message /*, '{'*/);
	}
	else
	{
		$log('{');
	}


	$forcePrintStack = false;


	indent += '    ';
	_blockLogCounts.push(0);

};



export function $logb<T>(message?: string | any[], action?: () => T): T | undefined
{

	blockHeader(message);


	if (action)
	{
		let result = action();

		$loge();

		return result;
	}


	return undefined;

}



export function $loge(...msgs: any[])
{
	indent = indent.substring(0, indent.length - 4) || '';

	let logCount = _blockLogCounts[_blockLogCounts.length - 1];

	$disablePrintStack = true;

	console.groupEnd();
	logCount && $log('}', ...msgs);

	$disablePrintStack = false;

	_blockLogCounts.length--;
}



var reStackClassMethod = /\<\/([\w\d_]+)\.prototype\.([\w\d_]+)\@/;


export function $printStack(msg: any[])
{
	console.groupCollapsed(...msg);
	//console.groupCollapsed('%c%s', 'font-weight: normal', ...msg);
	console.trace();
	console.groupEnd();
}






//===






//export function methodLog(target: any, methodName: string, descriptor: PropertyDescriptor)
//{
//	let method = descriptor.value;

//	descriptor.value = function (...args)
//	{
//		let result = method.apply(this, args);

//		let logPrms = methodLogParams(this, methodName, args);


//		if (result !== undefined)
//			$log(logPrms.fmt + ' => ' + consoleFormatParamTypeOf(result), ...logPrms.args, result);
//		else
//			$log(logPrms.fmt, ...logPrms.args);


//		return result;
//	}
//}




export function $logm(filter: (target: any, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => boolean): ((target: any, methodName: string, descriptor: PropertyDescriptor) => void);
export function $logm(cfg: { async: boolean }): ((target: any, methodName: string, descriptor: PropertyDescriptor) => void);

//export function $logm(...keys: string[]): ((target: any, methodName: string, descriptor: PropertyDescriptor) => void);

export function $logm(target: any, methodName: string, descriptor: PropertyDescriptor): void;



export function $logm(...args: any[]): void | ((target: any, methodName: string, descriptor: PropertyDescriptor) => void)
{

	if (args && typeof args[0] === 'function')
	{
		let filter = args[0];

		return (target: any, methodName: string, descriptor: PropertyDescriptor) =>
		{
			_logm(target, methodName, descriptor, filter);
		}
	}


	if (args?.length === 1)
	{
		let cfg = args[0];

		return (target: any, methodName: string, descriptor: PropertyDescriptor) =>
		{
			_logm(target, methodName, descriptor, undefined, cfg);
		}
	}


	//if (args && typeof args[0] === 'string')
	//{
	//	let keys = args as string[];

	//	return (target: any, methodName: string, descriptor: PropertyDescriptor) => 
	//	{
	//		_logm(target, methodName, descriptor, trg => keys.indexOf(getComponentKey(trg)) >= 0);
	//	}
	//}



	(_logm as any)(...args);



	//function getComponentKey(cmp: any)
	//{
	//	return cmp?.['_reactInternals']?.key;
	//}

}




function _logm(
	target: any,
	methodName: string,
	descriptor: PropertyDescriptor,
	filter?: (target: any, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => boolean,
	cfg?: { async?: boolean }
): void
{

	let method = descriptor.value;



	descriptor.value = function (this: any, ...args: any[])
	{

		if (filter && !filter(this, ...args))
		{
			return method.apply(this, args);
		}



		let logPrms = methodLogParams(this, method, methodName, args);

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

			$log(`%cthis: %c${valueFmt}`,
				'color: blue; font-weight: 400;',
				'color: gray; font-weight: 400;',
				...logValue
			);

			//$disablePrintStack = false;

		}



		let startTime = new Date().getTime();

		let result = method.apply(this, args);
		//$log(`%c${methodName}%c.result: `, 'color: #c5790f; font-weight: bold;', '', result);


		let endTime: number;


		if (result === undefined)
		{

			endTime = new Date().getTime();


			$disablePrintStack = true;

			//$log(`= %c${methodName}`, 'color: #c5790f; font-weight: bold;');

			$loge(endTime - startTime, 'ms');

			$disablePrintStack = false;
		}


		else if (result && cfg?.async !== false && Promise.resolve(result) === result)
		{

			//$log(`... await %c${methodName} ...`, 'color: #c5790f; font-weight: bold;');

			result = result
				.then((aresult: any) =>
				{

					endTime = new Date().getTime();


					$disablePrintStack = true;

					if (aresult !== void 0)
					{
						$log(`~ %c${methodName}%c ~> `, 'color: #c5790f; font-weight: bold;', '', aresult);
					}

					//$loge();
					$loge(endTime - startTime, 'ms');
					$disablePrintStack = false;


					return aresult;

				})
				.catch((err: any) => $error(err));

		}


		else
		{

			endTime = new Date().getTime();


			$disablePrintStack = true;

			if (!result || typeof result !== 'object' || result['$$typeof'] !== Symbol.for('react.element'))
			{
				$log(`= %c${methodName}%c => `, 'color: #c5790f; font-weight: bold;', '', result);
			}

			//$loge();
			$loge(endTime - startTime, 'ms');

			$disablePrintStack = false;

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






export function $logf<T extends Function>(func: T)
{

	if (!func)
		return undefined;



	let funcName = func.name;



	return function (...args: any[])
	{

		let logPrms = methodLogParams(null, func, funcName, args);

		blockHeader([logPrms.fmt, ...logPrms.args]);


		let result = func.apply(null, args);
		//$log(`%c${methodName}%c.result: `, 'color: #c5790f; font-weight: bold;', '', result);



		if (result === undefined)
		{

			$disablePrintStack = true;

			//$log(`= %c${methodName}`, 'color: #c5790f; font-weight: bold;');

			$loge();

			$disablePrintStack = false;

		}

		else if (result && Promise.resolve(result) === result)
		{

			//$log(`... await %c${methodName} ...`, 'color: #c5790f; font-weight: bold;');

			result = result
				.then((aresult: any) =>
				{

					$disablePrintStack = true;

					if (aresult !== void 0)
						$log(`~ %c${funcName}%c ~> `, 'color: #c5790f; font-weight: bold;', '', aresult);

					$loge();
					$disablePrintStack = false;


					return aresult;

				})
				.catch((err: any) => $error(err));

		}


		else
		{

			$disablePrintStack = true;


			if (!result || typeof result !== 'object' || result['$$typeof'] !== Symbol.for('react.element'))
			{
				$log(`= %c${funcName}%c => `, 'color: #c5790f; font-weight: bold;', '', result);
			}

			$loge();


			$disablePrintStack = false;


		}



		return result;

	}

}






export function $logg<T>(msg: string | any[], action: () => T): T
{

	// all emoji: https://unicode.org/emoji/charts/full-emoji-list.html
	let icon = String.fromCodePoint(0x1F7E3);


	if (Array.isArray(msg))
		console.group(icon, ...msg);
	else
		console.group(icon, msg);


	let result = action() as any;


	if (result && Promise.resolve(result) === result)
	{
		return (result as any).then(() => console.groupEnd(), () => console.groupEnd()) as T;
	}


	console.groupEnd();

	return result;

}
