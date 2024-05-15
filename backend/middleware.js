const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

function authMiddleware(req,res,next){
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(403).json({msg: "token erreo"});
    }

    const arr = authorization.split(" ");
    const token = arr[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    }catch(e){
        res.status(403).json({error: e});
    }
}

module.exports= {authMiddleware};