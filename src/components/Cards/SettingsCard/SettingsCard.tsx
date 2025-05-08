import { FaPen } from 'react-icons/fa';
import { useTranslation } from '../../../context/TranslationContext';
import globalStyle from '../../../globalStyle';
import Card, { Space } from '../../Card/Card';
import CustomBtn from '../../CustomBtn/CustomBtn';

export default function SettingsCard() {
	const { t, locale, setLocale } = useTranslation();

	return (
		<Card>
			<div className={globalStyle.row}>
				<span className={globalStyle.span}>{t('profile.settings')}</span>
			</div>
			<div className={globalStyle.separator}></div>
			<div className={globalStyle.row}>
				<p>{t('profile.pseudo')} :</p>
				<Space />
				<span className={globalStyle.span}>Pseudo</span>
				<Space />
				<button
					className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
					aria-label={t('profile.edit_pseudo')}
				>
					<FaPen size={20} color="#00babc" />
				</button>
			</div>
			<div className={globalStyle.row}>
				<p>{t('profile.email')} :</p>
				<Space />
				<span className={globalStyle.span}>blabla@gmail.com</span>
				<Space />
				<button
					className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
					aria-label={t('profile.edit_pseudo')}
				>
					<FaPen size={20} color="#00babc" />
				</button>
			</div>
			<div className={globalStyle.separator}></div>
			<p>{t('profile.password')} :</p>
			<CustomBtn text={t('profile.changePassword')} onClick={() => console.log('btn')} />
			<div className={globalStyle.separator}></div>
			<div className={globalStyle.row}>
				<p>{t('profile.language')} :</p>
				<Space />
				<div className="relative">
					<select
						className="appearance-none bg-white-custom border border-gray-300 rounded-md py-2 pl-3 pr-10 text-primary focus:outline-none focus:ring-primary focus:border-primary cursor-pointer"
						value={locale}
						onChange={(e) => setLocale(e.target.value as any)}
					>
						<option value="fr">🇫🇷 Français</option>
						<option value="en">🇬🇧 English</option>
						<option value="es">🇪🇸 Español</option>
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
						<svg
							className="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Card>
	);
}
