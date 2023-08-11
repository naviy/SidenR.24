import { Constructor, Focuser } from '@libs';
import { RefObject, useRef } from 'react';
import { TentaPhaser } from './TentaPhaser';
import { TentaStatuser } from './TentaStatuser';






//===






export interface TentaFocusable
{

	ffRef: RefObject<Focuser>;
	ff: Focuser | null;

	focused: boolean;

	focus(): Promise<Focuser | null>;
	unfocus(): void;
	scrollIntoView(): Promise<boolean>;

}






export function TentaFocusable<TBase extends Constructor<TentaStatuser & TentaPhaser>>(Base: TBase) 
{
	return class TentaFocusableClass extends Base
		implements TentaFocusable, Focuser.Listener
	{

		//---



		ffRef!: RefObject<Focuser>;
		get ff(): Focuser | null { return this.ffRef.current; }

		get focused() { return !!this.ff?.isFocused; }



		async focus(): Promise<Focuser | null>
		{
			return this.ff && await this.ff.focusIfCan();
		}


		unfocus()
		{
			this.ff?.unfocus();
		}


		async scrollIntoView(): Promise<boolean>
		{

			let { ff } = this;

			if (!ff)
				return false;

			if (this.opened)
				return await ff.scrollIntoViewTop({ topOffset: 0 });


			return await ff.scrollIntoView();

		}

		//async focusItems()
		//{

		//	return this.itemsFF.current && await this.itemsFF.current.focusLastItemOrFirst();
		//}


		async shake()
		{
			await this.ff?.caret?.shake();
		}



		//---



		protected onLeftClick?(): Promise<void | boolean>;
		protected onRightClick?(): Promise<void | boolean>;

		protected async onEnter?(): Promise<void | boolean>;
		protected async onExit?(): Promise<void | boolean>;

		protected onLeftKey?(): Promise<void | boolean>;
		protected onRightKey?(): Promise<void | boolean>;



		//---



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



		//async ff_onKeyDown(ff: Focuser, e: KeyboardEvent)
		//{

		//	if (this.disabled)
		//		return true;


		//	if (e.ctrlKey || e.altKey || e.shiftKey)
		//		return false;


		//	if (e.key === Key.Delete)
		//	{
		//		if (await this.onDeleteKey() !== false)
		//		{
		//			e.stopPropagation();
		//			return true;
		//		}
		//	}


		//	return false;

		//}



		//---

	};
}






export module TentaFocusable
{


	export interface UseConfig
	{
	}


	export function use(me: TentaFocusable, cfg?: UseConfig)
	{
		me.ffRef = useRef<Focuser>(null);
	}


}