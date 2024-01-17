import type { NextApiRequest, NextApiResponse } from 'next'
import { WorkOS } from '@workos-inc/node'
import { setCookie } from 'cookies-next'
import { SignJWT } from 'jose'

const jwt_key = process.env.NEXT_JWT_KEY

if (!jwt_key) {
    throw new Error('JWT_KEY is not defined in the environment variables')
}

const secret = new Uint8Array(
    Buffer.from(jwt_key, 'base64')
)

const workos = new WorkOS(process.env.NEXT_WORKOS_API_KEY)
const clientId = process.env.NEXT_WORKOS_CLIENT_ID

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const code = typeof req.query.code === 'string' ? req.query.code : null    

    if (!code) {
        res.status(400).send("Invalid request: 'code' parameter is missing or invalid")
        return
    }

    if (!clientId) {
        res.status(400).send("Invalid request: 'clientId' paramter is missing or invalid")
        return
    }

    try {
        const { user } = await workos.userManagement.authenticateWithCode({
            code,
            clientId
        })

        const token = await new SignJWT({ workosUserId: user.id })
          .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
          .setIssuedAt()
          .setExpirationTime('24h')
          .sign(secret);

        console.log("Token generated:", token);
        console.log("User from WorkOS:", user);
        

        setCookie('token', token, {
          req,
          res,
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development',
          sameSite: 'lax'
        })

        res.redirect('/listings')

    } catch (error) {
        res.status(500).send('Authentication failed.')
    }
}