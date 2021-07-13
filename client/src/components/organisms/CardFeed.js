// ------------- Bootstrap --------------
import { Navbar, Card } from 'react-bootstrap';

// ----------- feed.css ----------------
import '../style/Feed.css';
import { Tooltip } from 'antd';

// ------------- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState, useContext } from 'react';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane, faHeart } from '@fortawesome/free-regular-svg-icons';

// ----------- Component ------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';

function CardFeed({ feedFol, loadFeedFollow }) {

    // useState
    const [state, dispatch] = useContext(UserContext);

    // path
    const path = "http://localhost:5000/uploads/";

    // like
    const [likeUser, setLikeUser] = useState([])
    const [likes, setLike] = useState()

    // -------------------------------- like ----------------------------------------
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

            const find = likeUser.find((data) => data.idFeed == feedFol.id)
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
            loadLike()
        } catch (error) {
            console.log(error);
        }
    }

    const Comment = <span>Comment</span>;
    const Plane = <span>Share</span>;
    const Dislike = <span>Dislike</span>;
    const Like = <span>Like</span>;


    // Load 
    useEffect(() => {
        loadLike()
    }, [loadFeedFollow])

    // Load 
    useEffect(() => {
        likeFilter()
    }, [likeUser])

    // aos
    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, [])

    return (
        <div>
            <Card.Body>
                <Card.Text className="card-bodys">
                    <Navbar class="prof-box">
                        <Navbar.Brand href="#home" className="card-box-profile">
                            <img src={path + feedFol.user.image} className="card-profiles" alt="logo" />
                        </Navbar.Brand>
                        <Navbar.Text className="ms-auto">
                            {likes ?
                                <Tooltip placement="bottom" title={Dislike}>
                                    <FontAwesomeIcon className="card-icon heart cursorfeed text-danger" onClick={handleLike} content={feedFol?.id} icon={faHeart} />
                                </Tooltip> :
                                <Tooltip placement="bottom" title={Like}>
                                    <FontAwesomeIcon className="card-icon heart cursorfeed" onClick={handleLike} content={feedFol?.id} icon={faHeart} />
                                </Tooltip>
                            }
                            <Tooltip placement="bottom" title={Comment}>
                                <FontAwesomeIcon className="card-icon comment cursorfeed" icon={faComment} />
                            </Tooltip>
                            <Tooltip placement="bottom" title={Plane}>
                                <FontAwesomeIcon className="card-icon cursorfeed cursorfeed" icon={faPaperPlane} />
                            </Tooltip>

                        </Navbar.Text>
                    </Navbar>
                    <p className="nama-post">{feedFol.user.fullName}</p>
                </Card.Text>
                <Navbar className="navlike">
                    <Navbar.Text className="ms-auto">
                        <p className="jmllike">{feedFol.like} Like</p>
                    </Navbar.Text>
                </Navbar>
            </Card.Body>
        </div>
    )
}

export default CardFeed
