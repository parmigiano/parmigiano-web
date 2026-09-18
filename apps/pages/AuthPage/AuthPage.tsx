import { useEffect, useState } from 'react';
import AuthStepLogin from '@/components/common/AuthSteps/AuthStepLogin';
import AuthStepRegister from '@/components/common/AuthSteps/AuthStepRegister';
import AuthStepVerifyCode from '@/components/common/AuthSteps/AuthStepVerifyCode';
import AuthStepPassword from '@/components/common/AuthSteps/AuthStepPassword';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';

type AuthStep = 'login' | 'verify' | 'password' | 'register';

const AuthPage = () => {
	const [email, setEmail] = useState(() => sessionStorage.getItem(CACHEKEYs.AUTH_EMAIL) ?? '');
	const [step, setStep] = useState<AuthStep>(() => {
		const saved = sessionStorage.getItem(CACHEKEYs.AUTH_STEP) as AuthStep | null;
		return saved && ['login', 'verify', 'password', 'register'].includes(saved) ? saved : 'login';
	});

	useEffect(() => {
		sessionStorage.setItem(CACHEKEYs.AUTH_STEP, step);
	}, [step]);

	useEffect(() => {
		if (email) sessionStorage.setItem(CACHEKEYs.AUTH_EMAIL, email);
	}, [email]);

	const resetToEmail = () => {
		setStep('login');
	};

	return (
		<main className="auth-shell flex min-h-[100dvh] items-center justify-center px-5 py-10">
			<section className="w-full max-w-[420px] rounded-[28px] border border-white/5 bg-[#17212b]/95 p-7 shadow-2xl backdrop-blur sm:p-9">
				<img src="/logo-bg-none.png" width={168} className="mx-auto mb-7" alt="ParmigianoChat" />

				{step === 'login' && <AuthStepLogin email={email} setEmail={setEmail} onNext={() => setStep('verify')} />}
				{step === 'verify' && <AuthStepVerifyCode email={email} onNext={setStep} onBack={resetToEmail} />}
				{step === 'password' && <AuthStepPassword email={email} onBack={() => setStep('verify')} />}
				{step === 'register' && <AuthStepRegister email={email} onBack={() => setStep('verify')} />}
			</section>
		</main>
	);
};

export default AuthPage;
