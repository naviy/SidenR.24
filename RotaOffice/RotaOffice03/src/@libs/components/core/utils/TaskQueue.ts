import { $log } from "./$log";






//===






export interface TaskInfo<T = any>
{

	id?: number;

	action: () => T | Promise<T>;

	promise: Promise<T>;
	resolve: (value?: T) => void;
	reject: (ex: any) => void;

}






export interface DeferredTaskInfo extends TaskInfo
{

	deferredKey: string;
	delay: number;
	timer: number;

}






export class TaskQueue
{

	//---



	get hasDeferred() { return !!this._deferredTask; }

	onWaiting?: () => (() => void) | null | undefined;


	private _tasks: TaskInfo[] = [];

	private _deferredTask: DeferredTaskInfo | null = null;


	private _taskTotalCount = 0;



	//---



	run<T>(
		action: () => T | Promise<T>
	): Promise<T>
	{

		//this.enqueueDeferredTask();

		let deferredTask = this._deferredTask;
		this._deferredTask = null;

		if (deferredTask)
		{
			clearTimeout(deferredTask.timer);
			this._tasks.push(deferredTask);
		}



		let task = this.createTask(action);

		this._tasks.push(task);


		this.callTasks();

		return task.promise;

	}



	runDeferred<T>(
		deferredKey: string,
		delay: number | null | undefined,
		action: () => T | Promise<T>
	): Promise<T>
	{


		let oldTask = this._deferredTask;
		this._deferredTask = null;


		if (oldTask)
		{

			clearTimeout(oldTask.timer);


			if (oldTask.deferredKey === deferredKey)
			{
				oldTask.resolve(undefined);
			}
			else
			{
				this._tasks.push(oldTask);
			}

		}



		let task = this.createTask(action) as DeferredTaskInfo;


		if (!delay)
		{
			this._tasks.push(task);
		}
		else
		{

			this._deferredTask = task;

			task.deferredKey = deferredKey;
			task.delay = delay;

			task.timer = window.setTimeout(() =>
			{

				if (this._deferredTask === task)
					this._deferredTask = null;

				this._tasks.push(task);

				this.callTasks();

			}, delay);

		}



		this._tasks.length && this.callTasks();


		return task.promise;


	}



	cancelDeferred(deferredKey?: string): boolean
	{

		if (!this._deferredTask)
			return false;


		if (deferredKey !== undefined && deferredKey !== this._deferredTask.deferredKey)
			return false;


		clearTimeout(this._deferredTask.timer);

		this._deferredTask = null;

		return true;
	}



	//---



	private createTask<T>(action: () => T | Promise<T>)
	{

		let task: Partial<TaskInfo> = { id: this._taskTotalCount++, action };


		task.promise = new Promise<T>((resolve, reject) =>
		{
			task.resolve = resolve;
			task.reject = reject;
			//task.resolve = a => { $log(`[${task.id}] task.resolve`); resolve(a); };
			//task.reject = a => { $log(`[${task.id}] task.reject`); reject(a); };

		});


		return task as TaskInfo;

	}



	//---



	private _isCallingTasks?: boolean;
	//private _callCount = 0;



	private async callTasks()
	{

		if (this._isCallingTasks)
			return;


		//let callId = this._callCount++;


		//$logb(`${callId}> callTasks()`);


		this._isCallingTasks = true;

		let waitingCloser: undefined | null | (() => void) = null;

		let tasks = this._tasks;


		try
		{

			let task = tasks.shift();


			while (task)
			{

				if (!waitingCloser && tasks.length)
				{
					waitingCloser = this.onWaiting?.();
				}


				try
				{
					let result = await task.action();

					task.resolve(result);
				}
				catch (ex)
				{
					task.reject(ex);
				}


				task = tasks.shift();

			}

		}

		catch (ex2)
		{
			ex2 && $log.error(ex2);
		}

		finally
		{
			this._isCallingTasks = false;
			waitingCloser!?.();
			//waitingCloser && window.setTimeout(waitingCloser, 1000);

		}



		if (this._tasks.length)
		{
			this.callTasks();
		}



		//$loge(`${callId}> callTasks()`);


		//function $logTask(msg: any, task: TaskInfo)
		//{
		//	$log(`${callId}> [${task.id}]`, msg, task.action);
		//}

	}



	//---

}