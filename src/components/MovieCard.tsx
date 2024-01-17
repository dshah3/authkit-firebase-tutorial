import React, { useState, useEffect } from 'react'
import { database }  from '../../firebase.config'
import { ref, runTransaction, onValue } from 'firebase/database'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

interface MovieCardProps {
    movie: any,
    onDelete: Function
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete }) => {

    const [workosUserId, setWorkosUserId] = useState('')
    const [authenticated, setAuthentication] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/user')
            const data = await response.json()
            console.log(data)
            if (data.isAuthenticated) {
                setAuthentication(true)
                setWorkosUserId(data.user_id)
                console.log(data.user_id)
            } else {
                console.log("Not authenticated")
            }
        }
        fetchUser()
    }, [])

    const handleDelete = (movie: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
        if (confirmDelete) {
            onDelete(movie);
        }
    };

    return (
        <Card style={{ width: '220px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardTitle style={{ margin: '0 auto' }}>{movie.movie_name}</CardTitle>
            </CardHeader>
            <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={handleDelete}>Delete</Button>
            </CardFooter>
        </Card>
    )

}

export default MovieCard
