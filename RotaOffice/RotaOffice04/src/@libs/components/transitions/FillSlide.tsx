import { styled } from "@mui/material/styles";
import React, { type ReactNode } from "react";
import { Transition, type TransitionStatus } from "react-transition-group";
import { $defaultAnimationDurationMs, $log, Focuser } from "..";
import { type TransitionProps } from "./TransitionProps";






//===






export interface FillSlideAnimateProps
{
	vertical?: boolean;
	dir?: boolean | null;
	offset?: string | number,
}






export function FillSlide({

	vertical,
	dir,
	offset,
	//zoom,

	flex,
	fill,

	autoFocus,
	root,

	children,

	...transitionProps

}: TransitionProps & FillSlideAnimateProps & {

	timeout?: number;

	flex?: boolean;
	fill?: boolean;

	autoFocus?: boolean;
	root?: boolean;

	children?: ReactNode;

})
{

	var nodeRef = React.useRef<HTMLDivElement>(null);


	return (

		<Transition

			nodeRef={nodeRef}

			timeout={$defaultAnimationDurationMs}

			{...transitionProps as any}

		>
			{(status: TransitionStatus) =>

				<Root

					ref={nodeRef}

					active={transitionProps.in}
					status={status}
					timeout={transitionProps.timeout ?? $defaultAnimationDurationMs}

					vertical={vertical}
					dir_={dir}
					offset={offset}
					//zoom={zoom}

					flex={flex}
					fill={fill}

					children={
						<SlideFocuser
							id={transitionProps.id}
							disabled={!transitionProps.in || status !== "entered"}
							autoFocus={autoFocus}
							root={root}
						>
							<div>
								{children}
							</div>
						</SlideFocuser>
					}

				/>

			}
		</Transition>

	);

}




function SlideFocuser(props: {

	id?: string;

	disabled?: boolean;

	autoFocus?: boolean;
	root?: boolean;

	children?: ReactNode;

})
{

	var ff = Focuser.useGhost({
		name: `FillSlide${props.id ? "#" + props.id : ""}`,
		disabled: props.disabled,
		root: props.root,
	});


	React.useEffect(() =>
	{
		if (props.autoFocus && !props.disabled)
		{
			ff.focusAutoFocusItem();
		}
	});


	return (
		<Focuser.Area ff={ff}>
			{props.children}
		</Focuser.Area>
	);
}





//===






const Root = styled(
	"div",
	{
		name: "fill-slide",
		shouldForwardProp: p => (
			p !== "active" && p !== "status" && p !== "timeout" &&
			p !== "vertical" && p !== "dir_" && p !== "offset" && p !== "zoom" &&
			p !== "flex" && p !== "fill"
		),
	}
)<{

	active: boolean;
	status: TransitionStatus;
	timeout: number;

	vertical?: boolean;
	dir_?: boolean | null;
	offset?: string | number,
	//zoom?: boolean | number | null;


	flex: boolean | undefined;
	fill: boolean | undefined;

}>(
	(props) => 
	{

		let { status, timeout } = props;
		let dir = props.active ? !props.dir_ : props.dir_;

		let soffset = typeof props.offset === "number" ? props.offset + "px" : props.offset ?? "25%";


		let margin1 = (props.vertical
			? dir ? `${soffset} 0 -${soffset} 0` : `-${soffset} 0 ${soffset} 0`
			: dir ? `0 ${soffset} 0 -${soffset}` : `0 -${soffset} 0 ${soffset}`
		);


		return ({

			...props.flex &&
			{
				display: "flex",
				flex: 1,
			},

			...(props.fill || status === "exiting" || status === "exited") &&
			{
				position: "absolute",
				inset: "0 0 0 0",
			},

			padding: 1,
			margin: -1,

			//overflow: status === "entered" ? "visible" : "hidden",


			...(status === "exited" || status === "unmounted") &&
			{
				visibility: "hidden",
			},


			"> div": {

				transition: `all ${timeout}ms ease-out, opacity ${timeout}ms linear`,

				...(status === "entering" || status === "entered"
					? {
						opacity: 1,
						transform: "none",
						margin: 0,
					}
					: {
						opacity: 0,
						margin: margin1,
					}
				),

				...props.flex &&
				{
					display: "flex",
					flex: 1,
					alignItems: "center",
				},

				...(props.fill) &&
				{
					position: "absolute",
					inset: "0 0 0 0",
				},

			},

		});

	}

);
