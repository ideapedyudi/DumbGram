// ------------ react -------------
import { useState, useEffect, useContext } from 'react'

// ------------- Aos --------------
import { Navbar, Card, Container } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ------------ stayle ------------
import '../style/Feed.css';
import '../style/ProfileMessange.css';

// ------------- asset ------------
import DumbGram from '../asset/DumbGram.svg';
import { UserContext } from "../contexts/UserContext";

import People from './People';

// config
import { API } from '../config/api';

function ProfileChat() {

    const [state, dispatch] = useContext(UserContext);

    // params
    const { chat } = useParams()

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
                        <People userchat={userchat} chat={chat} />
                    ))}
                </Card>
            </Container>
        </>
    )
}

export default ProfileChat
