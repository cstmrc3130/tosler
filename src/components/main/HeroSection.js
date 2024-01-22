import React, { useContext } from "react";
import { ShepherdTourContext } from 'react-shepherd'

export default function HeroSection()
{
    const tour = useContext(ShepherdTourContext);
    
    return (
        <div className="container mx-auto lg:w-11/12 mt-20">
            <div className="mx-auto max-w-7xl py-12 px-4 lg:px-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-x-2">
                <h2 id="introduction" className="tracking-tight text-center lg:text-left space-y-2">
                    <span className="block font-bold text-3xl md:text-5xl">A React-based to-do scheduler</span>
                    <span className="block font-light text-info text-xl md:text-2xl">
                        Regular to-do app with <br></br> <strong className="font-bold underline">realtime timelapse</strong> <h6 className="mx-20">and</h6> <strong className="font-bold underline lg:mx-28"> non-disruptive ringtone.</strong>
                    </span>
                </h2>
                <div className="mt-8 flex gap-3 lg:mt-0 lg:flex-shrink-0 self-center">
                    <div className="inline-flex">
                        <button className="btn btn-md btn-outline glass bg-neutral/10" onClick={() => tour.start()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            Show guide
                        </button>
                    </div>
                    <div className="inline-flex">
                        <label id="create-new-todo" htmlFor="modal-ecra" className="btn btn-md btn-outline btn-info" onClick={() => { tour.isActive() && tour.next() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Create new to-do
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}