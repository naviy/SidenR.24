select 
	a.*,
	Continents = b.ContinentFlags,
	names_en = n.en,
	names_ru = n.ru,
	names_ua = n.ua,
	Capital_en = cp.capital,
	Wikilink_en = d.wikipedia_link,
	Wikilink_ru = dr.wikilink,
	Wikilink_ua = du.wikilink
  into _Countries
  from iso1 a
    left join iso2 b on b.iso2 = a.iso2
	left join names4 n on n.iso2 = a.iso2
	left join oa_countries d on d.code = a.iso2
    left join iso00ru dr on dr.iso2 = a.iso2
    left join iso00ua du on du.iso2 = a.iso2
	left join (
		select iso2, capital = string_agg(capital, char(13))
		  from (
			select iso2 = cast(iso_2 as char(2)), capital = trim(capital) from iso01
			union
			select iso2, trim(capital) from iso04 
		  ) q
		 where iso2 is not null and capital is not null 
		 group by iso2
	) cp on cp.iso2 = a.iso2