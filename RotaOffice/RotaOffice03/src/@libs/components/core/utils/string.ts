export { }






declare global
{



	interface String
	{
		format(...args: any[]): string;
		toCapitalizeCase(): string;
	}




}






//===






if (!String.prototype.format)
{
	String.prototype.format = function (this: string, ...args)
	{
		return this.replace(
			/{(\d+)}/g,
			(match, number) => args[number] !== undefined ? args[number] : match
		);
	};
}



if (!String.prototype.toCapitalizeCase)
{
	String.prototype.toCapitalizeCase = function (this: string)
	{
		return (
			this.length === 0 ? this :
				this.length === 1 ? this.toUpperCase() :
					this[0].toUpperCase() + this.substring(1)
		);
	};
}
