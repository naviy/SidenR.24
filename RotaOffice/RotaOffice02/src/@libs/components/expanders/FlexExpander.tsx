import { styled } from "@mui/material/styles";
import { Div, UseHookProps, Values, createPrimitive, useNew, type DivProps } from "../core";
import { ExpanderBehavior, ExpanderProps } from "./ExpanderBehavior";
import { FlexExpanderBehavior } from "./FlexExpanderBehavior";






//===






export function FlexExpander(props: FlexExpander.Props & DivProps)
{

	props = UseHookProps.use(props);

	let bhv = useNew(FlexExpanderBehavior).use(null, props.l || 1, props);


	let body = bhv.childrenShouldBeRendered && Values.one(props.children);


	body = createPrimitive(
		FlexExpander.Root,
		{
			ref: bhv.ref,

			timeout: bhv.timeout,
			onTransitionEnd: bhv.onTransitionEnd,

			children: body,
		},
		props,
		FlexExpander.propNames
	);



	return body;

}






export module FlexExpander
{


	//---



	export const Behavior = ExpanderBehavior;


	export interface Props extends ExpanderProps, UseHookProps<Props> 
	{
		l?: number;
	}


	export const propNames: PropNames<Props> =
	{
		l: true,
		...ExpanderProps.propNames,
		...UseHookProps.propNames,
	};



	//---



	export const Root = styled(
		Div,
		{ shouldForwardProp: p => p !== "timeout", }
	)<{
		timeout: number;
	}>(
		({ timeout }) =>
		{

			return ({

				position: "relative",
				display: "inherit",
				flexDirection: "inherit",
				gap: "inherit",

				willChange: "flex",

				transition: `all ease-in-out ${timeout}ms, background ${timeout}ms linear, opacity ${timeout}ms linear !important`,

			});
		}
	);



	//---


}