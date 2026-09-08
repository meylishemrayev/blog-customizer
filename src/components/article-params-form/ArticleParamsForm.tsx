import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from '../../constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleFormProps = {
	articleState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	onApply,
}: ArticleFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(articleState);
	const formRef = useRef<HTMLFormElement>(null);
	const asideRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const handleCloseForm = (event: MouseEvent) => {
			if (
				isFormOpen &&
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				setIsFormOpen(false);
			}
		};

		document.addEventListener('mousedown', handleCloseForm);
		return () => document.removeEventListener('mousedown', handleCloseForm);
	}, [isFormOpen]);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (isFormOpen && event.key === 'Escape') {
				setIsFormOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isFormOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsFormOpen(false);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
		setIsFormOpen(false);
	};

	const handleChange = (key: keyof ArticleStateType, value: OptionType) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<>
			<ArrowButton
				isOpen={isFormOpen}
				onClick={() => {
					setIsFormOpen((prev) => !prev);
				}}
			/>
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					ref={formRef}
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						ЗАДАЙТЕ ПАРАМЕТРЫ
					</Text>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(option) => {
							handleChange('fontFamilyOption', option);
						}}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => handleChange('fontSizeOption', option)}
					/>
					<Select
						title='Цвет текста'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(option) => handleChange('fontColor', option)}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(option) => handleChange('backgroundColor', option)}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(option) => handleChange('contentWidth', option)}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
