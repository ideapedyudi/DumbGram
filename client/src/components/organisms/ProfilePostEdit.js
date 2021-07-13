// ------------ react ----------------
import { useContext, useState, useEffect } from 'react';

// ------------- Aos --------------
import { Row, Col, Navbar, Card } from 'react-bootstrap';

// -------- router -------------
import { Link } from "react-router-dom";

// ------------ style -------------
import '../style/CreatePostEdit.css';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faCompass } from '@fortawesome/free-regular-svg-icons';

// ------------- asset ------------
import DumbGram from '../asset/DumbGram.svg';
import Profile from '../asset/noname.png';

// userContext
import { UserContext } from "../contexts/UserContext";

// config
import { API } from '../config/api';

function ProfilePostEdit() {

    // feed
    const [feed, setFeed] = useState([])

    // follower
    const [follower, setFollower] = useState([])

    // following
    const [following, setFollowing] = useState([])

    // id user login
    const [state, dispatch] = useContext(UserContext);

    console.log(state.user)

    // logout
    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
    }

    // feed
    const loadFeed = async () => {
        try {
            const response = await API.get(`/feedscount/${state.user.id}`)
            setFeed(response.data.data.feeds.length)
        } catch (error) {
            console.log(error)
        }
    }


    // followers
    const loadFollower = async () => {
        try {
            const response = await API.get(`/followers/${state.user.id}`)
            setFollower(response.data.data.id_user.follower.length)
        } catch (error) {
            console.log(error)
        }
    }

    // followings
    const loadFollowing = async () => {
        try {
            const response = await API.get(`/following/${state.user.id}`)
            setFollowing(response.data.data.id_user.following.length)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadFeed()
    })

    useEffect(() => {
        loadFollower()
    })

    useEffect(() => {
        loadFollowing()
    })

    return (
        <>
            {/* --------------------------- card profile feed -------------------------- */}
            <Navbar bg="dark" className="bar">
                <Link to="/">
                    <img src={DumbGram} className="logos ms-4" alt="logo" />
                </Link>
            </Navbar>
            <Card className="bg-card text-center mt-3">
                <Link to="/EditProfilePage" className="ms-auto">
                    <FontAwesomeIcon className="ms-auto icon-edit me-5" icon={faEdit} />
                </Link>
                <Card.Body>
                    <Card.Text>
                        <div className="circle">
                            {state.user.bio === null ? < img src={Profile} className="logoprofile" alt="logo" /> : <img src={state.user.image} className="logoprofile" alt="logo" />}
                        </div>
                    </Card.Text>
                    <h3 className="namaprofile">{state.user.fullName}</h3>
                    <p className="namagm">{state.user.username}</p>
                    <Row className="mt-4 barfollow">
                        <Col lg={4} className="panel">
                            <p>Post</p>
                            <p className="jumlah">{feed}</p>
                        </Col>
                        <Col lg={4} className="panel">
                            <p>Followers</p>
                            <p className="jumlah">{follower}</p>
                        </Col>
                        <Col lg={4} className="panels">
                            <p>Following</p>
                            <p className="jumlah">{following}</p>
                        </Col>
                    </Row>
                    <p className="bio">{state.user.bio}</p>
                    <div class="menu">
                        <p> <Link to="/" className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-feed icon-fd" icon={faHome} /><span className="title-feed icon-fd">Feed</span></Link></p>
                        <p> <Link to="/explorepage" className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-explore" icon={faCompass} /><span className="title-explore">Explore</span></Link></p>
                    </div>

                    <div class="logout" onClick={handleLogout}>
                        <p><FontAwesomeIcon className="ms-auto me-5 icon-logout" icon={faSignInAlt} /><span className="title-logout">Logout</span></p>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default ProfilePostEdit

