import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import SignupStyle from './SignupStyle';
import globalStyle from '../../globalStyle';
import { useTranslation } from '../../context/TranslationContext';

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors = [];
    if (!hasUpperCase) errors.push(t('auth.signup.passwordErrorUppercase'));
    if (!hasSpecialChar) errors.push(t('auth.signup.passwordErrorSpecial'));
    if (!hasNumber) errors.push(t('auth.signup.passwordErrorNumber'));
    if (!hasMinLength) errors.push(t('auth.signup.passwordErrorLength'));

    return {
      isValid: hasUpperCase && hasSpecialChar && hasNumber && hasMinLength,
      errors
    };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError(t('auth.signup.emailError'));
      isValid = false;
    } else {
      setEmailError('');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const errorMsg = t('auth.signup.passwordError').replace('{0}', passwordValidation.errors.join(', '));
      setPasswordError(errorMsg);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth.signup.passwordsNotMatch'));
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      try {
		const response = await fetch(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/auth/register`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			email,
			password,
		  }),
		});

        const data = await response.json();

        if (response.ok) {
          navigate('/login');
        } else {
          if (data.error === 'Email already used') {
            setEmailError(t('auth.signup.emailAlreadyUsed'));
          }
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setEmailError(t('auth.signup.networkError'));
      }
    }
  };

  return (
    <div className={SignupStyle.container}>
      <div className={SignupStyle.card}>
        <div className={SignupStyle.logo}>
          <img src="/42_Logo.svg.png" alt="42 Logo" className="h-12 w-12" />
        </div>
        <h2 className={SignupStyle.title}>Ft_transcendence</h2>

        <div className="w-full">          <div className='flex flex-col justify-center items-center'>
            <h3 className="text-center mb-4 text-primary">{t('auth.signup.title')}</h3>
            <div className={globalStyle.separator}></div>
          </div>

          <form className={SignupStyle.form} onSubmit={handleSubmit}>
            <div>
              <label className={SignupStyle.inputLabel}>{t('auth.signup.email')}</label>
              <input
                type="email"
                className={SignupStyle.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            <div>
              <label className={SignupStyle.inputLabel}>{t('auth.signup.password')}</label>
              <input
                type="password"
                className={SignupStyle.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className={SignupStyle.passwordRequirements}>
                {t('auth.signup.passwordRequirements')}
              </p>
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            <div>
              <label className={SignupStyle.inputLabel}>{t('auth.signup.confirmPassword')}</label>
              <input
                type="password"
                className={SignupStyle.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
            </div>

            <button type="submit" className={SignupStyle.signupButton}>
              {t('auth.signup.signupButton')}
            </button>

            <Link to={'/login'} className={SignupStyle.accountText + " text-center"}>
              {t('auth.signup.haveAccount')}
            </Link>

            <button type="button" className={SignupStyle.googleButton}>
              <img src="https://accounts.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              {t('auth.signup.googleSignup')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
