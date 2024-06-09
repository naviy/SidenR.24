declare @earthRegions nvarchar(max);
set @earthRegions = (
select *
  from _EarthRegions
  for json path	
);

declare @countries nvarchar(max);
set @countries = (
select
	Iso2
	,iso3
	,isoN
	,fips
	,cia
	,vehicle
	,Continents
	,[names.en] = names_en
	,[names.ru] = names_ru
	,[names.ua] = names_ua
	,[capital.en] = Capital_en
	,[wikilink.en] = Wikilink_en
	,[wikilink.ru] = Wikilink_ru
	,[wikilink.ua] = Wikilink_ua
  from _Countries
  for json path--root('countries')
);


declare @json nvarchar(max);
set @json = '{ earthRegions: ' + @earthRegions + ', countries: ' + @countries + '}';

select @json