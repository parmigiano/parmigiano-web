import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { basicAuthCreate } from '@/rest/authAPI';
import { GUInput } from '@/components/ui/Input/GUInput';
import GUIButton from '@/components/ui/Button/GUIButton';
import InputPassword from '@/components/ui/Input/InputPassword';
import { ROUTES } from '@/constants/constants';
import type { AuthCreateRequest } from '@/interface/auth/authCreateRequest.interface';

interface AuthStepRegisterProps {
	email: string;
	onBack: () => void;
}

const AuthStepRegister: React.FC<AuthStepRegisterProps> = ({ email, onBack }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [step, setStep] = useState<1 | 2>(1);
	const {
		register,
		trigger,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthCreateRequest>({
		mode: 'onChange',
		defaultValues: { email, name: '', username: '', password: '' },
	});

	const handleFirstStep = async () => {
		if (await trigger(['name', 'username'])) setStep(2);
	};

	const onSubmit = async (data: AuthCreateRequest) => {
		const payload = data.password?.length ? data : { email, name: data.name, username: data.username };
		await basicAuthCreate(payload);
		navigate(ROUTES.CHAT, { replace: true });
	};

	const submitWithoutPassword = async () => {
		setValue('password', '');
		await handleSubmit(onSubmit)();
	};

	return (
		<form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
			<div className="space-y-2 text-center">
				<p className="text-[1.55rem] font-semibold">{t('message.create-account-parmigiano')}</p>
				<p className="text-sm leading-6 text-[#8b9bad]">{t('message.create-account-desc')}</p>
			</div>

			{step === 1 ? (
				<>
					<div className="space-y-3">
						<GUInput
							autoFocus
							placeholder={t('label.name')}
							{...register('name', {
								required: t('message.validation-required-field'),
								minLength: { value: 2, message: t('message.validation-name-min-length') },
								maxLength: { value: 24, message: t('message.validation-name-max-length') },
							})}
							error={errors.name?.message}
						/>
						<GUInput
							placeholder={t('label.username')}
							{...register('username', {
								required: t('message.validation-required-field'),
								minLength: { value: 4, message: t('message.validation-username-min-length') },
								maxLength: { value: 24, message: t('message.validation-username-max-length') },
							})}
							error={errors.username?.message}
						/>
					</div>
					<GUIButton type="button" className="!font-medium" onClick={handleFirstStep}>
						{t('label.next')}
					</GUIButton>
				</>
			) : (
				<>
					<InputPassword
						autoFocus
						autoComplete="new-password"
						placeholder={t('label.cloud-password')}
						{...register('password', {
							minLength: { value: 8, message: t('message.validation-password-min-length') },
							maxLength: { value: 16, message: t('message.validation-password-max-length') },
						})}
						error={errors.password?.message}
					/>
					<div className="space-y-2">
						<GUIButton type="submit" className="!font-medium" onClick={handleSubmit(onSubmit)}>
							{t('label.create-account')}
						</GUIButton>
						<GUIButton type="button" className="!font-normal !bg-transparent hover:!bg-[#2aabee1a]" onClick={submitWithoutPassword}>
							{t('label.skip-password')}
						</GUIButton>
					</div>
				</>
			)}

			<button type="button" onClick={step === 1 ? onBack : () => setStep(1)} className="w-full py-1 text-sm font-medium text-[#5aa7e8] hover:text-[#76b8ef]">
				{t('label.back')}
			</button>
		</form>
	);
};

export default AuthStepRegister;
