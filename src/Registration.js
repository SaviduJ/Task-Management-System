import './Style.css';
import React, { useEffect } from 'react';
import { useState } from 'react';

export default function Registration() {

    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => setMsg(''), 15000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    const handleInputChange = (e, type) => {
        setError(''); // Clear error on input change

        switch (type) {
            case 'user':
                setUser(e.target.value);
                if (e.target.value === '') {
                    setError("Username has left blank");
                }
                break;
            case 'email':
                setEmail(e.target.value);
                if (e.target.value === '') {
                    setError("Email has left blank");
                }
                break;
            case 'pass1':
                setPass1(e.target.value);
                if (e.target.value === '') {
                    setError("Password has left blank");
                }
                break;
            case 'pass2':
                setPass2(e.target.value);
                if (e.target.value === '') {
                    setError("Confirm Password has left blank");
                } else if (e.target.value !== pass1) {
                    setError('Confirm password does not match');
                }
                break;
            default:
                break;
        }
    }

    const handleSubmit = () => {
        if (user !== "" && email !== "" && pass1 !== "" && pass2 !== "") {
            const url = "http://localhost:8000/registration.php";
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            const data = {
                user: user,
                email: email,
                pass: pass2
            };
            fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            }).then((response) => response.json())
                .then((response) => {
                    setMsg(response[0].result);
                }).catch((err) => {
                    setError('An error occurred');
                    console.log(err);
                });
            setUser('');
            setEmail('');
            setPass1('');
            setPass2('');
        } else {
            setError("All fields are required");
        }
    }

    const checkUser = () => {
        const url = "http://localhost:8000/checkuser.php";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        const data = { user: user };
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((response) => {
                setError(response[0].result);
            }).catch((err) => {
                setError('An error occurred');
                console.log(err);
            });
    }

    const checkPassword = () => {
        if (pass1.length < 8) {
            setError('Password is less than 8 characters');
        }
    }

    const checkEmail = () => {
        const url = "http://localhost:8000/checkemail.php";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        const data = { email: email };
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((response) => {
                setError(response[0].result);
            }).catch((err) => {
                setError('An error occurred');
                console.log(err);
            });
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className='form'>
            <p>
                {msg && <span className='success'>{msg}</span>}
                {error && <span className='error'>{error}</span>}
            </p>
            <label>Username </label>
            <input
                type='text'
                name='user'
                value={user}
                onChange={(e) => handleInputChange(e, 'user')}
                onBlur={checkUser}
                style={{
                    marginTop: '0.5rem',
                    fontSize: '1rem',
                    width: '300px',
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '0.5rem'
                  }}

            />
            <label>Email </label>
            <input
                type='email'
                name='email'
                value={email}
                onChange={(e) => handleInputChange(e, 'email')}
                onBlur={checkEmail}
                style={{
                    marginTop: '0.5rem',
                    fontSize: '1rem',
                    width: '300px',
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '0.5rem'
                  }}
            />
            <label>Password </label>
            <input
                type='password'
                name='pass1'
                value={pass1}
                onChange={(e) => handleInputChange(e, 'pass1')}
                onBlur={checkPassword}
                style={{
                    marginTop: '0.5rem',
                    fontSize: '1rem',
                    width: '300px',
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '0.5rem'
                  }}
            />
            <label>Confirm Password </label>
            <input
                type='password'
                name='pass2'
                value={pass2}
                onChange={(e) => handleInputChange(e, 'pass2')}
                style={{
                    marginTop: '0.5rem',
                    fontSize: '1rem',
                    width: '300px',
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '0.5rem'
                  }}
            />
            <label> </label>
            <input
                type='submit'
                value='Submit'
                className='button'
                onClick={handleSubmit}
                style={{
                    marginTop: '0.5rem',
                    fontSize: '1rem',
                    width: '300px',
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '0.5rem'
                  }}
            />
        </div>
    </div>
    )
}
