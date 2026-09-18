import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CodeInput from '@/components/ui/Input/InputCode';
import { basicAuthVerifyCode } from '@/rest/authAPI';
import { ROUTES } from '@/constants/constants';

interface AuthStepVerifyCodeProps {
	email: string;
	onNext: (step: 'password' | 'register') => void;
	onBack: () => void;
}

const AuthStepVerifyCode: React.FC<AuthStepVerifyCodeProps> = ({ email, onNext, onBack }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [code, setCode] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	const handleVerify = async (finalCode: string) => {
		if (isVerifying) return;
		setIsVerifying(true);

		try {
			const result = await basicAuthVerifyCode({ email, code: Number(finalCode) });
			setIsSuccess(result === 'authenticated');
			setIsError(false);

			if (result === 'authenticated') {
				navigate(ROUTES.CHAT, { replace: true });
				return;
			}

			onNext(result);
		} catch {
			setIsSuccess(false);
			setIsError(true);
			setCode('');
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<div className="space-y-7 text-center">
			<div className="space-y-2">
				<p className="text-[1.55rem] font-semibold">{email}</p>
				<p className="text-sm leading-6 text-[#8b9bad]">{t('message.send-verify-code-desc')}</p>
			</div>

			<CodeInput value={code} onChange={setCode} onComplete={handleVerify} success={isSuccess} error={isError} />
			{isVerifying && <p className="text-sm text-[#8b9bad]">{t('message.please-wait')}</p>}

			<button type="button" onClick={onBack} className="text-sm font-medium text-[#5aa7e8] hover:text-[#76b8ef]">
				{t('label.change-email')}
			</button>
		</div>
	);
};

export default AuthStepVerifyCode;
