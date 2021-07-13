import { useContext, useState } from 'react';
// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Col, Card, Container, Form } from 'react-bootstrap';

// -------- router -------------
import { Link } from "react-router-dom";

// ----------- Explore.css ----------------
import '../style/Explore.css';
import Notifikasi from './Notifikasi';

// ------------ ant design ------------
import { Popover } from 'antd';
import 'antd/dist/antd.css';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// ------------ config -------------
import { API } from '../config/api';

// path
import { UserContext } from "../contexts/UserContext";
const path = "http://localhost:5000/uploads/";

function ExploreExplore() {

    const [state, dispatch] = useContext(UserContext);

    // useState
    const [feeds, setFeeds] = useState([])

    // users
    const [users, setUsers] = useState([])

    // ------------------ load Feed ------------------
    const loadFeed = async () => {
        try {
            const response = await API.get('feeds')
            setFeeds(response.data.data.feeds)
        } catch (error) {
            console.log(error)
        }
    }

    // -------------------- user -----------------------
    const loadUsers = async () => {
        try {
            const response = await API.get('users')
            setUsers(response.data.data.users)
        } catch (error) {
            console.log(error)
        }
    }

    // Load data ketika pertama kali
    useEffect(() => {
        loadFeed()
    }, [])

    // Load user
    useEffect(() => {
        loadUsers()
    }, [])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])

    const content = (
        <div className="cont">
            {users.map((user, index) => (
                <Card style={{ width: '12rem' }} className="cardnotif">
                    <div className="starttif mb-2">
                        <div className="ovalnotif">
                            {`${user.id}` === `${state.user.id}` ?
                                <Link to={`/`}>
                                    <Card.Img className="profilnotif" variant="top" src={path + user.image} />
                                </Link> :
                                <Link to={`/ProfilePeopleFeed/${user.id}`}>
                                    <Card.Img className="profilnotif" variant="top" src={path + user.image} />
                                </Link>
                            }
                        </div>
                        <Card.Body className="titlenotif">
                            <Card.Text className="namenotif nameuser">
                                {user.fullName}
                            </Card.Text>
                        </Card.Body>
                    </div>
                </Card>
            ))}
        </div>
    );
    return (
        <>
            <Navbar fixed="top" className="bartpostnotif">
                <Container>
                    <InputGroup.Prepend>
                        <InputGroup.Text className="icon-serch-feed cursorfeed" id="basic-addon1">
                            <Popover placement="bottomLeft" content={content} trigger="click">
                                <FontAwesomeIcon icon={faSearch} />
                            </Popover>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl className="cariFeeds" placeholder="Search" />
                    <p className="JudulFeed">Explore</p>
                    <Navbar.Toggle />
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
            <div className="masoryholder" data-aos="fade-up">
                {feeds?.map((feed, index) => (
                    <Col md={4}>
                        <Card style={{ width: '18rem' }} className="cardfeed">
                            <Card.Img variant="top" className="imgfeed" src={feed.image} />
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </div>
        </>
    )
}

export default ExploreExplore
