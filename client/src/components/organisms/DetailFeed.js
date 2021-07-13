// -------------- react -------------
import { useState, useEffect, useContext } from 'react'

// ------------- Bootstrap -------------
import { Modal, Card, Col, Row, Form, Navbar, Container } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ------------ style -------------
import '../style/DetailFeed.css';
import { Tooltip } from 'antd';

// ------------- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";

// ------------ asset --------------
import Rectagle2 from '../asset/Rectangle 10.jpg';
import Profile from '../asset/zeny.png';
import ProfileComent from '../asset/Rectangle 4.jpg';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faPaperPlane, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

// ----------- component -----------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';
const path = "http://localhost:5000/uploads/"


function DetailFeed({ show, handleClose, feedsid, loadFeedFollow }) {

    // useState
    const [state, dispatch] = useContext(UserContext);
    const [users, setUsers] = useState({})
    const [Comments, setComments] = useState([])
    const [commentid, getCommentById] = useState({})

    // -------------------- user feed -----------------------
    const loadUsers = async () => {
        try {
            const response = await API.get(`user/${feedsid.userFeed}`)
            setUsers(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    // ------------------- coment ---------------------------
    const loadComments = async () => {
        try {
            const response = await API.get(`comments/${feedsid.id}`)
            setComments(response.data.data.comments)
        } catch (error) {
            console.log(error)
        }
    }

    // ------------------- add coment ---------------------------
    const [form, setForm] = useState({
        comment: ''
    })

    const { comment } = form

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // enter comment
    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }

        const body = JSON.stringify({
            ...form,
            idfeed: `${feedsid.id}`,
            userfeed: `${feedsid.userFeed}`,
            iduser: `${state.user.id}`
        })

        const response = await API.post('/comment', body, config)

        loadComments()
        loadUsers()
        setForm({
            comment: '',
        })
    }

    // delete comment
    const handleComment = (event) => {
        loadFeedFollow()
        loadComments()
        const ids = event.target.getAttribute('content');
        commsnt(ids);
        console.log(ids)
    }

    const commsnt = async (ids) => {
        try {
            console.log(ids)
            await API.delete(`/comment/${ids}`)

            loadFeedFollow()
            loadLike()
            loadComments()
        } catch (error) {
            console.log(error);
        }
    }

    // like
    const [likeUser, setLikeUser] = useState([])
    const [likes, setLike] = useState()


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

            const find = likeUser.find((data) => data.idFeed == feedsid.id)
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
            comment.value = ""
        } catch (error) {
            console.log(error);
        }
    }

    // tooltip
    const Comment = <span>Comment</span>;
    const Hapus = <span>Hapus</span>;
    const Plane = <span>Share</span>;
    const Dislike = <span>Dislike</span>;
    const Like = <span>Like</span>;
    const Detail = <span>Detail</span>;

    // Load loadLike
    useEffect(() => {
        loadLike()
    }, [loadFeedFollow])

    // Load likeFilter
    useEffect(() => {
        likeFilter()
    }, [likeUser])

    // Load comment
    useEffect(() => {
        loadComments()
    }, [feedsid])

    // Load user
    useEffect(() => {
        loadUsers()
    }, [feedsid])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])

    return (
        <div>
            {/* ------------------------------ modal detail feed ------------------------------ */}
            <Modal show={show} onHide={handleClose} className="modalleft">
                <Modal.Body className="modallg">
                    <Row>


                        {/* feed gambar */}
                        <Col lg={7} sm={7} className="gambarfeed">

                            <img src={path + feedsid.fileName} className="gambardetail" data-aos="zoom-in" />
                        </Col>


                        {/* feed coment */}
                        <Col lg={4} sm={4}>
                            <Card style={{ width: '17rem' }} className="cardcoment">
                                <div className="circlement">
                                    <Link to={`/ProfilePeopleFeed/${users.id}`}>
                                        <Card.Img variant="top" src={path + users.image} className="profilement mlprof" />
                                    </Link>
                                </div>
                                <p className="nameprofilement">{users.fullName}</p>
                                <p className="captioncoment">{feedsid.caption}</p>
                                <hr className="garis" />

                                {/* ----- coment ---- */}
                                <div className="pagecpmment">
                                    <Col className="commentloop">
                                        {Comments?.map((comment, index) => (
                                            <div className="coment">
                                                <div className="circlement">
                                                    <Card.Img variant="top" src={path + comment.user.image} className="profilement" />
                                                    {comment.user.id == `${state.user.id}` ?
                                                        <Tooltip placement="top" title={Hapus}>
                                                            <FontAwesomeIcon className="mr-auto iconfaTrashAlt cursorfeed" icon={faTrashAlt} onClick={handleComment} content={comment?.id} onDoubleClick={comment?.id} />
                                                        </Tooltip> :
                                                        <p> </p>
                                                    }
                                                </div>
                                                <p className="nameprofilement mtComment">{comment.user.fullName}</p>
                                                <p className="captioncoment">{comment.comment}</p>
                                            </div>
                                        ))}
                                    </Col>
                                </div>

                                {/* form coment */}
                                <div className="commentInput">
                                    <Form className="inputcoment" onSubmit={handleSubmit}>
                                        <Navbar className="iconment">
                                            <Container>
                                                <Navbar.Collapse className="justify-content-end">
                                                    <Navbar.Text className="icon3">
                                                        {likes ?
                                                            <Tooltip placement="bottom" title={Dislike}>
                                                                <FontAwesomeIcon className="card-icon heart cursorfeed text-danger" onClick={handleLike} content={feedsid?.id} icon={faHeart} />
                                                            </Tooltip> :
                                                            <Tooltip placement="bottom" title={Like}>
                                                                <FontAwesomeIcon className="card-icon heart cursorfeed" onClick={handleLike} content={feedsid?.id} icon={faHeart} />
                                                            </Tooltip>
                                                        }
                                                        <Tooltip placement="bottom" title={Comment}>
                                                            <FontAwesomeIcon className="card-icon comment cursorfeed" icon={faComment} />
                                                        </Tooltip>
                                                        <Tooltip placement="bottom" title={Plane}>
                                                            <FontAwesomeIcon className="card-icon cursorfeed cursorfeed" icon={faPaperPlane} />
                                                        </Tooltip>
                                                    </Navbar.Text>
                                                </Navbar.Collapse>
                                            </Container>
                                        </Navbar>
                                        <Navbar>
                                            <Container>
                                                <Navbar.Collapse className="justify-content-end">
                                                    <Navbar.Text className="likements">
                                                        <span>{feedsid.like} Like</span>
                                                    </Navbar.Text>
                                                </Navbar.Collapse>
                                            </Container>
                                        </Navbar>
                                        <Form.Control className="form-controls inputcoment" value={comment} id="comment" onChange={handleOnChange} name="comment" type="text" placeholder="Comment" autocomplete="off" onFocus required /> <br />
                                    </Form>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default DetailFeed




