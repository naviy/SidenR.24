import { Keys, type Constructor, type Focuser } from "@libs";
import { createRef, type RefObject } from "react";
import type { TentaBase } from "./TentaBase";






//===






export interface TentaFocusable extends TentaBase
{

	ffRef: RefObject<Focuser>;
	ff: Focuser | null;

	focused: boolean;

	focus(): Promise<Focuser | null>;
	unfocus(): void;

}






export function TentaFocusable<TBase extends Constructor<TentaBase & {}>>(Base: TBase) 
{
	return class TentaFocusableClass extends Base
		implements TentaFocusable, Focuser.Listener
	{

		//---



		ffRef = createRef<Focuser>();
		get ff(): Focuser | null { return this.ffRef.current; }


		get focused() { return !!this.ff?.isFocused; }



		//---



		override async focus(): Promise<Focuser | null>
		{
			return this.ff && await this.ff.focusIfCan();
		}


		unfocus()
		{
			this.ff?.unfocus();
		}



		//async focusItems()
		//{

		//	return this.itemsFF.current && await this.itemsFF.current.focusLastItemOrFirst();
		//}


		async shake(mode?: 1 | 2 | 3)
		{
			await this.ff?.caret?.shake(mode);
		}



		//---



		protected onLeftClick?(): Promise<void | boolean> | void;
		protected onRightClick?(): Promise<void | boolean> | void;

		protected onEnter?(): Promise<void | boolean> | void;
		protected onExit?(): Promise<void | boolean> | void;

		protected onLeftKey?(): Promise<void | boolean> | void;
		protected onRightKey?(): Promise<void | boolean> | void;

		protected onSpaceKey?(): Promise<void | boolean> | void;


		protected onCtrlLeftKey?(): Promise<void | boolean> | void;
		protected onCtrlRightKey?(): Promise<void | boolean> | void;
		protected onCtrlUpKey?(): Promise<void | boolean> | void;
		protected onCtrlDownKey?(): Promise<void | boolean> | void;



		//---



		ff_onFocus(ff: Focuser)
		{
			this.setGlobalProp("focused", ff.isFocused, false)
		}



		ff_onUnfocus(ff: Focuser)
		{
			this.setGlobalProp("focused", ff.isFocused, false)
		}



		async ff_onClick(ff: Focuser, e: MouseEvent)
		{

			if (e.ctrlKey)
				return false;

			if (this.disabled)
				return true;


			return !!this.onLeftClick && await this.onLeftClick() !== false;

		}



		async ff_onContextMenu(ff: Focuser, e: MouseEvent)
		{

			if (e.ctrlKey)
				return false;

			if (this.disabled)
				return true;


			e.preventDefault();
			e.stopPropagation();


			return !!this.onRightClick && await this.onRightClick() !== false;

		}



		async ff_onEnter()
		{
			return !!this.onEnter && await this.onEnter() !== false;
		}


		async ff_onExit()
		{
			return !!this.onExit && await this.onExit() !== false;
		}


		async ff_onFocusLeft(ff: Focuser, e: KeyboardEvent)
		{

			if (e.ctrlKey)
				return false;


			if (this.disabled)
				return true;


			return !!this.onLeftKey && await this.onLeftKey() !== false;

		}



		async ff_onFocusRight(ff: Focuser, e: KeyboardEvent)
		{

			if (e.ctrlKey)
				return false;


			if (this.disabled)
				return true;


			return !!this.onRightKey && await this.onRightKey() !== false;

		}



		async ff_onKeyDown(ff: Focuser, e: KeyboardEvent)
		{

			if (this.disabled)
				return true;


			if (e.altKey || e.shiftKey)
				return false;


			if (e.ctrlKey)
			{

				if (e.key === Keys.ArrowLeft && this.onCtrlLeftKey && await this.onCtrlLeftKey() !== false)
				{
					e.stopPropagation();
					return true;
				}


				if (e.key === Keys.ArrowRight && this.onCtrlRightKey && await this.onCtrlRightKey() !== false)
				{
					e.stopPropagation();
					return true;
				}


				if (e.key === Keys.ArrowUp && this.onCtrlUpKey && await this.onCtrlUpKey() !== false)
				{
					e.stopPropagation();
					return true;
				}


				if (e.key === Keys.ArrowDown && this.onCtrlDownKey && await this.onCtrlDownKey() !== false)
				{
					e.stopPropagation();
					return true;
				}


				return false;

			}


			//if (e.key === Keys.Delete)
			//{
			//	if (await this.onDeleteKey() !== false)
			//	{
			//		e.stopPropagation();
			//		return true;
			//	}
			//}


			if (e.key === Keys.Space)
			{
				if (this.onSpaceKey && await this.onSpaceKey() !== false)
				{
					e.stopPropagation();
					return true;
				}
			}


			return false;

		}



		//---

	};
}






export module TentaFocusable
{


	export interface UseConfig extends TentaBase.UseConfig
	{
	}


	export function use(me: TentaFocusable, cfg?: UseConfig)
	{

		//useEffect(() =>
		//{

		//	let focused = me.getGlobalProp("focused");

		//	$log("focused:", focused);

		//	if (!focused)
		//		return;

		//	_$log("ff:", me.ff);


		//	(async () =>
		//	{
		//		await adelay(2 * $defaultAnimationDurationMs);
		//		await me.ff?.focus();
		//	})();


		//})

	}


}