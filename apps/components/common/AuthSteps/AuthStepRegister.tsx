import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { basicAuthCreate } from '@/rest/authAPI';
import { GUInput } from '@/components/ui/Input/GUInput';
import GUIButton from '@/components/ui/Button/GUIButton';
import InputPassword from '@/components/ui/Input/InputPassword';
import type { AuthCreateRequest } from '@/interface/auth/authCreateRequest.interface';

interface AuthStepRegisterProps {
	email: string;
	onNext: (step: 'verify') => void;
}

const AuthStepRegister: React.FC<AuthStepRegisterProps> = ({ email, onNext }) => {
	const { t } = useTranslation();

	const {
		register,
		trigger,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthCreateRequest>({
		mode: 'onChange',
		defaultValues: {
			email: email,
			name: '',
			username: '',
			password: '',
		},
	});

	const [step, setStep] = useState<1 | 2>(1);

	const handleFirstStep = async () => {
		const isValid = await trigger(['name', 'username']);
		if (isValid) {
			setStep(2);
		}
	};

	const onSubmit = async (data: AuthCreateRequest) => {
		const payload: AuthCreateRequest = (data.password?.length ?? 0) > 0 ? { ...data } : { email: data.email, name: data.name, username: data.username };

		const response = await basicAuthCreate(payload);
		if (response === 'success') {
			onNext('verify');
		}
	};

	return (
		<form>
			<div className="w-[26rem] space-y-8">
				<img src="/logo-bg-none.png" width={200} className="mx-auto" />

				<div className="space-y-2">
					<p className="font-bold text-center text-[1.75rem]">{t('message.create-account-parmigiano')}</p>
				</div>

				{step === 1 && (
					<>
						<div className="space-y-3">
							<GUInput
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
				)}

				{step === 2 && (
					<>
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

						<div className="space-y-2">
							<GUIButton type="submit" className="!font-medium" onClick={handleSubmit(onSubmit)}>
								{t('label.next')}
							</GUIButton>

							<GUIButton type="submit" className="!font-normal !bg-[transparent] hover:!bg-[#2c00ff1c]" onClick={handleSubmit(onSubmit)}>
								<div className="flex items-center justify-center gap-1">
									<span>{t('label.skip')}</span>
								</div>
							</GUIButton>
						</div>
					</>
				)}
			</div>
		</form>
	);
};

export default AuthStepRegister;
