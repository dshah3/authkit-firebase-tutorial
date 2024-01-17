import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { ref, onValue, query, orderByKey, orderByChild, equalTo, remove, startAt, endBefore, startAfter, limitToFirst, limitToLast } from 'firebase/database'
import { useForm } from "react-hook-form"
import { Grid, Col, Card, Select, SelectItem, Text } from '@tremor/react'
import * as z from "zod"
import { useRouter } from 'next/router';

import { database } from '../../firebase.config'

import MovieCard from "@/components/MovieCard"
import MovieListingSubmissionForm from "@/components/MovieListingForm"

import { Button } from "@/components/ui/button"

const ListingsPage: React.FC = () => {

    const [movies, setMovies] = useState<any[]>([])

    const [workosUserId, setWorkosUserId] = useState('')
    const [authenticated, setAuthentication] = useState(false)
    const lastMovieRef = useRef(null)

    const router = useRouter()

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
                router.push('/api/auth')
                console.log("Not authenticated")
            }
        }
        fetchUser()
    }, [])

    const handleDelete = async (movie: any) => {
        const movieRef = ref(database, `Movies/${movie.id}`);
        await remove(movieRef);
    }

    const fetchMovies = () => {
        const moviesRef = ref(database, 'Movies')

        console.log(moviesRef)

        onValue(moviesRef, (snapshot) => {
            const movieData = snapshot.val();
            const movieList = movieData 
                ? Object.keys(movieData)
                    .map(key => ({ id: key, ...movieData[key] }))
                    .filter(movie => movie.user_id === workosUserId)
                : [];
            console.log(movieList)
            setMovies(movieList);
        })
    }

    const refreshMoviesList = () => {
        fetchMovies();
    }

    useEffect(() => {
        fetchMovies()
    }, [workosUserId, authenticated])

    const handleSignOut = async () => {
        await fetch('/api/signout', {
            method: 'POST'
        });

        router.push('/welcome')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0.3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
            </div>
            <div style={{ width: '60%', margin: '0 auto', overflowY: 'auto', paddingBottom: '2rem', paddingRight: '2rem', paddingLeft: '2rem' }}>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
                style={{ textAlign: 'center', marginTop: '5rem', marginBottom: '2rem' }} >
                    Movie Listings
                </h1>
                <MovieListingSubmissionForm onNewMovieListingAdded={() => { refreshMoviesList(); }}/>
                <Grid numItems={1} numItemsSm={4} numItemsLg={4} className="gap-11" style={{ paddingTop: '2rem' }}>
                    {movies.map((movie: any, index) => (
                        <Col key={movie.id} ref={index + 1 === movies.length ? lastMovieRef : null}>
                            <MovieCard movie={movie} onDelete={() => handleDelete(movie)} />
                        </Col>
                    ))}
                </Grid>
            </div>
        </div>
    );
    ;

}

export default ListingsPage