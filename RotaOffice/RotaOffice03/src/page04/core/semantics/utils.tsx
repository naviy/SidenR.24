export function noun(
	num: number | null | undefined,
	one: string | null | undefined,
	two: string | null | undefined,
	five: string | null | undefined
)
{

	if (num == null)
		return null;


	if (!five)
		return num > 1 ? two : one;


	if (num % 10 === 1 && num % 100 !== 11)
	{
		return one;
	}


	if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20))
	{
		return two;
	}


	return five;

}



export function verb(
	num: number | null | undefined,
	one: string | null | undefined,
	two: string | null | undefined,
	five: string | null | undefined
) 
{

	if (num == null)
		return null;


	if (num > 1000000)
	{
		return five;
	}


	if (num > 1000 && num < 1000000 && num % 1000 === 0)
	{
		num /= 1000;
	}


	if (num % 10 === 1 && num % 100 !== 11 || num % 10000 === 1000)
	{
		return one;
	}

	else if (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20))
	{
		return two;
	}

	else
	{
		return five;
	}

}
