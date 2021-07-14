// memanggil model tabel database
const { user } = require('../../models')

// joi
const joi = require('joi')

// bcrypt
const bcrypt = require('bcrypt')

// jwt
const jwt = require('jsonwebtoken')

// login
exports.login = async (req, res) => {
    try {

        const path = process.env.PATH_UPLOAD

        const { email, password } = req.body
        const data = req.body

        // skema pengecekan inputan
        const schema = joi.object({
            email: joi.string().email().min(6).required(),
            password: joi.string().min(8).required()
        })

        // jika validasi tidak memenuhi
        const { error } = schema.validate(data)

        // jika tidak memebuhi
        if (error) {
            return res.send({
                status: 'validation failed',
                message: error.details[0].message
            })
        }

        // mengecek apakah email sudah terdaftar atau belum
        const checkEmail = await user.findOne({
            where: {
                email
            }
        })

        // mencari emaail ada atau tidak
        if (!checkEmail) {
            return res.send({
                status: 'failed',
                message: "Email and Password don't match"
            })
        }

        // cek password
        const isValidPassword = await bcrypt.compare(password, checkEmail.password)

        // jika password tidak falid
        if (!isValidPassword) {
            return res.send({
                status: 'failed',
                message: "Email and Password don't match"
            })
        }

        // membuat token
        const secretKey = process.env.SECRET_KEY

        // tokennya
        const token = jwt.sign({
            id: checkEmail.id
        }, secretKey)

        // jika berhasil pengecekan
        res.send({
            status: 'success',
            data: {
                user: {
                    fullName: checkEmail.fullName,
                    username: checkEmail.username,
                    email: checkEmail.email,
                    id: checkEmail.id,
                    bio: checkEmail.bio,
                    image: path + checkEmail.image,
                    token
                }
            }
        })

        // letika server error
    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// auth
exports.checkAuth = async (req, res) => {
    try {

        const path = process.env.PATH_UPLOAD

        const id = req.idUser

        const dataUser = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        })

        if (!dataUser) {
            return res.status(404).send({
                status: 'failed'
            })
        }


        res.send({
            status: 'success',
            data: {
                user: {
                    username: dataUser.username,
                    email: dataUser.email,
                    fullName: dataUser.fullName,
                    bio: dataUser.bio,
                    id: dataUser.id,
                    image: path + dataUser.image,
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

