// ------------ react -------------
import { useState, useEffect, useContext } from 'react'

// ------------- Aos --------------
import { Row, Col, Navbar, Card, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ------------- style -------------
import '../style/ProfilePeople.css';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-regular-svg-icons';

// ------------- asset ------------
import DumbGram from '../asset/DumbGram.svg';

// ----------- component -----------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';
const path = "http://localhost:5000/uploads/"

function ProfilPeopleProfilFeed() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [state, dispatch] = useContext(UserContext);

    // ---------- useState ---------
    // params
    const { ProfilePeopleFeedId } = useParams()

    // user
    const [user, setUser] = useState({})

    // feed
    const [feed, setFeed] = useState([])

    // follower
    const [follower, setFollower] = useState([])

    // following
    const [following, setFollowing] = useState([])

    // follow
    const [likeFollow, setFollow] = useState([])
    const [follows, setFollowers] = useState()
    const [followsId, setFollowersId] = useState('')

    // ---------------- user -----------------
    const loadUser = async () => {
        try {
            const response = await API.get(`user/${ProfilePeopleFeedId}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    // ---------------- feed -------------------
    const loadFeed = async () => {
        try {
            const response = await API.get(`/feedscount/${ProfilePeopleFeedId}`)
            setFeed(response.data.data.feeds.length)
        } catch (error) {
            console.log(error)
        }
    }

    // ------------- followers ---------------
    const loadFollower = async () => {
        try {
            const response = await API.get(`/followers/${ProfilePeopleFeedId}`)
            setFollower(response.data.data.id_user.follower.length)
        } catch (error) {
            console.log(error)
        }
    }

    // ------------ followings ---------------
    const loadFollowing = async () => {
        try {
            const response = await API.get(`/following/${ProfilePeopleFeedId}`)
            setFollowing(response.data.data.id_user.following.length)
        } catch (error) {
            console.log(error)
        }
    }

    // -------------------- follow ------------------------------
    const loadFollow = async () => {
        try {
            const response = await API.get(`/follow/${state.user.id}`)
            setFollow(response.data.follow)
        } catch (error) {
            console.log(error);
        }
    }

    const followFilter = async () => {
        try {
            const find = likeFollow.find((data) => data.followings == ProfilePeopleFeedId)
            setFollowersId(find)
            if (find) {
                setFollowers(true)
            } else {
                setFollowers(false)
            }


        } catch (error) {
            console.log(error);
        }
    }

    // delete comment
    const handleUnfollow = async (event) => {
        const id = event.target.getAttribute('content');
        try {
            await API.delete(`unfollow/${id}`)
            loadUser()
            loadFollow()
        } catch (error) {
            console.log(error)
        }
    }

    const handlefollow = async (e) => {
        // console.log(ProfilePeopleFeedId)
        // console.log(`${state.user.id}`)
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                "followers": `${state.user.id}`,
                "followings": ProfilePeopleFeedId
            })

            await API.patch('/follow', body, config)

            loadUser()
            loadFollow()

        } catch (error) {
            console.log(error)
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

            await API.post(`/message/${ProfilePeopleFeedId}`, body, config)
            handleClose()
            setForm(
                {
                    Message: ''
                }
            )

        } catch (error) {
            console.log(error)
        }
    }


    // Load followFilter
    useEffect(() => {
        followFilter()
    }, [likeFollow])

    // Load loadFollow
    useEffect(() => {
        loadFollow()
    }, [])

    // Load data ketika pertama kali
    useEffect(() => {
        loadUser()
    }, [])

    // load loadFollower
    useEffect(() => {
        loadFollower()
    })

    // load loadFeed
    useEffect(() => {
        loadFeed()
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
            {/* --------------------------- card profile people feed -------------------------- */}
            <Navbar bg="dark" className="bar logogram">
                <Link to="/">
                    <img src={DumbGram} className="logos ms-4 mt-5" alt="logo" />
                </Link>
            </Navbar>
            <Card className="bg-card text-center mt-3">
                <Card.Body>
                    <Card.Text>
                        <div className="circle mt-4" data-aos="zoom-in">
                            <img src={path + user.image} className="logoprofile" alt="logo" />
                        </div>
                    </Card.Text>
                    <h3 className="namaprofile">{user.fullName}</h3>
                    <p className="namagm">{user.username}</p>
                    {follows ?
                        <span>
                            <Button className="messege btnMessage" onClick={handleShow}>Message</Button>&nbsp; &nbsp;
                            <Button className="Unfollow follow" onClick={handleUnfollow} content={followsId.id}>Unfollow</Button>
                        </span> :
                        <span>
                            <Button className="messege btnMessage">Message</Button>&nbsp; &nbsp;
                            <Button className="Unfollow follow" onClick={handlefollow}>follow</Button>
                        </span>
                    }
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
                    <p className="bio">{user.bio}</p>
                    <div class="menus">
                        <p> <Link to={`/ProfilePeopleFeed/${user.id}`} className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-feed" icon={faHome} /><span className="title-feed">Feed</span></Link></p>
                        <p> <Link to={`/ProfilePeopleExplore/${user.id}`} className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-explore" icon={faCompass} /><span className="title-explore">Explore</span></Link></p>
                    </div>

                    <div class="logoutPeople">
                        <p><FontAwesomeIcon className="ms-auto me-5 icon-logout" icon={faSignInAlt} /><span className="title-logout">Logout</span></p>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={show} onHide={handleClose} className="modalMesaage">
                <Modal.Body>
                    <Form onSubmit={handleOnSubmit}>
                        <h5 className="text-white mb-4">Send Message</h5>
                        <InputGroup className="mb-3">
                            <FormControl className="messagePeople" onChange={handleOnChange} value={Message} name="Message" type="text" placeholder="Write Message" aria-label="Recipient's username" aria-describedby="basic-addon2" autoComplete="off" required />
                            <InputGroup.Append>
                                <Button className="messageButton" variant="outline-secondary mr-2" type="submit">Send</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ProfilPeopleProfilFeed

