export type PaneRadius = "" | "xs" | "sm" | "md" | "lg" | "xl" | number;




export module PaneRadius
{


	const px: Partial<Record<PaneRadius, number>> = {
		"xs": 3,
		"sm": 6,
		"md": 9,
		"lg": 12,
		"xl": 24,
	}


	interface ConvertConfig
	{
		add?: number | null;
		min?: number | null;
	}


	export function toPx(r: PaneRadius, cfg?: ConvertConfig): number
	{

		let rr = typeof r === "number" ? r : (px as any)[r] || 0;


		if (!cfg)
			return rr;


		if (cfg.add)
			rr += cfg.add;

		if (cfg.min != undefined && rr < cfg.min)
			rr = cfg.min;

		return rr;

	}


	export function css(rtl: PaneRadius, rtr: PaneRadius, rbr: PaneRadius, rbl: PaneRadius, cfg?: ConvertConfig)
	{
		return `${toPx(rtl, cfg)}px ${toPx(rtr, cfg)}px ${toPx(rbr, cfg)}px ${toPx(rbl, cfg)}px`;
	}


}