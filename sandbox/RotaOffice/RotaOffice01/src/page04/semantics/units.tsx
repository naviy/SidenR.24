import { Semantic } from "../core/semantics";
import { UnitType } from "../domain";




export const units = Semantic.create(sm => ({


	//UnitType: sm<UnitType>()({
	//	one: "Тип підрозділу"
	//}, {


	//	/** полк */
	//	Regiment: sm<UnitType.Regiment>()("Полк"),

	//	/** батальйон */
	//	Battalion: sm<UnitType.Battalion>()("Батальйон"),

	//	/** рота */
	//	Company: sm<UnitType.Company>()("Рота"),

	//	/** взвод */
	//	Platoon: sm<UnitType.Platoon>()("Взвод"),

	//	/** відділення */
	//	Squad: sm<UnitType.Squad>()("Відділення"),


	//}),


	UnitType: sm.enums(UnitType, "Тип підрозділу", sm => ({


		/** корпус */
		Corps: sm(UnitType.Corps, "Корпус", { icon: <b>XXX</b> }),

		/** дивізія */
		Division: sm(UnitType.Division, "Дивізія", { icon: <b>XX</b> }),

		/** бригада */
		Brigade: sm(UnitType.Brigade, "Бригада", { icon: <b>X</b> }),

		/** полк */
		Regiment: sm(UnitType.Regiment, "Полк", { icon: <b>III</b> }),

		/** батальйон */
		Battalion: sm(UnitType.Battalion, "Батальйон", { icon: <b>II</b> }),

		/** рота */
		Company: sm(UnitType.Company, "Рота", { icon: <b>I</b> }),

		/** взвод */
		Platoon: sm(UnitType.Platoon, "Взвод", { icon: <b>&#x2022;&#x2022;&#x2022;</b> }),

		/** відділення */
		Squad: sm(UnitType.Squad, "Відділення", { icon: <b>&#x2022;</b> }),


	})),


}));
