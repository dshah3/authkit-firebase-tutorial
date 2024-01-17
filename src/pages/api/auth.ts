import type { NextApiRequest, NextApiResponse } from 'next'
import { WorkOS } from '@workos-inc/node'

export default (_req: NextApiRequest, res: NextApiResponse) => {

    const workosApiKey = process.env.NEXT_WORKOS_API_KEY
    const clientId = process.env.NEXT_WORKOS_API_KEY

    if (!workosApiKey || !clientId) {
        res.status(500).json({ error: 'Missing WorkOS configuration.' })
        return
    }

    const workos = new WorkOS(workosApiKey)
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        redirectUri: 'https://localhost:3000/api/callback',
        clientId
    })

    res.redirect(authorizationUrl)
}