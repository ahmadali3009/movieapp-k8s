let jwt = require('jsonwebtoken');

function authmiddleware(req, res, next) {
    console.log("req.headers.authorization", req.headers.authorization);
    if(req.headers.authorization) {
        try {
            let token = req.headers.authorization.split(" ")[1];
            console.log("auth aplit full" , token)

            const secretKey = process.env.JWT_SECRET || "secretkey@123";
            let decoded = jwt.verify(token, secretKey);
            console.log("decoded", decoded)
            req.user = decoded;
            next();
        } catch (error) {
            console.error("JWT verification error:", error.message);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
}

function refreshtoken(req, res, next) {
    let refreshT = req.body.token;
    console.log("refreshT", refreshT);
    if (!refreshT) {
        return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
    }
    try {
        let decode = jwt.verify(refreshT, process.env.JWT_REFRESH_SECRET || "refreshsecret@123");
        let newAcessToken = jwt.sign({ email: decode.email, id: decode.id, createdAt: Date.now() }
            , process.env.JWT_SECRET || "secretkey@123", { expiresIn: "1h" });
        console.log("newAcessToken", newAcessToken);
    return res.status(200).json({ token: newAcessToken });
    } catch (error) {
        console.error("JWT verification error:", error.message);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
}

module.exports = { authmiddleware , refreshtoken };