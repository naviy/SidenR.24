import { Div } from "@libs";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Component, type ErrorInfo, type ReactNode } from "react";






//===






export class ErrorBoundary extends Component<{

	children: ReactNode;

}>
{

	//---


	override state = {
		error: null as Error | null,
		errorInfo: null as ErrorInfo | null,
		showStack: false,
	};


	//---


	static getDerivedStateFromError(error: Error)
	{
		return { error, errorInfo: null };
	}


	override componentDidCatch(error: Error, errorInfo: ErrorInfo)
	{
		this.setState({ error, errorInfo });
	}



	//---


	override render()
	{

		const { error, errorInfo, showStack, } = this.state;

		if (!error)
			return this.props.children;


		return (
			<Alert
				severity="error"
				action={
					<Button
						color="inherit"
						size="small"
						variant={showStack ? "contained" : "text"}
						onClick={() => this.setState({ showStack: !showStack })}
						children="STACK"
					/>
				}>

				{error.message}

				{showStack && <div>
					<br />
					<Divider textAlign="left"><b>STACK</b></Divider>
					<Div pre>{error.stack}</Div>
					<br />
					<Divider textAlign="left"><b>COMPONENT STACK</b></Divider>
					<Div pre>{errorInfo!.componentStack?.trim()}</Div>
				</div>}

			</Alert>
		);
	}



	//---

}