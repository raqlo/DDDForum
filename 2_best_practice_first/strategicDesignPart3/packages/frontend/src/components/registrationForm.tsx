import React, { useState } from "react";
import { Link } from "react-router-dom";

export type RegistrationInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface RegistrationFormProps {
  onSubmit: (formDetails: RegistrationInput) => void;
}

export const RegistrationForm = (props: RegistrationFormProps) => {
  const [email, setEmail] = useState('email');
  const [username, setUsername] = useState('username');
  const [firstName, setFirstName] = useState('firstName');
  const [lastName, setLastName] = useState('lastName');
  const [consentMarketing, setConsentMarketing] = useState(false);

  const handleSubmit = () => {
    props.onSubmit({
      email, username, firstName, lastName
    })
  }

  return (
    <div className="registration-form">
      <div>Create Account</div>
      <input
        className="registration email"
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        className="registatation-input registration username"
        type="text"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        className="registatation-input registration first-name"
        type="text"
        placeholder="first name"
        onChange={(e) => setFirstName(e.target.value)}
      ></input>
      <input
        className="registatation-input registration last-name"
        type="text"
        placeholder="last name"
        onChange={(e) => setLastName(e.target.value)}
      ></input>
        <div className={"registration-check-group"}> <input className={"registration marketing-emails"} type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)}/> Receive Marketing emails? </div>
      <div>
        <div className="to-login">
          <div>Already have an account?</div>
          <Link to="/login">Login</Link>
        </div>
        <button onClick={() => handleSubmit()} className="registration submit-button" type="submit">
          Submit
        </button>
      </div>
    </div>
  );
}
