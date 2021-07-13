// ------------ react -------------
import { useState, useEffect, useContext } from 'react'

// ------------- Aos --------------
import { Navbar, Card, Container } from 'react-bootstrap';

// -------- router -------------
import { Link } from "react-router-dom";

// ------------ stayle ------------
import '../style/Feed.css';
import '../style/ProfileMessange.css';

// ------------- asset ------------
import DumbGram from '../asset/DumbGram.svg';
import Profile from '../asset/Rectangle 4.jpg';
import Profile2 from '../asset/zeny.png';
import { UserContext } from "../contexts/UserContext";

// config
import { API } from '../config/api';

// path
const path = "http://localhost:5000/uploads/";

function ProfileMessage() {

    const [state, dispatch] = useContext(UserContext);

    const [likeChatPeople, setChatPeople] = useState([])

    // -------------------- follow user ------------------------------
    const loadChatPeople = async () => {
        try {
            const response = await API.get(`/history-chat`)
            setChatPeople(response.data.data.message)
        } catch (error) {
            console.log(error);
        }
    }

    console.log(likeChatPeople)

    // Load loadFollow
    useEffect(() => {
        loadChatPeople()
    }, [])

    return (
        <>
            {/* --------------------------- card profile feed -------------------------- */}
            <Navbar bg="dark" className="bar ms-3">
                <Link to="/">
                    <img src={DumbGram} className="logos ms-4" alt="logo" />
                </Link>
            </Navbar>
            <br />
            <Container>
                <Card style={{ width: '20rem' }} className="cardchat ms-3">
                    {likeChatPeople?.map((userchat, index) => (
                        <Link to={`/ChatPage/${userchat.Sender.id}`}>
                            <Card.Body className="inlineChat">
                                <div class="boxprofile">
                                    <Card.Img variant="top" src={path + userchat.Sender.image} className="profilechat" />
                                </div>
                                <Card.Text className="namechat">
                                    <Card.Title className="namechatpeople">{userchat.Sender.fullName}</Card.Title>
                                    <span className="chatrender">{userchat.message}</span>
                                </Card.Text>
                            </Card.Body>
                        </Link>
                    ))}
                </Card>
            </Container>
        </>
    )
}

export default ProfileMessage
