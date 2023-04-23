import jwt from 'jsonwebtoken'

export default (req:any, res:any, next:any) => {
    if (req.method === 'OPTIONS') {
       return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Authorization before'})
        }
        const decoded = jwt.verify(token, 'secretKeyOLOLO')
        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({message: 'Auth error'})
    }
}