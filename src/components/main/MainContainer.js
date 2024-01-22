import React, { useState, useEffect, useRef, useContext } from "react";
import { ShepherdTourContext } from 'react-shepherd'
import { Howl, Howler } from "howler";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import ActiveSection from "./ActiveSection";
import InactiveSection from "./InactiveSection";
import { toast } from "react-hot-toast";
import { resetState } from "../../features/todoSlice";

const MainContainer = () =>
{
    const [activeTab, SetActiveTab] = useState(1);
    const dispatch = useDispatch();
    const tour = useContext(ShepherdTourContext);
    const onPlay = useRef(true);
    const showNotification = useSelector(createSelector([(state) => state.todo], todo => todo.showNotification))

    const HandleClick = (tab) => 
    {
        if (activeTab === 1 && tab !== activeTab)
        {
            SetActiveTab(2)
        }
        else if (activeTab === 2 && tab !== activeTab)
        {
            SetActiveTab(1)
        }
    }

    // SHOW ALERT FOR DUE TODOS
    useEffect(() =>
    {
        new Howl({
            src: ['/sound/notification_tone.mp3'],
            autoplay: showNotification,
            loop: true,
            volume: 1,
            onplay: function ()
            {
                if (onPlay.current)
                {
                    const notification = toast.custom((t) => (
                        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} alert grid-cols-12 text-warning border-warning bg-warning-content border shadow-lg w-full md:w-4/12 rounded-md`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 justify-self-start" viewBox="0 0 512 512">
                                <path d="M416.07 272a160 160 0 10-160 160 160 160 0 00160-160zM142.12 91.21A46.67 46.67 0 00112 80l-2.79.08C83.66 81.62 64 104 64.07 131c0 13.21 4.66 19.37 10.88 27.23a4.55 4.55 0 003.24 1.77h.88a3.23 3.23 0 002.54-1.31L142.38 99a5.38 5.38 0 001.55-4 5.26 5.26 0 00-1.81-3.79zM369.88 91.21A46.67 46.67 0 01400 80l2.79.08C428.34 81.62 448 104 447.93 131c0 13.21-4.66 19.37-10.88 27.23a4.55 4.55 0 01-3.24 1.76h-.88a3.23 3.23 0 01-2.54-1.31L369.62 99a5.38 5.38 0 01-1.55-4 5.26 5.26 0 011.81-3.79z" fill="none" strokeMiterlimit="10" strokeWidth="32" />
                                <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256.07 160v112h-80M416.07 432l-40-40M96.07 432l40-40">
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 256.07 272" to="5 256.07 272" dur="0.15s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="5 256.07 272" to="-5 256.07 272" begin="0.15s" dur="0.15s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="-5 256.07 272" to="5 256.07 272" begin="0.3s" dur="0.15s" repeatCount="indefinite" />
                                </path>
                            </svg>
                            <span className="col-span-8 justify-self-start">Some todo(s) are due!</span>
                            <button className="btn btn-sm btn-ghost col-span-4 justify-self-end" onClick={() => { toast.remove(notification); Howler.stop() }}>Turn Off</button>
                        </div>
                    ), { duration: Infinity })
                }
            },
            onend: function ()
            {
                onPlay.current = false
                console.log('Some todo(s) are due!')
            }
        });

        if (!showNotification)
        {
            Howler.stop()
            toast.dismiss()
        }
        else
        {
            onPlay.current = true
        }
    }, [showNotification])

    // EFFECT TO DELETE TUTORIAL TO-DO
    useEffect(() =>
    {
        !tour.isActive() && dispatch(resetState())

        const interval = setInterval(() =>
        {
            !tour.isActive() && dispatch(resetState())
        }, 1000);

        return () => clearInterval(interval)
    }, [tour.isActive()])

    return (
        <>
            <main className="container mt-10 mx-auto lg:w-11/12 ">
                <div className="tabs justify-center gap-2">
                    <button id="tab-active-section" className={"tab tab-lg outline-none border-transparent border-t-2 transition-all duration-700 " + (activeTab === 1 ? 'text-info !border-info' : 'text-info/50 hover:border-info hover:text-info')} onClick={() => HandleClick(1)}>Active Schedules</button>
                    <button id="tab-inactive-section" className={"tab tab-lg outline-none border-transparent border-t-2 transition-all duration-700 " + (activeTab === 2 ? 'text-base-content !border-base-content' : 'text-base-content/70 hover:border-base-content hover:text-base-content')} onClick={() => HandleClick(2)}>Past Schedules</button>
                </div>

                <ActiveSection activeTab={activeTab} />
                <InactiveSection activeTab={activeTab} />
            </main >
        </>
    );
}

export default MainContainer;