const globalStyle = {
	span: 'text-primary',
	spanAlert: 'text-red-custom',
	row: 'flex flex-row items-center',
	separator: 'w-30 h-1 bg-primary rounded-md mb-4',
	cardContainer: 'flex flex-col md:grid md:grid-cols-2 gap-4',
	littleText: 'text-[20px]',
	NormalText: 'text-[26px]',
	BigText: 'text-[30px]',
};


export const getSizeTextStyle = (size: number): string => {
	switch (size) {
		case 20:
			return globalStyle.littleText;
		case 26:
			return globalStyle.NormalText;
		case 30:
			return globalStyle.BigText;
		default:
			return globalStyle.NormalText;
	}
};

export default globalStyle;
