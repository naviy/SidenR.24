export function scrollIntoView(
	el: HTMLElement,
	container: HTMLElement,
	cfg?: scrollIntoView.Options
): boolean
{

	if (!container)
		return false;


	let topOffset = cfg?.topOffset ?? scrollIntoView.yOffset;


	let pos = el.getBoundingClientRect();
	let cpos = container.getBoundingClientRect();


	let top: number;

	//$log("pos.top:", pos.top);
	//$log("topOffset:", topOffset);
	//$log("cpos.top:", cpos.top);

	if (-cpos.top + pos.top - topOffset < 0)
	{
		top = container.scrollTop - cpos.top + pos.top - topOffset;
		//$log("top:", top);
	}

	else if (-cpos.bottom + pos.bottom + topOffset > 0)
	{
		let top1 = container.scrollTop - container.clientHeight + pos.bottom + topOffset;

		let top2 = container.scrollTop - cpos.top + pos.top - topOffset;

		//$log("top1:", top1);
		//$log("top2:", top2);
		top = Math.min(top1, top2);
	}
	else
	{
		return false;
	}


	if (Math.abs(top - container.scrollTop) <= 1)
	{
		return false;
	}

	//$log("top:", top);


	scrollToTop(container, top);


	return true;

}




export module scrollIntoView
{



	export var yOffset = 150;
	export var topOffset = 50;


	export interface Options
	{
		topOffset?: number;
	}



	export function toTop(
		el: HTMLElement,
		container: HTMLElement,
		cfg?: scrollIntoView.Options
	): boolean
	{

		let topOffset = cfg?.topOffset ?? scrollIntoView.topOffset;

		let pos = el.getBoundingClientRect();
		let cpos = container.getBoundingClientRect();

		let top = container.scrollTop - cpos.top + pos.top - topOffset;
		//$log("top:", top);
		//$log("scrollTop:", container.scrollTop)


		if (Math.abs(top - container.scrollTop) <= 1)
			return false;


		//$log("container.scrollHeight:", container.scrollHeight);
		//$log("el.clientHeight:", el.clientHeight);
		top = Math.min(top, container.scrollHeight - el.clientHeight);
		//$log("top:", top);

		container.scrollTo({ top, behavior: "smooth" });


		return true;

	}


}






//===






export function vScroll(
	scroller: HTMLElement | null | undefined,
	dir: -1 | 1
)
{
	scroller?.scrollBy({
		top: dir * scroller.offsetHeight / 10,
		behavior: "smooth",
	});
}



export function scrollToTop(container: Element, top: number)
{
	container.scrollTo({ top, behavior: "smooth" });
}