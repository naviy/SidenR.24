import { PaneBorder } from "./PaneBorder";





//===






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

		let rr = typeof r === "number" ? r : px[r] || 0;


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


	export function css2(
		r: {
			rtl: PaneRadius, rtr: PaneRadius, rbr: PaneRadius, rbl: PaneRadius,
			bt: PaneBorder, br: PaneBorder, bb: PaneBorder, bl: PaneBorder,
		},
		cfg?: ConvertConfig
	)
	{

		var btPx = PaneBorder.width(r.bt) || 0;
		var brPx = PaneBorder.width(r.br) || 0;
		var bbPx = PaneBorder.width(r.bb) || 0;
		var blPx = PaneBorder.width(r.bl) || 0;

		var rtlPx = toPx(r.rtl, cfg) + Math.max(btPx, blPx);
		var rtrPx = toPx(r.rtr, cfg) + Math.max(btPx, brPx);
		var rbrPx = toPx(r.rbr, cfg) + Math.max(bbPx, brPx);
		var rblPx = toPx(r.rbl, cfg) + Math.max(bbPx, blPx);


		return `${rtlPx}px ${rtrPx}px ${rbrPx}px ${rblPx}px`;

	}



}