import { useContext } from 'react';

import '../style/Chat.css';

// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Container, Card, Form } from 'react-bootstrap';

import { UserContext } from "../contexts/UserContext";

// path
const path = "http://localhost:5000/uploads/";


export default function Messages({ chats }) {

    const [state, dispatch] = useContext(UserContext);

    return (
        <div>
            {`${chats.Sender.id}` === `${state.user.id}` ?

                <Card.Body className="inlinechat chatme justify-content-end" data-aos="fade-up">
                    <Card.Text className="namechat me-3">
                        <Card.Title className="namechatpeople text-end">Saya</Card.Title>
                        <Card.Title className="chatrender boxChat text-start">{chats.message}</Card.Title>
                    </Card.Text>
                    <div class="boxproFile">
                        <Card.Img variant="top" src={path + chats.Sender.image} className="profileChat" />
                    </div>
                </Card.Body> :

                <Card.Body className="inlinechat mtChat" data-aos="fade-up">
                    <div class="boxproFile">
                        <Card.Img variant="top" src={path + chats.Sender.image} className="profileChat" />
                    </div>
                    <Card.Text className="namechat">
                        <Card.Title className="namechatpeople text-start">{chats.Sender.fullName}</Card.Title>
                        <Card.Title className="chatrender boxChatSender text-start">{chats.message}</Card.Title>
                    </Card.Text>
                </Card.Body>
            }
        </div>
    )
}
