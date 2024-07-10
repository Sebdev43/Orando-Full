import { useForm } from 'react-hook-form';
import { Errors } from '../../../@types/form';
import './FormRegister.scss';

export type FormData = {
  nickname: string;
  localisation: string;
  email: string;
  password: string;
  errors?: Errors;
};

export default function FormRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);

    // TODO : envoyer les données au serveur via un dispatch sur le reducer user

    // TODO : indiquer les erreurs de validation au moment de l'envoi

    // TODO : rediriger l'utilisateur si validation OK (de la requête)
  };

  console.log(errors);

  return (
    <form className="form__register" onSubmit={handleSubmit(onSubmit)}>
      <span className="error__nickname">
        {errors.nickname?.message as string}
      </span>
      <input
        // doit avoir 1 chiffre et 1 caractère spécial + pas d'espace au début et à la fin
        type="text"
        placeholder="Pseudo"
        {...register('nickname', {
          required: 'Vous devez choisir un pseudo',
          min: {
            value: 5,
            message: 'La longueur minimale est de 5 caractères',
          },
          maxLength: {
            value: 20,
            message: 'La longueur maximale est de 20 caractères',
          },
          pattern: {
            value:
              /^(?! )(?!.* $)(?!.* {2})(?=.{1,20}$)(?=(?:[^a-zA-Z0-9]*[a-zA-Z0-9]){5})[\w\W]*$/i,
            message: "Le pseudo n'est pas valide",
          },
        })}
      />

      <span className="error__localisation">
        {errors.localisation?.message as string}
      </span>
      <select
        // defaultValue=""
        {...register('localisation', {
          required: 'Vous devez choisir un departement',
        })}
      >
        <option disabled value="no-choice">
          Choisissez un département
        </option>
        {/* se bra,cher à l'api de geoportail pour les départements */}
        <option value="option1">Bouches du rhone</option>
        <option value="option2">Le Nord</option>
        <option value="option3">L'ouest du pays</option>
        <option value="option4">Cote d'azure</option>
      </select>

      <span className="error__email">{errors.email?.message as string}</span>
      <input
        type="text"
        placeholder="Adresse Email"
        {...register('email', {
          required: "L'email est obligatoire",
          pattern: {
            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
            message: "L'email n'est pas valide",
          },
        })}
      />

      <span className="error__password">
        {errors.password?.message as string}
      </span>

      <input
        type="text"
        placeholder="Mot de passe"
        {...register('password', {
          required: 'Vous devez choisir un mot de passe',
          min: {
            value: 8,
            message: 'Le mot de passe doit avoir au moins 8 caractères',
          },
          maxLength: {
            value: 20,
            message: 'Le mot de passe doit avoir moins de 20 caractères',
          },
          pattern: {
            value:
              /^(?! )(?!.* $)(?!.* {2})(?=.{1,20}$)(?=(?:[^a-zA-Z0-9]*[a-zA-Z0-9]){8})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\W]*$/i,
            message:
              'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et un caractère speciaux',
          },
        })}
      />

      <input type="submit" />
    </form>
  );
}
