import { UnitType } from "../domain";
import { db } from "./_db";






//===






db.today = "2022-02-22";






/** 50П */
export var R50 = db.Unit.add(
	null,
	UnitType.Regiment,
	["50П", "50 полк", "50 полк НГУ"],
	["50П", "50 полку", "50 полку НГУ"],
);





/** 1СБ 50П */
export var R50_RB1 = db.Unit.add(

	R50,
	UnitType.Battalion,

	[
		"1СБ",
		"1 стрілецький батальон",
		"1 стрілецький батальон (з охорони та оборони важливих державний об'єктів)",
	],

	[
		"1СБ",
		"1 стрілецького батальону",
		"1 стрілецького батальону (з охорони та оборони важливих державний об'єктів)",
	],

);



/** 2СВ 1СБ 50П */
export var R50_RB1_RP2 = db.Unit.add(
	R50_RB1,
	UnitType.Platoon,

	[
		"2СВ",
		"2 стрілецький взвод",
		"2 стрілецький взвод (з охорони та оборони важливих державний об'єктів)"
	],

	[
		"2СВ",
		"2 стрілецького взводу",
		"2 стрілецького взводу (з охорони та оборони важливих державний об'єктів)"
	],
);


/** 1 відд. 2СВ 1СБ 50П */
export var R50_RB1_RP2_S1 = db.Unit.add(
	R50_RB1_RP2,
	UnitType.Squad,
	["1 відд.", "1 відділення", "1 відділення"],
	["1 відд.", "1 відділення", "1 відділення"],
);


/** 2 відд. 2СВ 1СБ 50П */
export var R50_RB1_RP2_S2 = db.Unit.add(
	R50_RB1_RP2,
	UnitType.Squad,
	["2 відд.", "2 відділення", "2 відділення"],
	["2 відд.", "2 відділення", "2 відділення"],
);


/** 3 відд. 2СВ 1СБ 50П */
export var R50_RB1_RP2_S3 = db.Unit.add(
	R50_RB1_RP2,
	UnitType.Squad,
	["3 відд.", "3 відділення", "3 відділення"],
	["3 відд.", "3 відділення", "3 відділення"],
);






//===






db.today = "2023-01-01";






db.Unit_Name.add(
	R50_RB1_RP2,
	[
		"СВ ООВДО №66",
		"стрілецький взвод з ООВДО №66",
		"стрілецький взвод з охорони та оборони важливого державного об'єкту №66"
	],
	[
		"СВ ООВДО №66",
		"стрілецького взводу з ООВДО №66",
		"стрілецького взводу з охорони та оборони важливого державного об'єкту №66"
	]
)






//===






db.today = "2022-03-01";






/** БГр 50П */
export var R50_BG = db.Unit.add(

	R50,
	UnitType.Battalion,

	["БГр", "батальонна група"],
	["БГр", "батальонної групи"],

);



/** 4РГр БГр 50П */
export var R50_BG_4CG = db.Unit.add(
	R50_BG,
	UnitType.Platoon,
	["4ГРр", "4 ротна група"],
	["4ГРр", "4 ротної групи"],
);


/** 1В 4РГр БГр 50П */
export var R50_BG_4CG_P1 = db.Unit.add(
	R50_BG_4CG,
	UnitType.Platoon,
	["1В", "1 взвод"],
	["1В", "1 взводу"],
);


/** 1 відд. 1В 4РГр БГр 50П */
export var R50_BG_4CG_P1_S1 = db.Unit.add(
	R50_BG_4CG_P1,
	UnitType.Squad,
	["1 відд.", "1 відділення"],
);


/** 2 відд. 1В 4РГр БГр 50П */
export var R50_BG_4CG_P1_S2 = db.Unit.add(
	R50_BG_4CG_P1,
	UnitType.Squad,
	["2 відд.", "2 відділення"],
);


/** 3 відд. 1В 4РГр БГр 50П */
export var R50_BG_4CG_P1_S3 = db.Unit.add(
	R50_BG_4CG_P1,
	UnitType.Squad,
	["3 відд.", "3 відділення"],
);




/** 2В 4РГр БГр 50П */
export var R50_BG_4CG_P2 = db.Unit.add(
	R50_BG_4CG,
	UnitType.Platoon,
	["2В", "1 взвод"],
	["2В", "1 взводу"],
);


/** 1 відд. 2В 4РГр БГр 50П */
export var R50_BG_4CG_P2_S1 = db.Unit.add(
	R50_BG_4CG_P2,
	UnitType.Squad,
	["1 відд.", "1 відділення"],
);


/** 2 відд. 2В 4РГр БГр 50П */
export var R50_BG_4CG_P2_S2 = db.Unit.add(
	R50_BG_4CG_P2,
	UnitType.Squad,
	["2 відд.", "2 відділення"],
);


/** 3 відд. 2В 4РГр БГр 50П */
export var R50_BG_4CG_P2_S3 = db.Unit.add(
	R50_BG_4CG_P2,
	UnitType.Squad,
	["3 відд.", "3 відділення"],
);




/** 3В 4РГр БГр 50П */
export var R50_BG_4CG_P3 = db.Unit.add(
	R50_BG_4CG,
	UnitType.Platoon,
	["2В", "1 взвод"],
	["2В", "1 взводу"],
);


/** 1 відд. 2В 4РГр БГр 50П */
export var R50_BG_4CG_P3_S1 = db.Unit.add(
	R50_BG_4CG_P3,
	UnitType.Squad,
	["1 відд.", "1 відділення"],
);


/** 2 відд. 2В 4РГр БГр 50П */
export var R50_BG_4CG_P3_S2 = db.Unit.add(
	R50_BG_4CG_P3,
	UnitType.Squad,
	["2 відд.", "2 відділення"],
);


/** 3 відд. 2В 4РГр БГр 50П */
export var R50_BG_4CG_P3_S3 = db.Unit.add(
	R50_BG_4CG_P3,
	UnitType.Squad,
	["3 відд.", "3 відділення"],
);




//===






db.today = "2022-02-22";






db.Unit_Name.add(
	R50_RB1_RP2,
	[
		"СВ ООВДО №66",
		"стрілецький взвод з ООВДО №66",
		"стрілецький взвод з охорони та оборони важливого державного об'єкту №66"
	],
	[
		"СВ ООВДО №66",
		"стрілецького взводу з ООВДО №66",
		"стрілецького взводу з охорони та оборони важливого державного об'єкту №66"
	]
)