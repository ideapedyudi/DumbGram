// ---------------- react ----------------
import { useEffect, useState, useContext } from 'react';

// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Col, Card, Container } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ----------- feed.css ----------------
import '../style/ProfilPeopleFeed.css';
import Notifikasi from './Notifikasi';
import CardPeopleFeed from './CardPeopleFeed';

// ------------ ant design ------------
import { Popover } from 'antd';
import 'antd/dist/antd.css';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faComment, faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// ----------- component -----------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';
const path = "http://localhost:5000/uploads/"

function ProfilPeopleFeed({ users, feedss, loadFeeds }) {
    // params
    const { ProfilePeopleFeedId } = useParams()

    const [state, dispatch] = useContext(UserContext);

    // user
    const [user, setUser] = useState({})

    // ---------------- user -----------------
    const loadUser = async () => {
        try {
            const response = await API.get(`user/${ProfilePeopleFeedId}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadUser()
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
                            <Card.Text className="namenotif">
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
            {/* --------------------------- navigasi people feed -------------------------- */}
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
                    <p className="JudulFeed">{user.fullName}, Feed</p>
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

            {/* ----------- image people feed -------------- */}
            <div className="masoryholder" data-aos="fade-up">
                {feedss?.map((feed, index) => (
                    <Col md={4}>
                        <Card style={{ width: '18rem' }} className="cardfeed">
                            <Card.Img variant="top" className="imgfeed" src={path + feed.fileName} />
                            <CardPeopleFeed feed={feed} loadFeeds={loadFeeds} />
                        </Card>
                    </Col>
                ))}
            </div>
        </>
    )
}

export default ProfilPeopleFeed

