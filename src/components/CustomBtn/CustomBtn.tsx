import CustomBtnStyle from "./CustomBtnStyle";
import type { CustomBtnProps } from "../../types/CustomBtnProps";

const CustomBtn: React.FC<CustomBtnProps> = ({
	text,
	onClick,
	disabled = false,
}: CustomBtnProps) => {
	return (
		<button
			className={`${CustomBtnStyle.button} ${
				disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
			}`}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
};

export default CustomBtn;
