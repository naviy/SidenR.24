export module Scroll
{



	export var scrollIntoViewYOffset = 150;
	export var scrollIntoViewTopOffset = 50;





	export interface ScrollIntoViewOptions
	{
		topOffset?: number;
	}






	export function vScroll(scroller: HTMLElement | null | undefined, /*el: HTMLElement | null,*/ dir: -1 | 1)
	{

		//let scroller = el && el.offsetParent as HTMLElement;

		if (!scroller)
			return;


		//let overflowY = getComputedStyle(scroller).overflowY;


		//while (scroller && (overflowY !== "scroll" && overflowY !== "auto"))
		//{

		//	//$log("offsetParent:", scroller, overflowY);
		//	scroller = scroller.offsetParent as HTMLElement;

		//	if (!scroller)
		//		break;


		//	overflowY = getComputedStyle(scroller).overflowY;

		//}


		//$log("scroller:", scroller, overflowY);

		if (scroller)
		{
			scroller.scrollBy({ top: dir * scroller.offsetHeight / 10, behavior: "smooth" });
		}

	}





	//const scroller = new SmoothScroll();


	export function scrollToTop(container: Element, top: number)
	{
		container.scrollTo({ top, behavior: "smooth" });
		//scroller.animateScroll(top, container);

	}



}