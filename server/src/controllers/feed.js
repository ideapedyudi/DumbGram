// memanggil model tabel database
const { user, feed, follow, like, comment } = require('../../models')

// joi
const joi = require('joi')

// ============================================= tambah data feed =================================================
exports.addFeed = async (req, res) => {
    try {
        // // id user
        // const { idUser } = req

        // // menangkap body
        // let { fileName, caption } = req.body

        // const feedData = await feed.create({
        //     fileName,
        //     caption,
        //     userFeed: idUser
        // })

        const data = req.body;
        const fileName = req.files.imageFile[0].filename

        const dataUpload = {
            ...data,
            fileName
        }

        await feed.create(dataUpload)

        res.send({
            status: "success",
            message: "Upload product data success"
        })

        // error server
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}


// ====================================== meampilkan semua feed follow ========================================
exports.followfeeds = async (req, res) => {
    try {

        // id link
        const { id } = req.params

        // menampilkan semua data
        const userData = await user.findOne({
            // mengecualikan jika tidak ingin di tampilkan
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'bio', 'email', 'image', 'username', 'fullName', 'id']
            },
            where: {
                id
            },
            include: {
                model: follow,
                as: 'following',
                include: {
                    model: user,
                    as: 'following',
                    include: {
                        model: feed,
                        as: 'feed',
                        include: {
                            model: user,
                            as: 'user',
                            attributes: {
                                exclude: ['updatedAt', 'bio', 'password', 'email']
                            }
                        },
                        order: [["createdAt", "DESC"]],
                        attributes: {
                            exclude: ['updatedAt']
                        }
                    },
                    order: [["createdAt", "DESC"]],
                    attributes: {
                        exclude: ['updatedAt', 'bio', 'password', 'email', 'fullName', 'image', 'username']
                    }
                },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['updatedAt', 'followers', 'followings']
                }
            },
            order: [["createdAt", "DESC"]]
        })

        // tampikan ketika berhasil
        res.send({
            status: 'success',
            data: {
                userData
            }
        })

        // tampilkan ketika server eror
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'

        })
    }
}




// ======================================= meampilkan semua feed all =========================================
exports.allFeed = async (req, res) => {
    try {

        const path = process.env.PATH_UPLOAD

        // menampilkan semua data
        let allfeed = await feed.findAll({
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'password', 'email']
                }
            },
            order: [
                ['id', 'DESC'],
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        const parseJSON = JSON.parse(JSON.stringify(allfeed))

        allfeed = parseJSON.map(item => {
            return {
                ...item,
                image: path + item.fileName
            }
        })

        // tampikan ketika berhasil
        res.send({
            status: 'success',
            message: 'user successfully get',
            data: {
                feeds: allfeed
            }
        })

        // tampilkan ketika server eror
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}



// ================================================= like ===========================================
exports.likelike = async (req, res) => {
    try {
        // token
        const { idUser } = req

        // mendapatkan data body
        const { id } = req.body

        // cek inputan
        const schema = joi.object({
            id: joi.number().required()
        }).validate(req.body)


        // jika tidak memebuhi
        if (schema.error) {
            return res.send({
                status: 'validation failed',
                message: schema.error.details[0].message
            })
        }

        // mengecek apakah id ada di feed
        const checkId = await feed.findOne({
            where: {
                id
            }
        })

        // mencari emaail ada atau tidak
        if (!checkId) {
            return res.send({
                status: 'failed',
                message: "id feed not found"
            })
        }

        // cek jika udah like atau belum
        const check = await like.findOne({
            where: {
                idUser: idUser,
                idFeed: id
            }
        })

        if (check) {
            await like.destroy({ where: { idFeed: id, idUser: idUser } })
            // cek if feed
            const datas = await feed.findOne({
                where: {
                    id
                }
            })

            // menambhkan 1 dan update like feed
            const likes = datas.like - 1
            await feed.update({ like: likes }, {
                where: {
                    id
                }
            })

            res.send({
                status: 'success',
                id
            })
        } else {
            // cek if feed
            const data = await feed.findOne({
                where: {
                    id
                }
            })

            // tambahkan data ke like
            await like.create({
                idFeed: id,
                idUser: idUser
            })

            // menambhkan 1 dan update like feed
            const likes = data.like += 1
            await feed.update({ like: likes }, {
                where: {
                    id
                }
            })

            res.send({
                status: 'success',
                id
            })
        }


        // tampil ketika server error
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// --------------------- id like ----------------------
exports.likeById = async (req, res) => {
    try {

        const { id } = req.params

        const likes = await like.findAll({
            where: {
                idUser: id
            }
        })

        if (!likes) {
            return res.send({
                status: 'failed',
                message: 'No Likes'
            })
        }

        res.send({
            status: 'success',
            like: likes
        })


    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}



// ================================================= comment ===========================================
// ---------------- meampilkan coment berdasarkan idfeed -----------------------
exports.commentidfeed = async (req, res) => {
    try {

        const { id } = req.params

        // menampilkan semua data
        const comments = await comment.findAll({
            // mengecualikan jika tidak ingin di tampilkan
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idfeed', 'iduser']
            },
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'password', 'email']
                }
            },
            where: {
                idfeed: id
            },
            order: [
                ['id', 'DESC'],
            ],
        })

        // tampikan ketika berhasil
        res.send({
            status: 'success',
            data: {
                comments
            }
        })

        // tampilkan ketika server eror
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'

        })
    }
}


// -------------------------- add comment ---------------------------
exports.addComment = async (req, res) => {
    try {
        const { body } = req

        await comment.create(body)

        res.send({
            status: 'success',
            message: 'User Successfully Add'
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}

// --------------------------- delete comment -------------------------
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params

        await comment.destroy({
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: 'User successfully Delete',
            data: {
                id
            }
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}

// -------------------------- comment feed notifikasi ---------------------------
exports.notifikasi = async (req, res) => {
    try {

        const { id } = req.params

        // menampilkan semua data
        const notifikasi = await comment.findAll({
            where: {
                userFeed: id
            },
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'password', 'email']
                }
            },
            order: [
                ['id', 'DESC'],
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        // tampikan ketika berhasil
        res.send({
            status: 'success',
            data: {
                notifikasi
            }
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error',
        })
    }
}



// =================================== meampilkan sesuai parameter feed ==================================
exports.getFeed = async (req, res) => {
    try {

        // menampilkan id dari token
        // const { idUser } = req

        const { id } = req.params

        // menampilkan semua data
        const feeds = await feed.findAll({
            where: {
                userFeed: id
            },
            include: {
                model: user,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'password', 'email']
                }
            },
            order: [
                ['id', 'DESC'],
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        // tampikan ketika berhasil
        res.send({
            status: 'success',
            data: {
                feeds
            }
        })

        // ketika server erorr
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}