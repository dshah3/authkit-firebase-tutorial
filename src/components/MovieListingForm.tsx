"use client"

import React, { useState, useEffect } from 'react'
import { database } from '../../firebase.config'
import { ref, push, update, onValue } from 'firebase/database'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { TextInput, Textarea } from "@tremor/react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
    movie_name: z.string().max(50, {
        message: "Movie name must be shorter than 50 characters"
    }),
})

const MovieListingSubmissionForm: React.FC<{ onNewMovieListingAdded: () => void }> = ({ onNewMovieListingAdded }) => {

    const [movieName, setMovieName] = useState('')

    const [workosUserId, setWorkosUserId] = useState('')
    const [authenticated, setAuthentication] = useState(false)
    const [isMovieNameUnique, setIsMovieNameUnique] = useState(true)

    useEffect(() => {
        const fetchUser = async() => {
            const response = await fetch ('/api/user')
            const data = await response.json()
            console.log(data)
            if (data.isAuthenticated) {
                setAuthentication(true)
                setWorkosUserId(data.user_id)
            } else {
                console.log("Not authenticated")
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const checkMovieNameUnique = async () => {
            if (!movieName) return

            const moviesRef = ref(database, 'Movies')
            onValue(moviesRef, (snapshot) => {
                const moviesData = snapshot.val()
                const filteredMovies = moviesData ? Object.keys(moviesData)
                    .map(key => moviesData[key])
                    .filter(movie => movie.user_id === workosUserId): []
                
                const nameExists = filteredMovies.some(movie => {
                    return movie.movie_name.toLowerCase() === movieName.toLowerCase()
                })

                setIsMovieNameUnique(!nameExists)
            })
        }

        checkMovieNameUnique()
    }, [movieName])

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!isMovieNameUnique) {
            console.log("Movie name already exists");
            return;
        }
        if (workosUserId && authenticated) {
            try {
                const movieData = {
                    user_id: workosUserId,
                    movie_name: movieName
                }

                const newMovieRef = ref(database, 'Movies')
                await push (newMovieRef, movieData)

                onNewMovieListingAdded()
            } catch (error) {
                console.error('Error uploading movie to the database')
            }

        }
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          movie_name: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
      console.log("In here bro")
      setMovieName(data.movie_name)
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
    }

    return (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="movie_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Movie Listing</FormLabel>
                  <FormControl>
                  <Input
                    type="text"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)} 
                    placeholder="Name of Movie"
                    required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
}

export default MovieListingSubmissionForm