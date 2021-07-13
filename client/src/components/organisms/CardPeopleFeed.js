// ---------------- react ----------------
import { useEffect, useState, useContext } from 'react';

// ------------- Bootstrap --------------
import { Navbar, Card } from 'react-bootstrap';

// ----------- feed.css ----------------
import '../style/ProfilPeopleFeed.css';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// ----------- component -----------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';
const path = "http://localhost:5000/uploads/"

function CardPeopleFeed({ feed, loadFeeds }) {
    // like
    const [likeUser, setLikeUser] = useState([])
    const [likes, setLike] = useState()

    // useState
    const [state, dispatch] = useContext(UserContext);

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

            const find = likeUser.find((data) => data.idFeed == feed.id)
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

            loadFeeds()
            loadLike()
        } catch (error) {
            console.log(error);
        }
    }

    // Load 
    useEffect(() => {
        loadLike()
    }, [loadFeeds])

    // Load 
    useEffect(() => {
        likeFilter()
    }, [likeUser])
    return (
        <div>
            <Card.Body>
                <Card.Text className="card-bodys">
                    <Navbar class="prof-box">
                        <Navbar.Brand href="#home" className="card-box-profile">
                            <img src={path + feed.user.image} className="card-profiles" alt="logo" />
                        </Navbar.Brand>
                        <Navbar.Text className="ms-auto">
                            {likes ?
                                <FontAwesomeIcon className="card-icon heart cursorfeed text-danger" onClick={handleLike} content={feed?.id} icon={faHeart} /> :
                                <FontAwesomeIcon className="card-icon heart cursorfeed" onClick={handleLike} content={feed?.id} icon={faHeart} />
                            }
                            <FontAwesomeIcon className="card-icon comment cursorfeed" icon={faComment} />
                            <FontAwesomeIcon className="card-icon cursorfeed cursorfeed" icon={faPaperPlane} />
                        </Navbar.Text>
                    </Navbar>
                    <p className="nama-post">{feed.user.fullName}</p>
                </Card.Text>
                <Navbar className="navlike">
                    <Navbar.Text className="ms-auto">
                        <p className="jmllike">{feed.like} Like</p>
                    </Navbar.Text>
                </Navbar>
            </Card.Body>
        </div>
    )
}

export default CardPeopleFeed
