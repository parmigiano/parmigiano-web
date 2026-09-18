import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import GUIButton from '@/components/ui/Button/GUIButton';
import InputPassword from '@/components/ui/Input/InputPassword';
import { basicAuthLogin } from '@/rest/authAPI';
import { ROUTES } from '@/constants/constants';
import type { AuthLoginRequest } from '@/interface/auth/authLoginRequest.interface';

interface AuthStepPasswordProps {
	email: string;
	onBack: () => void;
}

const AuthStepPassword: React.FC<AuthStepPasswordProps> = ({ email, onBack }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthLoginRequest>({ mode: 'onChange', defaultValues: { email, password: '' } });

	const onSubmit = async (data: AuthLoginRequest) => {
		await basicAuthLogin({ email, password: data.password });
		navigate(ROUTES.CHAT, { replace: true });
	};

	return (
		<form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
			<div className="space-y-2 text-center">
				<p className="text-[1.55rem] font-semibold">{t('label.cloud-password')}</p>
				<p className="text-sm leading-6 text-[#8b9bad]">{t('message.cloud-password-required')}</p>
			</div>

			<InputPassword
				autoFocus
				autoComplete="current-password"
				placeholder={t('label.cloud-password')}
				{...register('password', {
					required: t('message.validation-required-field'),
					minLength: { value: 8, message: t('message.validation-password-min-length') },
					maxLength: { value: 16, message: t('message.validation-password-max-length') },
				})}
				error={errors.password?.message}
			/>

			<div className="space-y-2">
				<GUIButton type="submit" className="!font-medium" onClick={handleSubmit(onSubmit)}>
					{t('label.sign-in')}
				</GUIButton>
				<button type="button" onClick={onBack} className="w-full py-2 text-sm font-medium text-[#5aa7e8] hover:text-[#76b8ef]">
					{t('label.back')}
				</button>
			</div>
		</form>
	);
};

export default AuthStepPassword;
