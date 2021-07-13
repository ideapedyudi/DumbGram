// ---------------- react -----------------
import { useState, useContext } from "react";

// ------------- sweetalert ----------------
import swal from 'sweetalert';

// ------------ bootstrap ----------
import { Button, Form, Modal } from 'react-bootstrap';

// ------------ register -----------
import Register from '../organisms/Register';

// ------------ style ------------
import '../style/Login.css';

// ----------- component -----------
import { UserContext } from "../contexts/UserContext";
import { API, setAuthToken } from '../config/api';

function Login(props) {

    // useState
    const [show, setShow] = useState(props.isOpen);
    const handleClose = () => setShow(false);

    // register
    const [showRegisterModal, setRegisterModal] = useState(false);
    const handleModalRegister = () => {
        setShow(!show);
        setRegisterModal(!showRegisterModal);
    }

    const [state, dispatch] = useContext(UserContext);
    const [message, setMessage] = useState('')
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { email, password } = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                email,
                password
            })

            const response = await API.post("/login", body, config)

            setMessage(response.data.message)

            setAuthToken(response.data.data.user.token)

            swal({
                title: "Welcome To DumbGram",
                text: "Share your best photos or videos",
                className: "red-bg",
                button: false,
            });


            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data.user
            })

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            {/* ----------- modal ---------- */}
            {showRegisterModal ? <Register isOpen={true} /> : null}
            <Modal show={show} onHide={handleClose} className="loginModal">
                <Modal.Header className="border-0 modal-header">
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    {/* form */}
                    <Form onSubmit={handleSubmit}>
                        {message &&
                            <div className="alert alert-danger message-notice" role="alert">
                                {message}
                            </div>
                        }
                        <Form.Control className="form-controls" onChange={onChange} value={email} name="email" type="email" placeholder="Email" autocomplete="off" required /> <br />
                        <Form.Control className="form-controls" onChange={onChange} value={password} name="password" type="password" placeholder="Password" autocomplete="off" required /> <br />
                        <Button className="btlogin" type="submit" variant="primary" size="lg">
                            Login
                        </Button>
                        {/* ------- Register ----- */}
                        <center className="mt-2 loginend">Don't have an account ? Klik <span className="Reg" onClick={handleModalRegister}>Here</span></center>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Login
