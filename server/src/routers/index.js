const express = require('express')

const router = express.Router()

// middleware
const { auth } = require('../middleware/auth')
const { uploadFile } = require('../middleware/uploadFile')



//================================== ROUTER REGISTER DAN LOGIN  ====================================
const { registrasi } = require('../controllers/register')
const { login, checkAuth } = require('../controllers/login')

// router register
router.post('/register', registrasi)

// router login
router.post('/login', login)

// auth
router.get("/check-auth", auth, checkAuth);



//============================================ ROUTER USER ==========================================
const { getUsers, editUser, deleteUser, getUser, updateUser } = require('../controllers/user')

// router menampikan data
router.get('/users', getUsers)

// router menampikan data perameter
router.get('/user/:id', getUser)

// router edit data
router.patch('/user/:id', uploadFile("imageFile"), editUser)

// router hapus data
router.delete('/user/:id', deleteUser)

// router menampikan data
router.patch('/edtuser/:id', updateUser)



//============================================== ROUTER FOLLOW =========================================
const { followers, following, followByFollowers, Unfollow, addFollow } = require('../controllers/follow')

// router menampikan followers
router.get('/followers/:id', followers)

// router menampikan following
router.get('/following/:id', following)

// router menampikan followByFollowets
router.get('/follow/:id', followByFollowers)

// router Unfollow
router.delete('/unfollow/:id', Unfollow)

// router follow
router.patch('/follow', addFollow)


//=========================================== ROUTER FEED ===============================================
const { addFeed, followfeeds, allFeed, likelike, commentidfeed, addComment, getFeed, likeById, notifikasi, deleteComment } = require('../controllers/feed')

// router menambahkan feed
router.post('/feed', uploadFile("imageFile"), addFeed)

// router feed follow
router.get('/feed/:id', followfeeds)

// router all feed
router.get('/feeds', allFeed)

// router param feed
router.get('/feedscount/:id', getFeed)

// router like
router.post('/like', auth, likelike)

// router like parameter
router.get('/like/:id', likeById)

// router comment parameneter id feed
router.get('/comments/:id', commentidfeed)

// router add comment
router.post('/comment', addComment)

// router notifikasi
router.get('/notifikasi/:id', notifikasi)

// delete comment
router.delete("/comment/:id", deleteComment);



//=========================================== ROUTER MESSAGE ===============================================

const { addChat, messageWithId, historyChat } = require('../controllers/message')
// router message
router.get('/message-user/:id', auth, messageWithId)

// router add message
router.post('/message/:id', auth, addChat)


// router message
router.get('/history-chat', auth, historyChat)









// penutup router
module.exports = router