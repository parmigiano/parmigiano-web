import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { basicAuthLogin } from '@/rest/authAPI';
import { GUInput } from '@/components/ui/Input/GUInput';
import GUIButton from '@/components/ui/Button/GUIButton';
import InputPassword from '@/components/ui/Input/InputPassword';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { AuthLoginRequest } from '@/interface/auth/authLoginRequest.interface';

interface AuthStepLoginProps {
	email: string;
	setEmail: Dispatch<SetStateAction<string>>;
	onNext: (step: 'verify' | 'register') => void;
}

const AuthStepLogin: React.FC<AuthStepLoginProps> = ({ email, setEmail, onNext }) => {
	const { t } = useTranslation();

	const [step, setStep] = useState<'email' | 'password'>('email');
	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthLoginRequest>({
		mode: 'onChange',
		defaultValues: {
			email: email,
			password: '',
		},
	});

	const onSubmit = async (data: AuthLoginRequest) => {
		setEmail(data.email);

		const payload: AuthLoginRequest = step === 'email' ? { email: data.email } : { email, password: data.password };

		const response = await basicAuthLogin(payload);

		if (response === 'password') {
			setStep('password');
			setValue('password', '');
			return;
		}

		if (response === 'register') {
			onNext('register');
			return;
		}

		if (response === 'success') {
			onNext('verify');
		}
	};

	return (
		<form>
			<div className="w-[26rem] space-y-8">
				<img src="/logo-bg-none.png" width={200} className="mx-auto" />

				<div className="space-y-2">
					<p className="font-bold text-center text-[1.75rem]">{t('message.signin-parmigiano')}</p>
					<p className="text-center text-[#999]">{step === 'email' ? t('message.signin-email-desc') : t('message.cloud-password-required')}</p>
				</div>

				{step === 'email' && (
					<GUInput
						placeholder={t('label.email')}
						{...register('email', {
							required: t('message.validation-required-field'),
							pattern: {
								value: /^\S+@\S+$/,
								message: t('message.validation-email-invalid'),
							},
						})}
						error={errors.email?.message}
					/>
				)}

				{step === 'password' && (
					<InputPassword
						placeholder={t('label.cloud-password')}
						{...register('password', {
							minLength: {
								value: 8,
								message: t('message.validation-password-min-length'),
							},
							maxLength: {
								value: 16,
								message: t('message.validation-password-max-length'),
							},
						})}
						error={errors.password?.message}
					/>
				)}

				<GUIButton type="submit" className="!font-medium" onClick={handleSubmit(onSubmit)}>
					{t('label.next')}
				</GUIButton>
			</div>
		</form>
	);
};

export default AuthStepLogin;
