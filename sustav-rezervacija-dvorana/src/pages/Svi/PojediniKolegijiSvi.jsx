import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function PojediniKolegijiSvi() {

    const realCurrentDate = new Date(); // This remains constant, representing the real-world current date
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = realCurrentDate.getDate();
    const day = currentDate.getDay();
  
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const adjustedDayOfWeekIndex = (day === 0) ? 6 : day - 1;

    const realCurrentMonth = realCurrentDate.getMonth();
    const realCurrentYear = realCurrentDate.getFullYear();
  
    // Adjust for week starting on Monday
    const startDayOfWeek = (firstDayOfMonth.getDay() || 7) - 1;
    const daysInMonth = lastDayOfMonth.getDate();
  
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[currentMonth];
  
    const calendarDays = [];

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };
    
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const getWeekRange = (date) => {
        const dayOfWeek = date.getDay(); // Get current day of the week (0 is Sunday)
        const currentDay = date.getDate(); // Get current day of the month
        const startOffset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Calculate offset to get Monday
        const endOffset = (dayOfWeek === 0 ? 0 : 7) - dayOfWeek; // Calculate offset to get Sunday
    
        const startOfWeek = new Date(date);
        startOfWeek.setDate(currentDay + startOffset);
        const endOfWeek = new Date(date);
        endOfWeek.setDate(currentDay + endOffset);
    
        return {
            start: `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`,
            end: `${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`
        };
    };
    
    const weekRange = getWeekRange(realCurrentDate);

    // Calculate the number of empty slots at the end
    const totalDays = startDayOfWeek + daysInMonth; // Total including empty slots at the start
    const totalRows = Math.ceil(totalDays / 7); // Total rows needed
    const totalGridItems = totalRows * 7; // Total grid items to fill the rows completely

    // Add day headers
    daysOfWeek.forEach(day => {
      calendarDays.push(<div key={day} className="calendar-day-header">{day}</div>);
    });
    // Add empty slots before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today && currentMonth === realCurrentMonth && currentYear === realCurrentYear;
        const dayClass = isToday ? "calendar-day current-day" : "calendar-day";
        calendarDays.push(<div key={day} className={dayClass}>{day}</div>);
      }
    // Add empty slots at the end
    for (let i = totalDays; i < totalGridItems; i++) {
        calendarDays.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    const generateTimeSlots = () => {
        const slots = [];
        let startTime = new Date(0, 0, 0, 8, 0); // Starting at 08:00
        const endTime = new Date(0, 0, 0, 22, 0); // Ending at 22:00
    
        while (startTime <= endTime) {
          // Format time in HH:MM format
          const timeString = startTime.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          slots.push({ time: timeString, dvorana1: '', dvorana2: '', dvorana3: '', dvorana4: '', dvorana5: '' });
    
          // Increment by 15 minutes
          startTime = new Date(startTime.getTime() + 15 * 60000);
        }
    
        return slots;
      };
  
    return (
        <>
        <div className="datum_pocetna">
            <p>{weekRange.start} - {weekRange.end}</p>
            <p>Baze podataka</p>
        </div>
        <div className="calendar-navigation">
            <button onClick={goToPreviousMonth}>Previous</button>
            <p className="p_pocetna">{monthNames[currentMonth]} {currentYear}</p>
            <button onClick={goToNextMonth}>Next</button>
        </div>
        <div className="calendar-grid">
            {calendarDays}
        </div>
        <table>
            <thead>
                <tr>
                <th className="th_pocetna">Time</th>
                <th className="th_pocetna">{daysOfWeek[0]}</th>
                <th className="th_pocetna">{daysOfWeek[1]}</th>
                <th className="th_pocetna">{daysOfWeek[2]}</th>
                <th className="th_pocetna">{daysOfWeek[3]}</th>
                <th className="th_pocetna">{daysOfWeek[4]}</th>
                <th className="th_pocetna">{daysOfWeek[5]}</th>
                <th className="th_pocetna">{daysOfWeek[6]}</th>
                </tr>
            </thead>
            <tbody>
                {generateTimeSlots().map((slot, index) => (
                <tr key={index}>
                    <td className="td_pocetna">{slot.time}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                    <td className="td_pocetna">{slot.daysOfWeek}</td>
                </tr>
                ))}
            </tbody>
        </table>

      </>
    );
}
