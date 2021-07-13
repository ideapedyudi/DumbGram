import { useContext, useState, useEffect } from 'react';

// ------------- Aos --------------
import { Row, Col, Navbar, Card } from 'react-bootstrap';

// -------- router -------------
import { Link } from "react-router-dom";

// ------------ style -------------
import '../style/Explore.css';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";

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

function ProfileFeed() {

    // feed
    const [feed, setFeed] = useState([])

    // follower
    const [follower, setFollower] = useState([])

    // following
    const [following, setFollowing] = useState([])

    // id user login
    const [state, dispatch] = useContext(UserContext);

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

    // load loadFeed
    useEffect(() => {
        loadFeed()
    })

    // load loadFollower
    useEffect(() => {
        loadFollower()
    })

    // load loadFollowing
    useEffect(() => {
        loadFollowing()
    })

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])

    return (
        <>
            {/* --------------------------- card profile explore -------------------------- */}
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
                        <div className="circle" data-aos="zoom-in">
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
                        <p> <Link to="/" className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-feeds" icon={faHome} /><span className="title-feeds">Feed</span></Link></p>
                        <p> <Link to="/explorepage" className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-explores" icon={faCompass} /><span className="title-explores">Explore</span></Link></p>
                    </div>

                    <div class="logout" onClick={handleLogout}>
                        <p><FontAwesomeIcon className="ms-auto me-5 icon-logout" icon={faSignInAlt} /><span className="title-logout">Logout</span></p>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default ProfileFeed
