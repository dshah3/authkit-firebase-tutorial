import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    setCookie('token', '', {
        req,
        res,
        maxAge: -1,
        path: '/'
    })

    res.writeHead(302, { Location: '/welcome' })
    res.end()
}