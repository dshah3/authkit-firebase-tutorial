import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import { jwtVerify } from 'jose'

const jwt_key = process.env.NEXT_JWT_KEY

if (!jwt_key) {
    throw new Error('JWT_KEY is not defined in the environment variables')
}

const secret = new Uint8Array(
    Buffer.from(jwt_key, 'base64')
)

export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Cookies received:", req.headers.cookie)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    const token = getCookie('token', { req, res })

    if (!token) {
        return res.status(401).json({ isAuthenticated: false })
    }

    console.log("Token received in user.ts", token)

    try {
        const verifiedToken = await jwtVerify(token.toString(), secret)
        console.log("Verified token", verifiedToken)
        res.status(200).json({
            isAuthenticated: true,
            user_id: verifiedToken.payload.workosUserId
        })
    } catch (error) {
        console.error(error)
        res.status(401).json({ isAuthenticated: false })
    }
}