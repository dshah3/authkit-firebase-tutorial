'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Home() {

    const router = useRouter()

    const handleClick = () => {
        router.push('/api/auth', undefined, { shallow: true })
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
            <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Welcome to Movie Listings</CardTitle>
                <CardDescription>Keep track of the movies you've watched.</CardDescription>
            </CardHeader>
            <CardContent>

            <Button onClick={handleClick} >Sign In</Button>
            
            </CardContent>
            </Card>
            
        </div>
        </div>
    )

}