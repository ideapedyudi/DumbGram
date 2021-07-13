import { useEffect, useState } from 'react';

// ------------- Bootstrap --------------
import { Row, Col } from 'react-bootstrap';

// -------- router -------------
import { Link, useParams } from "react-router-dom";

// ------------- profile people ------------
import ProfilePeopleProfilFeed from "../organisms/ProfilePeopleProfilFeed";

// ------------- profile feed ------------
import ProfilPeopleFeed from "../organisms/ProfilPeopleFeed";

// ------------ ant design ------------
import { Popover } from 'antd';
import 'antd/dist/antd.css';
// ------------ config -------------
import { API } from '../config/api';

function ProfilePeopleFeed() {

    const { ProfilePeopleFeedId } = useParams()

    // users
    const [users, setUsers] = useState([])

    // user
    const [feedss, setFeeds] = useState([])

    // ---------------- user -----------------
    const loadFeeds = async () => {
        try {
            const response = await API.get(`feedscount/${ProfilePeopleFeedId}`)
            setFeeds(response.data.data.feeds)
        } catch (error) {
            console.log(error)
        }
    }


    // -------------------- user -----------------------
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

    // Load user
    useEffect(() => {
        loadFeeds()
    }, [])
    return (
        <div>
            <Row>
                {/* -------------------------- ProfilePeopleProfilFeed -----------------------  */}
                <Col lg={4} className="profile" fixed="top">
                    <ProfilePeopleProfilFeed />
                </Col>

                {/* -------------------------- ProfilPeopleFeed -----------------------  */}
                <Col lg={8} className="feed">
                    <ProfilPeopleFeed users={users} feedss={feedss} loadFeeds={loadFeeds} />
                </Col>
            </Row>
        </div >
    )
}

export default ProfilePeopleFeed

