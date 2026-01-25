import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CodeInput from '@/components/ui/Input/InputCode';
import { basicAuthVerifyCode } from '@/rest/authAPI';
import { ROUTES } from '@/constants/constants';

interface AuthStepVerifyCodeProps {
	email: string;
}

const AuthStepVerifyCode: React.FC<AuthStepVerifyCodeProps> = ({ email }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [code, setCode] = useState<string>('');
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	const handleVerify = async (fcode: string) => {
		try {
			await basicAuthVerifyCode({ email, code: Number(fcode) });

			setIsSuccess(true);
			setIsError(false);

			setTimeout(() => {
				navigate(ROUTES.CHAT);
			}, 1500);
		} catch {
			setIsSuccess(false);
			setIsError(true);
		}
	};

	return (
		<div className="w-[26rem] text-center space-y-8">
			<img src="/logo-bg-none.png" width={200} className="mx-auto" />

			<div className="space-y-2">
				<p className="font-medium text-[1.75rem]">{email}</p>
				<p className="text-[#999]">{t('message.send-verify-code-desc')}</p>
			</div>

			<CodeInput value={code} onChange={setCode} onComplete={(fcode: string) => handleVerify(fcode)} success={isSuccess} error={isError} />
		</div>
	);
};

export default AuthStepVerifyCode;
