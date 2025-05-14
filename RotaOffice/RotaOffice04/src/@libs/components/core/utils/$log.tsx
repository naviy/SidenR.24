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



	function incIndent()
	{
		indent += "    ";
	}

	function decIndent()
	{
		indent = indent.substring(0, indent.length - 4) || "";
	}



	export function print(...args: any[])
	{
		return _log(args, msgs => console.log(...msgs));
	}


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
		return log("    ", ...args);
	}

	export function __(...args: any[])
	{
		return log("        ", ...args);
	}

	export function ___(...args: any[])
	{
		return log("            ", ...args);
	}

	export function ____(...args: any[])
	{
		return log("                ", ...args);
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
		return debug("    ", ...args);
	}

	export function __debug(...args: any[])
	{
		return debug("        ", ...args);
	}

	export function ___debug(...args: any[])
	{
		return debug("            ", ...args);
	}

	export function ____debug(...args: any[])
	{
		return debug("                ", ...args);
	}



	//---



	export function error(...args: Array<any>)
	{

		if (!console || !console.error)
			return undefined;


		const msg: any[] = [/*line + "   " +*/];

		indent && msg.push(indent);


		if (
			args.length === 1 &&
			args[0] && typeof args[0] === "object" && args[0].message
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
			typeof args[0] === "string" &&
			typeof args[1] === "object" && args[1].message
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

				printErrorTrace(args2);

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
				printErrorTrace(msg);
			else
			{
				console.log(...msg);
			}

		}



		return args[0];

	}



	export function _error(...args: any[])
	{
		return error("    ", ...args);
	}

	export function __error(...args: any[])
	{
		return error("        ", ...args);
	}

	export function ___error(...args: any[])
	{
		return error("            ", ...args);
	}

	export function ____error(...args: any[])
	{
		return error("                ", ...args);
	}



	//---



	export function v(name: string | null | undefined, value: any, flatten = 1)
	{

		let args = [];


		name && args.push(name + ":");

		args.push(...toLogValues(value, flatten));


		log(...args);


		return value;

	}



	export function a(name: string, array: any[] | null | undefined)
	{

		console.group(name + ":", array?.length)

		if (array)
		{

			for (let i = 0; i < array.length; i++)
			{
				console.log(
					`%c[${i}]:%c`, "color: #aaaaaa;", "",
					...toLogValues([array[i]])
				);
			}
		}

		console.groupEnd()


		return array;

	}



	//---



	function _log(args: any[], print: (msgs: any[]) => any)
	{

		if (!console?.log)
			return undefined;


		let msgs = toLogValues(args);

		if (typeof msgs[0] === "string")
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
		//console.groupCollapsed("%c%s", "font-weight: normal", ...msgs);
		console.trace();
		console.groupEnd();
	}



	function printErrorTrace(msgs: any[], stackTrace?: any)
	{
		//console.groupCollapsed(...msgs);


		let prms = formatConsoleParams(msgs);

		console.groupCollapsed(
			"%c" + prms.fmt,
			"font-weight: normal; color: maroon; background: #fdf2f5; display: block; width: 100%; padding: 4px; margin: -4px",
			prms.args
		);
		stackTrace && console.error(stackTrace);
		console.trace();

		console.groupEnd();
	}



	//---



	function toLogValues(
		args: any[],
		flatten = 1 // глубина 
	): any[]
	{

		let msgs: any[] = [];

		for (let a of args)
		{
			pushLogValue(msgs, a, flatten);
		}

		return msgs;



		function pushLogValue(msg: any[], value: any, flatten: number): void
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
					pushLogValue(value2, a, Math.max(0, flatten - 1));
				}

				msg.push(value2);
			}

			else if (typeof value === "object" && value["toLogValue"])
			{
				let value2: any;

				try
				{
					value2 = value["toLogValue"]();
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



	interface BlockOptions
	{
		filter?: () => boolean;
		filtered?: () => void;
	}


	export function b(): void;

	export function b(msg: string | any[]): void;

	export function b<T>(msg: string | any[], body: () => T): T;

	export function b<T>(msg: string | any[], o: BlockOptions, body: () => T): T | undefined;

	export function b<T>(
		msg?: string | any[],
		arg1?: (() => T) | BlockOptions,
		body?: () => T
	): T | undefined | void
	{

		let o: BlockOptions | null = null;

		if (typeof arg1 === "function")
		{
			body = arg1 as () => T;
		}
		else if (typeof arg1 === "object")
		{
			o = arg1 as BlockOptions;
		}


		if (o?.filter && !o.filter())
		{
			return body?.();
		}


		o?.filtered?.();


		blockHeader(msg);


		if (body)
		{
			let result = body();

			e();

			return result;
		}


		return undefined;

	}



	export function e(...msgs: any[])
	{

		decIndent();


		forceAllowLogTrace = false;

		console.groupEnd();

		let logCount = _blockLogCounts[_blockLogCounts.length - 1];
		logCount && log("  }", ...msgs);

		forceAllowLogTrace = undefined;


		_blockLogCounts.length--;

	}



	function blockHeader(msg?: string | any[])
	{

		forceAllowLogTrace = true;


		if (Array.isArray(msg))
		{
			log(...msg /*, " {"*/);
		}
		else if (msg)
		{
			log(msg /*, "{"*/);
		}
		else
		{
			log("{");
		}


		forceAllowLogTrace = undefined;


		incIndent();
		_blockLogCounts.push(0);

	};



	//---






	//---



	export interface MethodLogConfig<TTarget>
	{
		filter?: (target: TTarget, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => any;// boolean | null | undefined | number;
		filtered?: (target: TTarget) => void;
		async?: boolean;
	}



	export function m(originalMethod: any, context: ClassMethodDecoratorContext): any;
	export function m<TTarget = any>(cfg: MethodLogConfig<TTarget>): ((originalMethod: any, context: ClassMethodDecoratorContext) => any);



	export function m<TTarget = any>(arg0: any, arg1?: any): ((this: any, ...args: any[]) => any)
	{

		if (typeof arg0 === "object")
		{
			return (originalMethod: any, context: ClassMethodDecoratorContext) =>
			{
				return _logm(originalMethod, context, arg0 as MethodLogConfig<TTarget>);
			}
		}


		return _logm<TTarget>(arg0, arg1);

	}




	function _logm<TTarget>(
		originalMethod: any,
		context: ClassMethodDecoratorContext,
		cfg?: MethodLogConfig<TTarget>
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


			let logValue = this["toLogValue"] ? this["toLogValue"]() : this;

			if (logValue !== null && logValue !== undefined)
			{

				let valueFmt = "";

				if (!Array.isArray(logValue))
					logValue = [{ this: logValue }];

				for (let val of logValue)
				{
					valueFmt += consoleFormatParamTypeOf(val);
				}


				//$disablePrintStack = true;

				print(` %cthis: %c${valueFmt}`,
					"color: blue; font-weight: 400;",
					"color: gray; font-weight: 400;",
					...logValue
				);

				//$disablePrintStack = false;

			}


			cfg?.filtered?.(this);


			let startTime = new Date().getTime();

			//incIndent();

			let result = originalMethod.apply(this, args);
			//$log(`%c${methodName}%c.result: `, "color: #c5790f; font-weight: bold;", "", result);

			//decIndent();


			if (result === undefined)
			{
				let endTime = new Date().getTime();

				e(endTime - startTime, "ms");
			}


			else if (result && cfg?.async !== false && Promise.resolve(result) === result)
			{

				//$log(`... await %c${methodName} ...`, "color: #c5790f; font-weight: bold;");

				result = result
					.then((aresult: any) =>
					{

						let endTime = new Date().getTime();


						if (aresult !== void 0)
						{
							forceAllowLogTrace = false;
							log(`~ %c${methodName}%c ~> `, "color: #c5790f; font-weight: bold;", "", aresult);
						}

						e(endTime - startTime, "ms");


						return aresult;

					})
					.catch((err: any) => error(err));

			}


			else
			{

				let endTime = new Date().getTime();


				if (!result || typeof result !== "object" || result["$$typeof"] !== Symbol.for("react.element"))
				{

					let result2 = (
						result && typeof result === "object"
							? result["toLogValue"]
								? result["toLogValue"]()
								: { "return": result }
							: result
					);

					forceAllowLogTrace = false;

					log(`= %c${methodName}%c => `, "color: #c5790f; font-weight: bold;", "", result2);

				}

				e(endTime - startTime, "ms");

			}



			return result;

		}

	}



	function methodLogParams(obj: any, method: Function, methodName: string, args: any[])
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
							obj + "";
		}
		catch (ex)
		{
			objName = obj ? obj.constructor.name : obj;
		}



		if (objName === "[object Object]")
			objName = obj.constructor.name;


		args = [...args];

		let argCount = args.length;

		for (let i = argCount - 1; i >= 0; i--)
		{
			if (args[i] !== undefined)
				break;

			--argCount;
		}

		args.length = argCount;



		let prms = formatConsoleParams(args);

		// all emoji: https://unicode.org/emoji/charts/full-emoji-list.html
		let icon = String.fromCodePoint(0x1F4D1);


		let fmt = `${icon}%c${objName ? objName + "." : ""}%c${methodName}%c(%c${prms.fmt}%c)`//`    %c%O`;


		return {
			fmt,
			args: [
				"color: #1f3795; font-weight: normal;",
				"color: #c5790f; font-weight: bold;",
				"",
				"color: gray; font-style: italic; font-weight: normal;",
				...prms.args,
				"",
				//"color: red;",
				////{ method }
				//method
			]


		};

	}



	function consoleFormatParamTypeOf(arg: any)
	{
		return typeof arg === "number" ? "%d" : typeof arg === "string" ? "%s" : "%o";
	}



	function formatConsoleParams(args: any[])
	{

		let fmt = "";
		let args2 = [];

		let allArgsIsPrimitive = true;


		for (let arg of args)
		{

			arg = (
				!arg || typeof arg !== "object"
					? arg
					: arg.toLogName
						? arg.toLogName()
						: arg
			);


			if (arg && typeof arg === "object" || typeof arg === "function")
			{
				allArgsIsPrimitive = false;
			}


			args2.push(arg);


			if (allArgsIsPrimitive)
			{
				if (fmt)
					fmt += ", ";

				fmt += consoleFormatParamTypeOf(arg);
			}

		}


		if (!allArgsIsPrimitive)
		{
			fmt = "%O";
			args2 = [{ args: args2.length === 1 ? args2[0] : args2 }];
		}


		return {
			fmt,
			args: args2,
		};

	}


	//---


}




export var $LOG = $log;