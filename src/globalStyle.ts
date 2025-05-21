const globalStyle = {
	span: "text-primary",
	spanAlert: "text-red-custom",
	row: "flex flex-row items-center",
	separator: "w-30 h-1 bg-primary rounded-md mb-4",
	cardContainer: "flex flex-col md:grid md:grid-cols-2 gap-4",
	littleText: "text-[18px]",
	NormalText: "text-[22px]",
	BigText: "text-[26px]",
	footer: "mt-auto py-4",
};

export const getSizeTextStyle = (size: number): string => {
	switch (size) {
		case 18:
			return globalStyle.littleText;
		case 22:
			return globalStyle.NormalText;
		case 26:
			return globalStyle.BigText;
		default:
			return globalStyle.NormalText;
	}
};

export const createLazyStyles = (styles: Record<string, string>) => {
	return styles;
};

export default globalStyle;
