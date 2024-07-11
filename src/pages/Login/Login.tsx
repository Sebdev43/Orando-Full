import './Login.scss';

// components
import FormLogin from '../../components/Forms/FormLogin/FormLogin';
import { NavLink } from 'react-router-dom';

// Actual (page) component
export default function Login() {
  return (
    <div className="login__container">
      <h1 className="page_title">Se connecter</h1>
      <FormLogin />
      <h4 className="title__no-account">
        Si vous ne possédez pas de compte, {''}
        <NavLink to="/inscription">créez votre compte</NavLink>
      </h4>
    </div>
  );
}
