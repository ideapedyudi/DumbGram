// memanggil model tabel database
const { user, follow } = require('../../models')
// const follow = require('../../models/follow')

// =================================== meampilkan semua data di database ==================================
exports.getUsers = async (req, res) => {
    try {

        // menampilkan id dari token
        // const { idUser } = req

        // menampilkan semua data
        const users = await user.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        // tampikan ketika berhasil
        res.send({
            status: 'success',
            data: {
                users
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


// ================================================= edit data ==============================================
exports.editUser = async (req, res) => {
    try {

        // id mana yang ingin kita update
        const { id } = req.params

        // data body
        const data = req.body;
        const image = req.files.imageFile[0].filename

        // cek id
        const checkId = await user.findOne({
            where: {
                id
            }
        })

        // jika id tidak ada
        if (!checkId) {
            return res.send({
                status: 'failed',
                message: `user with id: ${id} not found`
            })
        }

        const dataUpload = {
            ...data,
            image
        }

        // proses update
        await user.update(dataUpload,
            {
                where: {
                    id
                }
            })

        // menampilkan data saat sudah di update 
        const dataUpdate = await user.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            },
            where: { id }
        })

        // berhasil
        res.send({
            status: 'success',
            data: {
                user: dataUpdate
            }
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


// =============================================== hapus data ===========================================
exports.deleteUser = async (req, res) => {
    try {
        // mengambil id
        const { id } = req.params

        // ketemu id hapus ada
        const deleteData = await user.destroy({
            where: {
                id
            }
        })

        if (!deleteData) {
            return res.send({
                status: 'failed',
                message: 'id not found'
            })
        }

        // berhasil
        res.send({
            status: 'success',

            data: {
                id
            }
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

exports.getUser = async (req, res) => {
    try {

        const { id } = req.params

        const path = process.env.PATH_UPLOAD

        const userData = await user.findOne({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            },
            where: {
                id
            }
        })

        res.send({
            status: 'success',
            message: 'User Successfully Get Detail',
            data: {
                user: {
                    username: userData.username,
                    email: userData.email,
                    fullName: userData.fullName,
                    bio: userData.bio,
                    id: userData.id,
                    image: userData.image,
                }
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

// edit
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req

        const checkId = await user.findOne({
            where: {
                id
            }
        })

        // check id user
        if (!checkId) {
            return res.send({
                status: 'failed',
                message: `User with id: ${id} not found`
            })
        }

        // Proses update
        await user.update(body,
            {
                where: {
                    id
                }
            })

        const dataUpdate = await user.findOne(
            {
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                },
                where: {
                    id
                }
            })

        res.send({
            status: 'success',
            message: 'User Successfully Add',
            data: {
                user: dataUpdate
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