// ------------ react -------------
import { useState, useEffect, useContext, useRef } from 'react'

// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Container, Card, Form } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ----------- Explore.css ----------------
import Notifikasi from './Notifikasi';

// ------------ style --------------
import '../style/Explore.css';
import '../style/Chat.css';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";
import Messages from './Messages'


// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { UserContext } from "../contexts/UserContext";

// config
import { API } from '../config/api';

// path
const path = "http://localhost:5000/uploads/";

function Chat() {

    const [state, dispatch] = useContext(UserContext);

    // params
    const { chat } = useParams()

    const [likeChat, setChat] = useState([])

    // -------------------- follow user ------------------------------
    const loadChat = async () => {
        try {
            const response = await API.get(`/message-user/${chat}`)
            setChat(response.data.data.Message)
        } catch (error) {
            console.log(error);
        }
    }

    // ----------------------------- send message -----------------------------
    const [form, setForm] = useState({
        Message: ''
    })

    const { Message } = form

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleOnSubmit = async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({ ...form })

            await API.post(`/message/${chat}`, body, config)
            loadChat()
            setForm(
                {
                    Message: ''
                }
            )

        } catch (error) {
            console.log(error)
        }
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    useEffect(() => {
        scrollToBottom()
    }, [likeChat]);

    // Load loadFollow
    useEffect(() => {
        loadChat()
    }, [])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])
    return (
        <>
            <Navbar fixed="top" className="bartpostnotif navbarchat">
                <Container>
                    <InputGroup.Prepend>
                        <InputGroup.Text className="icon-serch-feed" id="basic-addon1"><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl className="cariFeeds" placeholder="Search" />
                    <Navbar.Collapse className="justify-content-end">
                        <Notifikasi />
                        <Link to="/MessagePage"><FontAwesomeIcon className="icon-Notifikasi" icon={faPaperPlane} /></Link>
                        <Navbar.Text>
                            <Link to="/CreatePostPage">
                                <Button className="button-post"><span className="plusquar"><FontAwesomeIcon className="icon-plus" icon={faPlus} /></span> &nbsp;<span className="create">Create Post</span></Button>
                            </Link>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* image expore */}
            <div className="NoMassage">
                <Card style={{ width: '53rem' }} className="cardchat ms-3">
                    {likeChat?.map((chats, index) => (

                        <Messages chats={chats} />

                    ))}
                </Card>
                <div ref={messagesEndRef} />
                <br /><br /><br />
            </div>
            <Navbar fixed="bottom" className="massegae">
                <Form onSubmit={handleOnSubmit}>
                    <Container>
                        <InputGroup className="mb-3">
                            <Form.Control placeholder="Write Message" onChange={handleOnChange} value={Message} name="Message" type="text" className="inputchat" autoComplete="off" required />
                            <InputGroup.Append>
                                <Button className="ms-3 btnSend" type="submit" variant="outline-secondary">Send</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Container>
                </Form>
            </Navbar>
        </>
    )
}

export default Chat
