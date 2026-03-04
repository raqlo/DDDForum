import {type SubmitEvent, useState} from "react";
import type {RegistrationInput} from "../pages/registrationPage";


interface RegistrationFormProps {
    onSubmit: (formDetails: RegistrationInput) => void;
}

export const RegistrationForm = (props: RegistrationFormProps) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (ev: SubmitEvent<HTMLFormElement>) => {
        ev.preventDefault();
        props.onSubmit({
            email, username, name, lastName
        })
    }

    return (
        <div className="w-full max-w-md">
            <form onSubmit={(ev) => handleSubmit(ev)} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full validator"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Username</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="input input-bordered w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">First Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Last Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input input-bordered w-full"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-full">
                    Register
                </button>
            </form>
        </div>
    )
}




