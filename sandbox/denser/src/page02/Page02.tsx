import { $logm, Focuser, Pane, useForceUpdateAsync, useNew } from '@libs';
import { RefObject, useEffect, useRef, useState } from 'react';
import { Repaintable, RepaintableAsync } from './Repaintable';



export function Page02()
{




	return <>

		<Pane.Col mx48 m100 rounded e={0} p2 gap1>

			<Row03 start />
			<Row03 />
			<Row03 />

			<Row04 />
			<Row04 />
			<Row04 />
			<Row04 end />

		</Pane.Col>

	</>;

}



function Row03(props: Pane.RowProps)
{

	return <PileRow {...props}>

		<Pane l={300} p24>111 1111 11111 111111</Pane>
		<Pane p24>222 2222 22222 222222</Pane>
		<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>

	</PileRow>;

}


function Row04(props: Pane.RowProps)
{

	return <PileRow {...props}>

		<Pane.Col gapi>

			<Pane.Row>
				<Pane p24>111 1111 11111 111111</Pane>
				<Pane p24>222 2222 22222 222222</Pane>
				<Pane p24 textRight>333 3333 33333 333333</Pane>
			</Pane.Row>

			<Pane.Row gapi>
				<Pane p24 l={180}>111 1111 11111 111111</Pane>
				<Pane p24 l={180}>222 2222 22222 222222</Pane>
				<Pane p24 l={180} textRight>333 3333 33333 333333</Pane>
			</Pane.Row>

		</Pane.Col>

		<Pane.Row gapi l={2}>
			<Pane.Col gapi l={150}>
				<Pane p8 center vcenter>aaa aaa aaaa</Pane>
				<Pane p8 center vcenter>bbb bbb bbbb</Pane>
				<Pane p8 center vcenter>ccc ccc cccc</Pane>
			</Pane.Col>
			<Pane p24 vcenter>222 2222 22222 222222</Pane>
			<Pane p24 textRight vcenter>333 3333 33333 333333</Pane>
		</Pane.Row>

	</PileRow>;

}



//---



function PileRow(props: Pane.RowProps)
{

	let bhv = useNew(PileItemBehavior).use();

	return (

		<Focuser
			ref={bhv.ffRef}
			padding={bhv.collapsed ? -2 : 0}
			listener={bhv}
		>

			<Pane.Row
				{...props}
				gap1
				{...!bhv.collapsed && { rounded: true, p: 2, e: 3, mx: -24, my: 24 }}
				cursorPointer
			>

				<Focuser.Caret />
				{props.children}

			</Pane.Row>


		</Focuser>
	);

}



//---



export class PileItemBehavior extends RepaintableAsync()
{

	//---



	use(cfg?: Repaintable.UseConfig & {
		defaultPhase?: number;
	})
	{

		Repaintable.use(this, cfg);

		this.ffRef = useRef<Focuser>(null);

		this.phase = this.phase ?? cfg?.defaultPhase ?? 0;


		return this;

	}



	//---



	disabled = false;



	//---



	phase!: number;
	expandedPhase: number = 1;
	openedPhase: number = 2;
	maxPhase: number = 2;

	defaultPhase?: number;

	get collapsed() { return !this.phase; }
	get expanded() { return this.phase >= this.expandedPhase && this.phase < this.openedPhase; }
	get opened() { return this.phase >= this.openedPhase; }


	canCollapse() { return this.phase > 0; }

	canExpand() { return this.phase < this.maxPhase; }


	//phaseWasManualChanged?: boolean;
	onPhaseChanged?: (tenta: this) => void;



	//---



	async setPhase(value: number/*, manual = true*/): Promise<boolean>
	{

		let { phase } = this;


		if (phase === value || this.disabled)
			return false;

		if (value == null || value < 0 || value > this.maxPhase)
			return false;


		this.phase = value;
		//this.phaseWasManualChanged = manual;


		await this.phaseChanged();


		return true;

	}



	protected async phaseChanged()
	{

		this.onPhaseChanged?.(this);

		await this.repaint();

		//this.prior?.repaintListRow?.();
		//this.next?.repaintListRow?.();

	}



	priorPhase(canSkipPhase?: (phase: number, bhv: this) => boolean): number
	{

		let { phase } = this;


		if (this.disabled || phase <= 0)
		{
			return phase;
		}


		do
		{
			phase--;
		}
		while (
			phase >= 0 && canSkipPhase?.(phase, this)
		)


		return phase;

	}



	nextPhase(canSkipPhase?: (phase: number, bhv: this) => boolean): number
	{

		let { phase, maxPhase } = this;


		if (this.disabled || phase >= maxPhase)
		{
			return phase;
		}


		do
		{
			phase++;
		}
		while (
			phase <= maxPhase && canSkipPhase?.(phase, this)
		)


		return phase;

	}



	async collapse(canSkipPhase?: (phase: number, bhv: this) => boolean): Promise<boolean>
	{
		return await this.setPhase(this.priorPhase(canSkipPhase));
	}

	async expand(canSkipPhase?: (phase: number, bhv: this) => boolean): Promise<boolean>
	{
		return await this.setPhase(this.nextPhase(canSkipPhase));
	}



	//---



	ffRef!: RefObject<Focuser>;
	get ff(): Focuser | null { return this.ffRef.current; }

	get focused() { return !!this.ff?.isFocused; }



	focus = async (): Promise<Focuser | null> =>
	{
		return this.ff && await this.ff.focusIfCan();
	}


	unfocus()
	{
		this.ff?.unfocus();
	}


	async scrollIntoView()
	{
		let { ff } = this;

		if (!ff)
			return false;

		if (this.opened)
			return await ff.scrollIntoViewTop();


		return await ff.scrollIntoView();

	}

	//async focusItems()
	//{

	//	return this.itemsFF.current && await this.itemsFF.current.focusLastItemOrFirst();
	//}



	//---



	protected async onLeftClick()
	{

		if (!this.focused)
		{
			await this.focus();
		}

		else if (await this.expand())
		{
			await this.scrollIntoView();
		}


		return true;

	}


	protected async onRightClick()
	{

		if (!this.focused)
		{
			await this.focus();
		}
		else if (await this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocus();
		}


		return true;

	}



	async onEnter()
	{
		if (await this.expand())
		{
			await this.scrollIntoView();
		}
		else
		{
			//	await this.focusItems();
		}
	}


	async onExit()
	{
		if (await this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocus();
		}
	}



	protected async onLeftKey()
	{

		if (await this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			//await this.backToParent();
		}

	}



	protected async onRightKey()
	{

		this.expand();


		if (this.opened /*&& await this.focusItems()*/)
		{
			await this.scrollIntoView();
		}

	}



	//---



	async ff_onClick(ff: Focuser, e: MouseEvent)
	{

		if (e.ctrlKey)
			return false;

		if (this.disabled)
			return true;


		return await this.onLeftClick();

	}



	async ff_onContextMenu(ff: Focuser, e: MouseEvent)
	{

		if (e.ctrlKey)
			return false;

		if (this.disabled)
			return true;


		e.preventDefault();
		e.stopPropagation();


		return await this.onRightClick();

	}



	async ff_onEnter()
	{
		await this.onEnter()
	}


	async ff_onExit()
	{
		await this.onExit()
	}


	async ff_onFocusLeft(ff: Focuser, e: KeyboardEvent)
	{

		if (e.ctrlKey)
			return false;


		if (this.disabled)
			return true;


		await this.onLeftKey();

		return true;

	}



	async ff_onFocusRight(ff: Focuser, e: KeyboardEvent)
	{

		if (e.ctrlKey)
			return false;


		if (this.disabled)
			return true;


		await this.onRightKey();

		return true;

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






	//---



	//---

}

