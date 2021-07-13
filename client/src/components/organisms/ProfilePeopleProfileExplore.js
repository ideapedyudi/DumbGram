// ------------ react -------------
import { useState, useEffect, useContext } from 'react'

// ------------- Aos --------------
import { Row, Col, Navbar, Card, Button } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// -------------- style -------------
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

    const { ProfilePeopleExploreId } = useParams()

    const [state, dispatch] = useContext(UserContext);

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
            const response = await API.get(`user/${ProfilePeopleExploreId}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    // ---------------- feed -------------------
    const loadFeed = async () => {
        try {
            const response = await API.get(`/feedscount/${ProfilePeopleExploreId}`)
            setFeed(response.data.data.feeds.length)
        } catch (error) {
            console.log(error)
        }
    }

    // ------------- followers ---------------
    const loadFollower = async () => {
        try {
            const response = await API.get(`/followers/${ProfilePeopleExploreId}`)
            setFollower(response.data.data.id_user.follower.length)
        } catch (error) {
            console.log(error)
        }
    }

    // ------------ followings ---------------
    const loadFollowing = async () => {
        try {
            const response = await API.get(`/following/${ProfilePeopleExploreId}`)
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
            const find = likeFollow.find((data) => data.followings == ProfilePeopleExploreId)
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
        // console.log(ProfilePeopleExploreId)
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
                "followings": ProfilePeopleExploreId
            })

            await API.patch('/follow', body, config)

            loadUser()
            loadFollow()

        } catch (error) {
            console.log(error)
        }
    }

    // Load followFilter
    useEffect(() => {
        followFilter()
    }, [likeFollow])

    // Load loadLike
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
            {/* --------------------------- card profile people explore -------------------------- */}
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
                            <Button className="messege">Message</Button>&nbsp; &nbsp;
                            <Button className="Unfollow follow" onClick={handleUnfollow} content={followsId.id}>Unfollow</Button>
                        </span> :
                        <span>
                            <Button className="messege">Message</Button>&nbsp; &nbsp;
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
                        <p> <Link to={`/ProfilePeopleFeed/${user.id}`} className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-feeds" icon={faHome} /><span className="title-feeds">Feed</span></Link></p>
                        <p> <Link to={`/ProfilePeopleExplore/${user.id}`} className="title-feed-a"><FontAwesomeIcon className="ms-auto me-5 icon-explores" icon={faCompass} /><span className="title-explores">Explore</span></Link></p>
                    </div>

                    <div class="logoutPeople">
                        <p><FontAwesomeIcon className="ms-auto me-5 icon-logout" icon={faSignInAlt} /><span className="title-logout">Logout</span></p>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

export default ProfilPeopleProfilFeed

