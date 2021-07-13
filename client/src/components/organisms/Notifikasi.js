import { useEffect, useState, useContext } from 'react';

// ------------- Bootstrap --------------
import { Card } from 'react-bootstrap';

// ------------ ant design ------------
import { Popover } from 'antd';
import 'antd/dist/antd.css';

// ------------- fontawesome -----------
import '../style/Notifikasi.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, } from '@fortawesome/free-regular-svg-icons';

// ------------- asset -------------
import Profile from '../asset/Rectangle 4.jpg';

// ----------- Component ------------
import { UserContext } from "../contexts/UserContext";
import { API } from '../config/api';
import Loader from "../../../node_modules/react-loader-spinner";

// path
const path = "http://localhost:5000/uploads/";



function Notifikasi() {

    const [state, dispatch] = useContext(UserContext);

    // useState
    const [notifs, setNotifs] = useState([])

    // load Feed
    const loadNotif = async () => {
        try {
            const response = await API.get(`notifikasi/${state.user.id}`)
            setNotifs(response.data.data.notifikasi)
        } catch (error) {
            console.log(error)
        }
    }

    // Load data ketika pertama kali
    useEffect(() => {
        loadNotif()
    }, [])

    const content = (
        <div className="cont">
            {notifs.map((notifikasi, index) => (
                <Card style={{ width: '12rem' }} className="cardnotif">
                    <div className="starttif">
                        <div className="ovalnotif">
                            <Card.Img className="profilnotif" variant="top" src={path + notifikasi.user.image} />
                        </div>
                        <Card.Body className="titlenotif">
                            <Card.Text className="namenotif">
                                {notifikasi.user.fullName}
                            </Card.Text>
                            <Card.Text>
                                Komentar : <span className="komentnotif">{notifikasi.comment}</span>
                            </Card.Text>
                        </Card.Body>
                    </div>
                </Card>
            ))}
        </div>
    );
    return (
        <div>
            <Popover placement="bottomRight" content={content} trigger="click">
                <FontAwesomeIcon className="icon-Notifikasi ms-3" icon={faBell} />
            </Popover>
        </div>
    )
}

export default Notifikasi
