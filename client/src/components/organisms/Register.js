// ------------- react --------------------
import { useState } from 'react';

// ---------------- sweetalert ---------------
import swal from 'sweetalert';

// -------------- bootstrap ----------------
import { Button, Form, Alert } from 'react-bootstrap';

// ------------- style ---------------
import '../style/Register.css';

// ----------- modal --------------
import Login from './Login';
import Modal from 'react-bootstrap/Modal';

// ---------- config -----------
import { API } from '../config/api';

function Register(props) {

    // register
    const [show, setShow] = useState(props.isOpen);
    const handleClose = () => setShow(false);

    // login
    const [showLogin, setShowLogin] = useState(false);
    const handleLoginModal = () => {
        setShow(!show);
        setShowLogin(!showLogin);
    }

    // message gagal
    const [messageGagal, setMessageGagal] = useState('')

    // message success
    const [message, setMessage] = useState('')


    const [form, setForm] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        image: 'noname.png'
    })

    const { fullName, email, username, password } = form

    // name dan value form sama
    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // ketika tombol submit di tekan
    const handleOnSubmit = async (e) => {

        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                ...form
            })

            // link config
            const response = await API.post('/register', body, config)

            console.log(response)

            // jika success
            if (response.data.status === 'success') {
                setMessageGagal('')

                // ketika success
                setMessage(response.data.message)

                // kosongkan data
                setForm({
                    fullName: '',
                    email: '',
                    username: '',
                    password: ''
                })

                handleClose()

                swal({
                    title: "Good Job",
                    text: "Registrasi Success",
                    className: "red-bg",
                    button: false,
                });

                // jika kesalahan inputan
            } else if (response.data.status === 'Validation Faileds') {
                setMessage('')
                setMessageGagal(response.data.message)
                // jika email sudah ada di database
            } else if (response.data.status === 'Failed') {
                setMessage('')
                setMessageGagal(response.data.message)
            }

            // server error
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            {/* ----------- modal ---------- */}
            {showLogin ? <Login isOpen={true} /> : null}
            <Modal show={show} onHide={handleClose} className="loginRegister">
                <Modal.Header className="border-0 modal-header">
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {/* alert ketika success */}
                    {message &&
                        <Alert className="message-notice" variant="success">
                            {message}
                        </Alert>
                    }

                    {/* alert ketika gagal dan email sudah ada */}
                    {messageGagal &&
                        <Alert className="message-notice" variant="danger">
                            {messageGagal}
                        </Alert>
                    }

                    {/* form */}
                    <Form onSubmit={handleOnSubmit}>
                        <Form.Control className="form-controls" type="text" onChange={handleOnChange} value={email} name="email" placeholder="Email" autocomplete="off" required /> <br />
                        <Form.Control className="form-controls" type="text" onChange={handleOnChange} value={fullName} name="fullName" placeholder="fullName" autocomplete="off" required /> <br />
                        <Form.Control className="form-controls" type="text" onChange={handleOnChange} value={username} name="username" placeholder="Username" autocomplete="off" required /> <br />
                        <Form.Control className="form-controls" type="password" onChange={handleOnChange} value={password} name="password" placeholder="Password" autocomplete="off" required /> <br />
                        <Button className="btlogin" type="submit" variant="primary" size="lg" block>
                            Register
                        </Button>
                        {/* login */}
                        <center className="mt-2 loginend">Already have an account ? Klik  <span className="log" onClick={handleLoginModal}>Here</span></center>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Register
