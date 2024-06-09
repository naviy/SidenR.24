select 
	en.*,
	ru.ru,
	ua.ua
  into names4
  from 
    (
		select iso2, en = string_agg(en, char(13)) 
		  from (
			select distinct iso2, en = trim(name)
			  from (
				select n.iso2, en.value as name
				  from names3 n
					CROSS APPLY OPENJSON(n.en) AS en
				union
				select iso2, name1 from names1
				union
				select iso2, name2 from names1
				union
				select iso2, name3 from names1
				union
				select iso2, name4 from names1
				union
				select iso2, name6 from names1
				union
				select iso2, name7 from names1
				union
				select n1.iso2, trim(n.value)
				  from names1 n1
					cross apply string_split(names5, ';') n
				) q
				where name is not null
			) q
		group by iso2
	) en
	left join (
		select 
			iso2,
			ru = string_agg(name, char(13))
		  from (
			select distinct
				iso2 = cast(iso2 as char(2)),
				name = replace(replace(trim(name), ' ', ''), ' ', '')
			  from (
				select n.iso2, en.value as name
					from names3 n
					CROSS APPLY OPENJSON(n.ru) AS en
				union
				select iso2, trim(value)
				  from iso00ru
					cross apply string_split(name, ';')
				union
				select iso2, name  from iso01ru
				union
				select iso2, ru  from iso02ru
				union
				select iso2, name  from iso03ru
			) q
		) q
		 group by iso2
	) ru on ru.iso2 = en.iso2
	left join (
		select 
			iso2,
			ua = string_agg(name, char(13))
		  from (
			select distinct
				iso2 = cast(iso2 as char(2)),
				name = replace(replace(trim(name), ' ', ''), ' ', '')
			  from (
				select n.iso2, en.value as name
					from names3 n
					CROSS APPLY OPENJSON(n.ua) AS en
				union
				select iso2, trim(value)
				  from iso00ua
					cross apply string_split(name, ';')
				union
				select iso2, name  from iso01ua
				--union
				--select iso2, ru  from iso02ru
				--union
				--select iso2, name  from iso03ru
			) q
		) q
		 group by iso2
	) ua on ua.iso2 = en.iso2


