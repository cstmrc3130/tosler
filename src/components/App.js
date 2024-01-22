import React, { useEffect, useRef, useState } from 'react';
import { Toaster } from "react-hot-toast";
import { ShepherdTour } from 'react-shepherd'
import { shepherdSteps } from "../features/shepherdSteps";
import Logo from "./header/Logo";
import SearchBar from "./header/SearchBar"
import HeroSection from "./main/HeroSection"
import MainContainer from './main/MainContainer';
import CreateEditModal from './modal/CreateEditModal';
import ConfirmDeleteModal from './modal/ConfirmDeleteModal';
import ConfirmMarkAsFinishedModal from './modal/ConfirmMarkAsFinishedModal';
import ConfirmSetAsActiveModal from './modal/ConfirmSetAsActiveModal';
import Footer from './footer/Footer';
import '../css/index.css';

const tourOptions = {
    defaultStepOptions: {
        cancelIcon: {
            enabled: true
        },
        // classes: 'bg-neutral-content',
        scrollTo: { behavior: 'smooth', block: 'center' }
    },
    useModalOverlay: true
};

const Moon = () =>
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    )
}

const Sun = () =>
{
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
    )
}

const Navbar = () =>
{
    // REFS RETURN AN OBJECT (current) https://react.dev/learn/referencing-values-with-refs#:~:text=returns%20an%20object%20like%20this%3A
    const scroll = useRef(0);
    const theme = useRef(0);
    const [themeIcon, setThemeIcon] = useState();

    // CHECK USER'S THEME PREFERENCE
    const systemTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const documentElement = document.documentElement;

    useEffect(() =>
    {        
        const savedTheme = localStorage.getItem('theme')
        
        const HandleScroll = () =>
        {
            const scrollPercentage = (window.scrollY / document.documentElement.scrollHeight) * 100;
            
            if (scrollPercentage >= 1)
            {
                scroll.current.classList.remove("h-20")
                scroll.current.classList.add("shadow-sm", "h-16")
            }
            else
            {
                scroll.current.classList.remove("shadow-sm", "h-16")
                scroll.current.classList.add("h-20")
            }
        };

        const HandleClick = (e) =>
        {
            const savedTheme = localStorage.getItem('theme')

            if(theme.current.contains(e.target))
            {
                if (savedTheme)
                {
                    if (savedTheme === "dark")
                    {
                        localStorage.setItem('theme', "light")
                        documentElement.dataset['theme'] = "light"
                        setThemeIcon(<Moon/>)
                    }
                    else
                    {
                        localStorage.setItem('theme', "dark")
                        documentElement.dataset['theme'] = 'dark'
                        setThemeIcon(<Sun/>)
                    }
                }
                else
                {
                    localStorage.setItem('theme', systemTheme)
                    documentElement.dataset['theme'] = systemTheme
                    systemTheme === "dark" ? setThemeIcon(<Sun/>) : setThemeIcon(<Moon/>)
                }
            }
        }

        // SET SAVED THEME ON FIRST LOAD
        if (savedTheme)
        {
            documentElement.dataset['theme'] = savedTheme
            savedTheme === "dark" ? setThemeIcon(<Sun/>) : setThemeIcon(<Moon/>)
        }
        else
        {
            localStorage.setItem('theme', systemTheme)
            documentElement.dataset['theme'] = systemTheme
            systemTheme === "dark" ? setThemeIcon(<Sun/>) : setThemeIcon(<Moon/>)
        }

        window.addEventListener('scroll', HandleScroll);
        window.addEventListener('click', (e) => HandleClick(e))

        return () => 
        {
            window.removeEventListener('scroll', HandleScroll);
            window.removeEventListener('click', HandleClick);
        }
    }, []);

    return (
        <div ref={scroll} className={"lg:w-full lg:px-16 navbar fixed transition-all duration-500 z-20 backdrop-blur h-20"}>
            <div className="lg:hidden">
                <label htmlFor="my-drawer-3" className="btn btn-square bg-transparent hover:bg-base-content/20 border-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div className="basis-7/12">
                <Logo />
            </div>
            <div className="hidden lg:flex lg:basis-4/12 justify-center">
                <ul className="menu p-0 basis-full">
                    <SearchBar screenSize={"md"} />
                </ul>
            </div>
            <button ref={theme} className='btn btn-square bg-transparent hover:bg-base-content/20 border-0 ml-auto'>
                {themeIcon}
            </button>
        </div >
    )
}

export default class App extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    componentDidMount()
    {
        setTimeout(() =>
        {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 0)
    }

    render()
    {
        return (
            <>
                <Toaster position="bottom-left" />

                <div className="drawer transition-all">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col lg:items-center">
                        <ShepherdTour steps={shepherdSteps} tourOptions={tourOptions}>
                            <Navbar />
                            <HeroSection />
                            <MainContainer />
                            <CreateEditModal />
                            <ConfirmDeleteModal />
                            <ConfirmMarkAsFinishedModal />
                            <ConfirmSetAsActiveModal />
                            <Footer />
                        </ShepherdTour>
                    </div>
                    <div className="drawer-side lg:hidden z-30">
                        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
                        <ul className="menu h-full w-80 bg-base-100 p-4 rounded-r-lg">
                            <SearchBar screenSize={"sm"} />
                        </ul>
                    </div>
                </div>
            </>
        )
    }
}


// P.S
// THE OPTIONAL CHAINING OPERATOR (?.) IS USED TO HANDLE CASES WHERE THE CODE MAY RUN IN DIFFERENT ENVIRONMENTS, AND WINDOW.MATCHMEDIA MAY NOT EXIST. 
// IF THE PROPERTY EXISTS, IT WILL EXECUTE THE MATCHMEDIA() METHOD AS EXPECTED. IF IT DOESN'T EXIST, IT WILL RETURN UNDEFINED WITHOUT RAISING AN ERROR.