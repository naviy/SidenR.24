export module mui3
{



	//---



	export type BoxShadow = 0 | 1 | 2 | 3 | 4 | 5;

	export const BoxShadow = [
		'none',
		'0 1px 4px 0 rgba(0, 0, 0, 0.37)',
		'0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.3)',
		'0 11px 7px 0 rgba(0, 0, 0, 0.19), 0 13px 25px 0 rgba(0, 0, 0, 0.3)',
		'0 14px 12px 0 rgba(0, 0, 0, 0.17), 0 20px 40px 0 rgba(0, 0, 0, 0.3)',
		'0 17px 17px 0 rgba(0, 0, 0, 0.15), 0 27px 55px 0 rgba(0, 0, 0, 0.3)',
	];

	
	export const Elevation = [{
		background: 'rgba(0,0,0,.2)',
		boxShadow: BoxShadow[0],
	}, {
		background: 'rgba(0,0,0,.27)',
		boxShadow: BoxShadow[1],
	}, {
		background: 'rgba(0,0,0,.44)',
		boxShadow: BoxShadow[2],
	}, {
		background: 'rgba(0,0,0,.397)',
		boxShadow: BoxShadow[3],
	}, {
		background: 'rgba(0,0,0,.39)',
		boxShadow: BoxShadow[4],
	}, {
		background: 'rgba(0,0,0,.37)',
		boxShadow: BoxShadow[5],
	}];



	//---



}