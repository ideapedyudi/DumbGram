// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Col, Card, Container } from 'react-bootstrap';

// -------- router -------------
import { Link } from "react-router-dom";

// ----------- feed.css ----------------
import Notifikasi from './Notifikasi';
import '../style/Feed.css';

// ------------ ant design ------------
import { Popover } from 'antd';
import 'antd/dist/antd.css';

// ------------- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState, useContext } from 'react';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// ----------- Component ------------
import DetailFeed from './DetailFeed';
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';
import CardFeed from './CardFeed';

// path
const path = "http://localhost:5000/uploads/";

function FeedFeed() {

    // useState
    const [state, dispatch] = useContext(UserContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // follow feed
    const [feedFollow, setFeedFollow] = useState([])
    const [feedsid, getFeedById] = useState({})

    // like
    const [likeUser, setLikeUser] = useState([])
    const [likes, setLike] = useState()

    // users
    const [users, setUsers] = useState([])

    // load Feed 
    const loadFeedFollow = async () => {
        try {
            const response = await API.get(`feed/${state.user.id}`)
            setFeedFollow(response.data.data.userData.following) // id follow
        } catch (error) {
            console.log(error)
        }
    }

    let followFeed = []
    // feed follow
    feedFollow.map((feeds) => (
        feeds.following.feed.map((feed) => (
            followFeed = [...followFeed, feed]
        ))
    ))

    // order
    followFeed.reverse()

    // --------------------------- like --------------------------
    const loadLike = async () => {
        try {
            const response = await API.get(`/like/${state.user.id}`)
            setLikeUser(response.data.like)
        } catch (error) {
            console.log(error);
        }
    }

    const likeFilter = async () => {
        try {

            const find = likeUser.find((data) => data.idFeed == followFeed.id)
            if (find) {
                setLike(true)
            } else {
                setLike(false)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = (event) => {
        const id = event.target.getAttribute('content');
        like(id);
    }

    const like = async (id) => {
        try {
            const body = JSON.stringify({ id });
            const headers = {
                headers: { 'Content-Type': 'application/json' }
            }
            const response = await API.post('/like', body, headers);

            loadFeedFollow()
        } catch (error) {
            console.log(error);
        }
    }

    // -------------------- user feed -----------------------
    const loadUsers = async () => {
        try {
            const response = await API.get('users')
            setUsers(response.data.data.users)
        } catch (error) {
            console.log(error)
        }
    }

    // Load user
    useEffect(() => {
        loadUsers()
    }, [])

    // Load loadLike
    useEffect(() => {
        loadLike()
    }, [])

    // Load likeFilter
    useEffect(() => {
        likeFilter()
    }, [likeUser])

    // Load loadFeedFollow
    useEffect(() => {
        loadFeedFollow()
    }, [feedsid])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, [])
    const content = (
        <div className="cont">
            {users.map((user, index) => (
                <Card style={{ width: '12rem' }} className="cardnotif">
                    <div className="starttif mb-2 boxuser">
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
            {/* navbar feed */}
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
                    <p className="JudulFeed">Feed</p>
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

            {/* image feed */}

            <div className="masoryholder" data-aos="fade-up">
                {followFeed?.map((feedFol, index) => (
                    <Col lg={4}>
                        <Card style={{ width: '18rem' }} className="cardfeed" onClick={() => getFeedById(feedFol)}>
                            <Card.Img variant="top" className="imgfeed cursorfeed" src={path + feedFol.fileName} onClick={handleShow} />
                            <CardFeed feedFol={feedFol} loadFeedFollow={loadFeedFollow} loadLike={loadLike} />
                        </Card>
                    </Col>
                ))}
                {followFeed.length === 0 ? <center className="nopost" data-aos="fade-up">No Post <p className="childnopost">follow someone to view posts</p></center> : <center></center>}
            </div>
            {/* =============== modal deetail feed =============== */}
            <DetailFeed show={show} handleClose={handleClose} feedsid={feedsid} loadFeedFollow={loadFeedFollow} like={likes} />
            <br />
            <br />
        </>
    )
}

export default FeedFeed
