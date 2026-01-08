import createUserService from "../services/user.service.js"

const createUser = async (req, res) => {
    try {

        const { name, mobile } = req.body
        console.log(name, mobile,'reqbody')
        if (!name || !mobile) {
            res.json({ status: 400, message: 'Credentials required' })
        }
        
        const serviceRes = await createUserService({ name, mobile })

        console.log(serviceRes,'serviceRes')

        return res.status(200).json({
            success: true,
            message: "User created Successfully",
            data: serviceRes
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

export default createUser