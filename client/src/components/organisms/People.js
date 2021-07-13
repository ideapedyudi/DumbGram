import React from 'react'
// ------------- Aos --------------
import { Navbar, Card, Container } from 'react-bootstrap';

// path
const path = "http://localhost:5000/uploads/";

export default function People({ userchat, chat }) {
    console.log(chat)
    return (
        <div>
            {`${userchat.Sender.id}` === `${chat}` ?
                <Card.Body className="inlineChat">
                    <div class="boxprofile">
                        <Card.Img variant="top" src={path + userchat.Sender.image} className="profilechat" />
                    </div>
                    <Card.Text className="namechat">
                        <Card.Title className="namechatpeople">{userchat.Sender.fullName}</Card.Title>
                        <span className="chatrender">{userchat.message}</span>
                    </Card.Text>
                </Card.Body> :
                <div></div>
            }
        </div>
    )
}
