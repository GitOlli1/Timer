import { useState } from "react"
import IntervalTimer from "./IntervallTimer"
import './SelectClass.css';

export const SelectClass = () => {
    const [isTimerInterval, setIsTimerInterval] = useState<boolean>(false);

    const handleIntervalTimer = () => {

        setIsTimerInterval(true);
    }

    return(
        <>
            {!isTimerInterval && (
                <div className="intervalTimer-container">
                <div onClick={handleIntervalTimer} className="interval-container">
                    Interval Timer
                </div>
                </div>
            )}

            {isTimerInterval && (
                <IntervalTimer />
            )}
        </>
    )
}