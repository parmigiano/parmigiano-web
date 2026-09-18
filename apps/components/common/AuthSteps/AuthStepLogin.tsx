import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { basicAuthRequestCode } from '@/rest/authAPI';
import { GUInput } from '@/components/ui/Input/GUInput';
import GUIButton from '@/components/ui/Button/GUIButton';
import type { Dispatch, SetStateAction } from 'react';
import type { AuthLoginRequest } from '@/interface/auth/authLoginRequest.interface';

interface AuthStepLoginProps {
	email: string;
	setEmail: Dispatch<SetStateAction<string>>;
	onNext: () => void;
}

const AuthStepLogin: React.FC<AuthStepLoginProps> = ({ email, setEmail, onNext }) => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthLoginRequest>({
		mode: 'onChange',
		defaultValues: { email },
	});

	const onSubmit = async (data: AuthLoginRequest) => {
		const normalizedEmail = data.email.trim().toLowerCase();
		setEmail(normalizedEmail);
		await basicAuthRequestCode(normalizedEmail);
		onNext();
	};

	return (
		<form className="w-full" onSubmit={(event) => event.preventDefault()}>
			<div className="space-y-7">
				<div className="space-y-2 text-center">
					<p className="text-[1.75rem] font-semibold">{t('message.signin-parmigiano')}</p>
					<p className="text-sm leading-6 text-[#8b9bad]">{t('message.signin-email-desc')}</p>
				</div>

				<GUInput
					autoFocus
					autoComplete="email"
					placeholder={t('label.email')}
					{...register('email', {
						required: t('message.validation-required-field'),
						pattern: {
							value: /^\S+@\S+\.\S+$/,
							message: t('message.validation-email-invalid'),
						},
					})}
					error={errors.email?.message}
				/>

				<GUIButton type="submit" className="!font-medium" onClick={handleSubmit(onSubmit)}>
					{t('label.next')}
				</GUIButton>
			</div>
		</form>
	);
};

export default AuthStepLogin;
