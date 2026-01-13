import createUserService from "../services/user.service.js"

const createUser = async (req, res) => {
    try {
        const { name, mobile, mPin } = req.body
        console.log(name, mobile,mPin,'reqbody')
        if (!mPin) {
            res.json({ status: 400, message: 'mPin is required' })
        }        
        if (!mobile) {
            res.json({ status: 400, message: 'Mobile number is required' })
        }        
        const serviceRes = await createUserService({ mPin, mobile })
        console.log(serviceRes,'serviceRes')

        return res.status(201).json({
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