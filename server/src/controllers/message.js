// memanggil model tabel message
const { message, user, sequelize } = require('../../models')

// mencari parameter yang sesuai
const { Op, QueryTypes } = require('sequelize')


// =========================================== add chat  =============================================
exports.addChat = async (req, res) => {

    try {

        const { id } = req.params
        const { idUser } = req

        const { Message } = req.body

        // cek user penerima ada apa tidak
        const check = await user.findOne({
            where: {
                id
            }
        })

        if (!check) {
            return res.send({
                status: 'failed',
            })
        }

        // pensan disimpan di database
        const data = await message.create({
            recipient: id,
            sender: idUser,
            message: Message,
        })

        const messageSender = await message.findOne({
            where: {
                id: data.id
            },
            include: {
                model: user,
                as: 'Recipient',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'email', 'password']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'recipient', 'sender']
            }
        })


        // menampikan ketika data berhasil di tambahkan
        res.send({
            status: 'success',
            data: {
                messageSender
            }
        })

    } catch (error) {
        console.log(error)
        res.status({
            status: 'failed',
            message: 'Server Error'
        })
    }
}


// =========================================== meampilkan chat  =========================================
exports.messageWithId = async (req, res) => {

    try {

        const { id } = req.params
        const { idUser } = req

        const check = await user.findOne({
            where: {
                id
            }
        })

        if (!check) {
            return res.send({
                status: 'failed',
            })
        }

        // memanggil parameter untuk di tampilkan
        const messages = await message.findAll({
            where: {
                [Op.or]: [{
                    sender: id,
                    recipient: idUser
                },
                {
                    sender: idUser,
                    recipient: id
                }]
            },
            // include user
            include: {
                model: user,
                as: 'Sender',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'email', 'password']
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'sender', 'recipient']
            }
        })

        // berhasil
        res.send({
            status: 'success',
            data: {
                Message: messages
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

// =========================================== history chat  =========================================
exports.historyChat = async (req, res) => {

    try {

        const { idUser } = req
        const last = await sequelize.query('SELECT MAX(id) as last FROM messages GROUP BY sender', { type: QueryTypes.SELECT })
        const ress = last.map(last => last.last)

        console.log(ress)

        const data = await message.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                recipient: idUser,
                id: {
                    [Op.in]: ress
                }
            },

            include: {
                model: user,
                as: 'Sender',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'bio', 'email', 'password']
                }
            },
            order: [['updatedAt', 'DESC']]
        })

        res.send({
            status: "success",
            data: {
                message: data
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
// exports.historyChat = async (req, res) => {

//     try {

//         const recipient = req.idUser

//         const data = await message.findAll({
//             where: {
//                 recipient
//             },
//             include: {
//                 model: user,
//                 as: 'Sender',
//                 attributes: {
//                     exclude: ['createdAt', 'updatedAt', 'bio', 'email', 'password']
//                 }
//             },
//             attributes: {
//                 exclude: ['createdAt', 'updatedAt']
//             },
//             group: ['message.sender'],
//             order: [['updatedAt', 'DESC']]
//         })

//         res.send({
//             status: "success",
//             data: {
//                 message: data
//             }
//         })




//         // error server
//     } catch (error) {
//         console.log(error)
//         res.status({
//             status: 'failed',
//             message: 'Server Error'
//         })
//     }
// }
