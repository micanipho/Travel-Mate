import React from "react";
import Illustration from '@/assets/Illustration'
import { Button } from '@/components/ui/button'
import { Link } from 'wouter'
const Hero = () => {
    return (
        <section className="flex flex-col md:flex-row lg:flex-row items-center justify-center min-h-screen overflow-hidden">
            <Illustration />
            <div className="flex flex-col justify-center w-[70vw] text-center md:text-center lg:text-left">
                <h1 className="text-6xl font-bold text-gray-900">Travel Mate</h1>
                <p className="text-2xl text-gray-500">Browse Taxi Ranks, Routes and <br />
                    staying safe with real-time Alerts</p>
                <Link href="/signup">
                    <Button className="w-[8rem] bg-[#D08726] text-white my-[1rem]">Get Started!</ Button>
                </Link>
            </div>



        </section>
    );
};


export default Hero;
