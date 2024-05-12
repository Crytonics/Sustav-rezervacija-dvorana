import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../css/pocetna.css"

function Pocetna() {
    const [entries, setEntries] = useState([]);
    const [dvorane, setDvorane] = useState([]);

    const realCurrentDate = new Date(); // This remains constant, representing the real-world current date
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth2 = realCurrentDate.getMonth();
    const currentYear2 = realCurrentDate.getFullYear();
    const today = realCurrentDate.getDate();
    const day = realCurrentDate.getDay();
    const todayDate = realCurrentDate.toLocaleDateString('en-US', { day: 'numeric' });
    const joinedDate = `${currentYear2}-${(currentMonth2 + 1).toString().padStart(2, '0')}-${todayDate}`;
  
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
  
    const calendarDays = [];

    const slotDuration = 15; // duration of each time slot in minutes

    useEffect(() => {
        fetch("http://localhost:3000/api/dvorane")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched dvorane data:", data); // Check the fetched data
                setDvorane(data);
            })
            .catch(error => console.error('Error fetching dvorane:', error));
    }, []);

    useEffect(() => {
        if (dvorane.length > 0) {
            fetch(`http://localhost:3000/api/entry/${joinedDate}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched data:", data); // Initial data
                    const timeSlots = generateTimeSlots();
                    // Assuming data contains an array of objects with start_time and end_time
                    data.forEach(entry => {
                        const entryStartTime = entry.start_time;
                        const entryEndTime = entry.end_time;
                        const entryDvoranaId = entry.id_dvorane;
                        entry.spanCount = calculateSpanCount(entry.start_time, entry.end_time); // Set spanCount here
                        entry.startSlot = calculateStartSlot(entry.start_time, timeSlots); // Assuming timeSlots is accessible hereme slots

                        timeSlots.forEach(slot => {
                            const slotHours = parseInt(slot.time.substring(0, 2));
                            const slotMinutes = parseInt(slot.time.substring(3, 5));
                            const slotTimeString = `${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;

                            if (slotTimeString >= entryStartTime && slotTimeString < entryEndTime) {
                                if (!slot.entries[entryDvoranaId]) {
                                    slot.entries[entryDvoranaId] = [];
                                }
                                slot.entries[entryDvoranaId].push(entry);
                            }
                        });

                        //if (joinedDate >= entry.start_date && joinedDate <= entry.end_date) {
                        //    console.log(`Processed entry: ${entry.naziv}, Start Slot: ${entry.startSlot}, Span Count: ${entry.spanCount}`);
                        //    console.log("start_datee: ", entry.start_date);
                        //    console.log("start_date: ", entry.end_date);
                        //    console.log("joinedDate: ", joinedDate);   
                        //}
                        
                    });
                    setEntries(timeSlots)
                })
                .catch(error => console.error('Error fetching data: ', error));
        }
    }, [joinedDate, dvorane]); // Depend on dvorane as well

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };
    
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

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
        const today = new Date();
        let startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0); // Ensure this starts at 8:00
        const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 0);
    
        while (startTime < endTime) {
            const timeString = startTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
            slots.push({ time: timeString, entries: {} }); 
            startTime = new Date(startTime.getTime() + slotDuration * 60000); // Moves in 15-minute increments
        }
    
        return slots;
    };

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function calculateSpanCount(startTime, endTime) {
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const duration = endMinutes - startMinutes;
        const spanCount = Math.ceil(duration / slotDuration);
    
        console.log(`Start Time: ${startTime}, Adjusted End Time: ${endTime} (+15min), Duration: ${duration}, Span Count: ${spanCount}`);
        return spanCount;
    }

    function calculateStartSlot(entryStartTime, timeSlots) {
        const entryStartMinutes = timeToMinutes(entryStartTime);
        for (let i = 0; i < timeSlots.length; i++) {
            let slotTimeMinutes = timeToMinutes(timeSlots[i].time);
            if (slotTimeMinutes >= entryStartMinutes) {
                return i; // Return the current slot if the time matches or is the first slot after the start time
            }
        }
        return 0; // Default to the first slot if no exact match is found
    }

    return (
        <>
        <p className="datum_pocetna">{daysOfWeek[adjustedDayOfWeekIndex]} {today} {monthNames[currentMonth2]} {currentYear2}</p>
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
            <th>Time</th>
            {dvorane.map(dvorana => (
                <th key={dvorana.id_dvorane}>{dvorana.naziv}</th>
            ))}
        </tr>
    </thead>
        <tbody>
            {entries.map((slot, index) => (
                <tr key={index}>
                    <td>{slot.time}</td>
                    {dvorane.map(dvorana => {
                        const entriesForDvorana = slot.entries[dvorana.id_dvorane] || [];
                        if (entriesForDvorana.length> 0) {
                            return entriesForDvorana.map((entry, entryIndex) => {
                                // Check if the entry should be rendered in this slot
                                if (index === entry.startSlot) {
                                    return (
                                        <td key={`${dvorana.id_dvorane}-${entryIndex}`} rowSpan={entry.spanCount} style={{backgroundColor: 'red', textAlign: 'center'}}>
                                            <div>{entry.kolegij_naziv}</div>
                                            <div>{entry.studijski_program_naziv}</div>
                                            <div>{entry.korisnicko_ime}</div>
                                            <div>{`(${entry.start_time} - ${entry.end_time})`}</div>
                                        </td>
                                    );
                                }
                                return null; // Skip rendering for slots covered by rowSpan
                            });
                        } else {
                            // Render empty cell if not covered by any entry
                            return <td key={dvorana.id_dvorane}></td>;
                        }
                    })}
                </tr>
            ))}
    </tbody>
</table>

      </>
    );
  }
  export default Pocetna;

