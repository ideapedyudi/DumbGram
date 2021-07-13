// ------------- Bootstrap --------------
import { Navbar, InputGroup, FormControl, Button, Container, Form } from 'react-bootstrap';

// sweetalert
import swal from 'sweetalert';

// -------- router -------------
import { Link } from "react-router-dom";

// ----------- feed.css ----------------
import '../style/CreatePostEdit.css';
import Notifikasi from './Notifikasi';

// ------------- Aos -----------------
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState, useContext } from 'react';

// ------------- fontawesome -----------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import { UserContext } from "../contexts/UserContext";

// config
import { API } from '../config/api';

function CreatePost() {

    // useSate
    const [state, dispatch] = useContext(UserContext);
    const user = parseInt(`${state.user.id}`)

    // form pertama kali di load
    const [form, setForm] = useState({
        fileName: '',
        like: 0,
        userFeed: `${state.user.id}`,
        caption: ''
    })

    // view image upload
    const [preview, setPreview] = useState('')

    const { fileName, userFeed, caption } = form

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
        })

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
            console.log(url)
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
            formData.set("imageFile", form.fileName[0], form.fileName[0].name)
            formData.set("like", form.like)
            formData.set("userFeed", form.userFeed)
            formData.set("caption", form.caption)

            await API.post('/feed', formData, config)

            const response = await API.get('/check-auth')

            swal({
                title: "Good Job!",
                text: "Create Post Success",
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
                    <p className="JudulFeed">Create Post</p>
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
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    handleOnSubmit()
                }}>
                    {/* proview image upload */}
                    {preview && <img src={preview} className="img-fluid rounded" width="20%" />} <br />

                    <div class='file file--upload mt-2'>
                        <label for='input-file'>
                            <FontAwesomeIcon className="" icon={faFileUpload} /> &nbsp;Upload File
                        </label>
                        <input id='input-file' type='file' onChange={onChange} name="fileName" />
                    </div>
                    <br />
                    <Form.Control className="EditProfile text-white" type="hidden" onChange={onChange} name="userFeed" placeholder="userFeed" /> <br />
                    <Form.Control className="caption text-white" as="textarea" type="text" name="fileImage" onChange={onChange} name="caption" placeholder="Caption" required style={{ height: '170px' }} />
                    <Button type="submit" className="tbupload justify-content-center ms-lg-auto mt-4 uploadbtn">Upload</Button>
                </Form>
            </div>
            <br />
            <br />
        </>
    )
}

export default CreatePost
