import { useEffect, useState } from "react";
import styles from "./select.module.css";

export type SelectOption = {
	label: string;
	value: string | number;
};

type MultiSelectProps = {
	multiple: true;
	value: SelectOption[];
	onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
	multiple?: false;
	value?: SelectOption;
	onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
	options: SelectOption[];
} & (SingleSelectProps | MultiSelectProps);

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const [highlightedIndex, setHighLightedIndex] = useState(0);

	useEffect(() => {
		if (isOpen) {
			setHighLightedIndex(0);
		}
	}, [isOpen]);

	function clearOptions() {
		multiple ? onChange([]) : onChange(undefined);
	}

	function selectOption(option: SelectOption) {
		if (multiple) {
			if (value.includes(option)) {
				onChange(value.filter((opt) => opt !== option));
			} else {
				onChange([...value, option]);
			}
		} else {
			if (value !== option) {
				onChange(option);
			}
		}
	}

	function isOptionSelected(option: SelectOption) {
		return multiple ? value.includes(option) : option === value;
	}

	return (
		<div
			onBlur={() => setIsOpen(false)}
			onClick={() => setIsOpen((prev) => !prev)}
			tabIndex={0}
			className={styles.container}>
			<span className={styles.value}>
				{multiple
					? value.map((val) => (
							<button
								key={val.label}
								onClick={(event) => {
									event.stopPropagation();
									selectOption(val);
								}}
								className={styles["option-badge"]}>
								{val.label}
								<span className={styles["remove-btn"]}>&times;</span>
							</button>
					  ))
					: value?.label}
			</span>
			<button
				className={styles["clear-btn"]}
				onClick={(event) => {
					event.stopPropagation();
					clearOptions();
				}}>
				&times;
			</button>
			<div className={styles.divider}></div>
			<div className={styles.caret}></div>
			<ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
				{options.map((option, index) => (
					<li
						onClick={(event) => {
							event.stopPropagation();
							selectOption(option);
							setIsOpen(false);
						}}
						onMouseEnter={() => setHighLightedIndex(index)}
						key={option.value}
						className={`${styles.option} ${
							isOptionSelected(option) ? styles.selected : ""
						} ${index === highlightedIndex ? styles.highlighted : ""}`}>
						{option.label}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Select;
