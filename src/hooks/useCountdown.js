import { useEffect, useState } from 'react';
import { setShowNotification } from '../features/todoSlice';
import { useDispatch } from 'react-redux';

const ConvertDate = (timeLeftInMilliseconds) =>
{
    const days = Math.floor(timeLeftInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeftInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeftInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeftInMilliseconds % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
};

const useCountdown = (deadline) =>
{
    const dispatch = useDispatch()
    const deadlineInMilliseconds = new Date(deadline).getTime();

    const [timeLeftInMilliseconds, SetTimeLeftInMilliseconds] = useState(deadlineInMilliseconds - new Date().getTime());

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            if (deadlineInMilliseconds - new Date().getTime() > 0)
            {
                SetTimeLeftInMilliseconds(deadlineInMilliseconds - new Date().getTime());
            }
            else
            {
                dispatch(setShowNotification())
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [deadlineInMilliseconds]);

    return ConvertDate(timeLeftInMilliseconds > 0 ? timeLeftInMilliseconds : 0);
};

export { useCountdown };

// P.S
// new Date().getTime() IS REAL-TIME IN MILLISECONDS
