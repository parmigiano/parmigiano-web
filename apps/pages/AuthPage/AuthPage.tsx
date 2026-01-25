import { useEffect, useState } from 'react';

import AuthStepLogin from '@/components/common/AuthSteps/AuthStepLogin';
import AuthStepRegister from '@/components/common/AuthSteps/AuthStepRegister';
import AuthStepVerifyCode from '@/components/common/AuthSteps/AuthStepVerifyCode';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';

type AuthStep = 'login' | 'verify' | 'register';

const AuthPage = () => {
	const [email, setEmail] = useState<string>(() => {
		return sessionStorage.getItem(CACHEKEYs.AUTH_EMAIL) ?? '';
	});

	const [step, setStep] = useState<AuthStep>(() => {
		return (sessionStorage.getItem(CACHEKEYs.AUTH_STEP) as AuthStep) ?? 'login';
	});

	useEffect(() => {
		sessionStorage.setItem(CACHEKEYs.AUTH_STEP, step);
	}, [step]);


	useEffect(() => {
		if (email) {
			sessionStorage.setItem(CACHEKEYs.AUTH_EMAIL, email);
		}
	}, [email]);

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			{step === 'login' && <AuthStepLogin email={email} setEmail={setEmail} onNext={(nextStep) => setStep(nextStep)} />}

			{step === 'verify' && <AuthStepVerifyCode email={email} />}

			{step === 'register' && <AuthStepRegister email={email} onNext={(nextStep) => setStep(nextStep)} />}
		</div>
	);
};

export default AuthPage;
