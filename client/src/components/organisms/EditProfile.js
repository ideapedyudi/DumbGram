// ------------- react -----------------
import { useContext, useState } from 'react';

// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Container, Form } from 'react-bootstrap';

// sweetalert
import swal from 'sweetalert';

// ----------- feed.css ----------------
import '../style/CreatePostEdit.css';
import '../style/EditProfile.css';
import Notifikasi from './Notifikasi';

// -------- router -------------
import { Link } from "react-router-dom";

// ------------- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

// useContext
import { UserContext } from "../contexts/UserContext";

// config
import { API } from '../config/api';


function EditProfile() {

    // id user login
    const [state, dispatch] = useContext(UserContext);

    // path image
    const path = "http://localhost:5000/uploads/"

    // form awal
    const [form, setForm] = useState({
        image: '',
        fullName: '',
        username: '',
        bio: ''
    })

    // view image upload
    const [preview, setPreview] = useState('')

    const { image, fullName, username, bio } = form

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
        })

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleOnSubmit = async () => {
        try {

            const config = {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }

            const formData = new FormData()
            formData.set("imageFile", form.image[0], form.image[0].name)
            formData.set("fullName", form.fullName)
            formData.set("username", form.username)
            formData.set("bio", form.bio)

            await API.patch(`/user/${state.user.id}`, formData, config)

            const response = await API.get('/check-auth')

            swal({
                title: "Good Job!",
                text: "Edit Profile Success",
                className: "red-bg",
                button: false,
            });

            let payload = response.data.data.user
            payload.token = localStorage.token

            dispatch({
                type: "USER_SUCCESS",
                payload
            })

        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async () => {
        try {

            const response = await API.get(`user/${state.user.id}`)
            const user = response.data.data.user

            // form isi data
            setForm({
                image: user.image,
                fullName: user.fullName,
                username: user.username,
                bio: user.bio
            })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [state.user.id])

    // aos duration
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])
    return (
        <>
            {/* navbar feed */}
            <Navbar fixed="top" className="bartpostnotif">
                <Container>
                    <InputGroup.Prepend>
                        <InputGroup.Text className="icon-serch-feed" id="basic-addon1"><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl className="cariFeeds" placeholder="Search" />
                    <p className="JudulFeed">Edit Profile</p>
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

            {/* image feed */}
            <div className="masoryholders" data-aos="fade-up"> <br />
                {/* <Button className="tbupload justify-content-center">Upload Photo</Button> */}
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    handleOnSubmit()
                }}> <br />
                    <div>
                        {/* proview image upload */}
                        {preview ? <img src={preview} className="img-fluid rounded" width="20%" /> :
                            <img src={path + image} className="img-fluid rounded" width="15%" />
                        } <br />
                        <div class='file file--upload mt-2'>
                            <label for='input-file'>
                                <FontAwesomeIcon className="" icon={faFileUpload} /> &nbsp;Upload File
                            </label>
                            <input id='input-file' type='file' onChange={handleOnChange} name="image" />
                        </div>
                        <br />
                        <Form.Control className="EditProfile text-white" onChange={handleOnChange} value={fullName} name="fullName" type="text" placeholder="Name" /> <br />
                        <Form.Control className="EditProfile text-white" onChange={handleOnChange} value={username} name="username" type="text" placeholder="Username" /> <br />
                    </div>
                    <Form.Control className="captionss text-white" onChange={handleOnChange} value={bio} name="bio" placeholder="Bio" />
                    <Button type="submit" className="tbupload justify-content-center mt-4 ms-lg-auto uploadbtn">Save</Button>
                </Form>
            </div>
            <br />
            <br />
        </>
    )
}

export default EditProfile

