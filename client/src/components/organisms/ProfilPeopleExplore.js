// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Col, Card, Container } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ----------- Explore.css ----------------
import '../style/Explore.css';
import Notifikasi from './Notifikasi';

// ------------- Aos --------------
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from 'react';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// ----------- component -----------
import { API } from '../config/api';
const path = "http://localhost:5000/uploads/"

function ProfilPeopleExplore() {

    // params
    const { ProfilePeopleExploreId } = useParams()

    // user
    const [user, setUser] = useState({})

    // ---------------- user -----------------
    const loadUser = async () => {
        try {
            const response = await API.get(`user/${ProfilePeopleExploreId}`)
            setUser(response.data.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    // useState
    const [feeds, setFeeds] = useState([])

    // load Feed
    const loadFeed = async () => {
        try {
            const response = await API.get('feeds')
            setFeeds(response.data.data.feeds)
            console.log(response.data.data.feeds)
        } catch (error) {
            console.log(error)
        }
    }

    // Load data ketika pertama kali
    useEffect(() => {
        loadFeed()
    }, [])

    useEffect(() => {
        loadUser()
    }, [])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])
    return (
        <>
            {/* --------------------------- navigasi people explore -------------------------- */}
            <Navbar fixed="top" className="bartpostnotif">
                <Container>
                    <InputGroup.Prepend>
                        <InputGroup.Text className="icon-serch-feed" id="basic-addon1"><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl className="cariFeeds" placeholder="Search" />
                    <p className="JudulFeed">{user.fullName}, Explore</p>
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

export default ProfilPeopleExplore
