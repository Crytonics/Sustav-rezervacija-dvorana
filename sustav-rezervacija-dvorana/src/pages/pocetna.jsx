import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../css/pocetna.css"

function Pocetna() {

    const navigate = useNavigate();

    const daysOfWeek = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
    const daysOfWeek_puni = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];
    const monthNames = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj",
                        "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"];

    const { datum } = useParams();
    const datumDate = datum ? new Date(datum) : new Date(); // Convert datum to a Date object or use today's date as default

    const dayOfWeekIndex = datumDate.getDay(); // Get day of the week index (0-6)
    const dayName = daysOfWeek_puni[(dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1)]; // Adjust for week starting on Monday
    const dayOfMonth = datumDate.getDate(); // Get day of the month (1-31)
    const monthIndex = datumDate.getMonth(); // Get month index (0-11)
    const year = datumDate.getFullYear(); // Get full year (e.g., 2023)

    const [entries, setEntries] = useState([]);
    const [dvorane, setDvorane] = useState([]);
    const [test, setTest] = useState([]);

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
  
    const calendarDays = [];

    const slotDuration = 15; // duration of each time slot in minutes

    
    const openPocetna = (joinedDate1) => {
        // Navigate to a new page, passing the day as a parameter
        setTest(joinedDate1);
        navigate(`/pocetna/${joinedDate1}`);
        //window.location.reload();
    };
    

    useEffect(() => {
        fetch("http://localhost:3000/api/dvorane")
            .then(response => response.json())
            .then(data => {
                setDvorane(data);
            })
            .catch(error => console.error('Error fetching dvorane:', error));
    }, []);

    useEffect(() => {
        if (datum) {
            const newDate = new Date(datum);
            setCurrentDate(newDate);
        }
        if (dvorane.length > 0) {
            fetch(`http://localhost:3000/api/entry/${datum}`)
                .then(response => response.json())
                .then(data => {
                    const timeSlots = generateTimeSlots();
                    // Assuming data contains an array of objects with start_time and end_time
                    data.forEach(entry => {
                        const entryStartTime = entry.start_time;
                        const entryEndTime = entry.end_time;
                        const entryDvoranaId = entry.id_dvorane;
                        entry.spanCount = calculateSpanCount(entry.start_time, entry.end_time); // Set spanCount here
                        entry.startSlot = calculateStartSlot(entry.start_time, timeSlots); // Assuming timeSlots is accessible hereme slots

                        timeSlots.forEach(slot => {
                            if (entry.ponavljanje === 0) {
                                const slotHours = parseInt(slot.time.substring(0, 2));
                                const slotMinutes = parseInt(slot.time.substring(3, 5));
                                const slotTimeString = `${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;

                                if (slotTimeString >= entryStartTime && slotTimeString < entryEndTime) {
                                    if (!slot.entries[entryDvoranaId]) {
                                        slot.entries[entryDvoranaId] = [];
                                    }
                                    slot.entries[entryDvoranaId].push(entry);
                                }
                            } else {
                                const slotHours = parseInt(slot.time.substring(0, 2));
                                const slotMinutes = parseInt(slot.time.substring(3, 5));
                                const slotTimeString = `${slotHours.toString().padStart(2, '0')}:${slotMinutes.toString().padStart(2, '0')}`;

                                // Calculate the number of days from the entry start date to the current slot date
                                const entryStartDate = new Date(entry.start_date);
                                entryStartDate.setDate(entryStartDate.getDate()); // Add one day to the start date
                                const slotDate = new Date(test);
                                const timeDiff = slotDate - entryStartDate;
                                const daysDiff = timeDiff / (1000 * 3600 * 24);

                                // Check if the slot date is a multiple of 7 days from the start date
                                if (daysDiff % 7 === 0 && slotTimeString >= entryStartTime && slotTimeString < entryEndTime) {
                                    if (!slot.entries[entryDvoranaId]) {
                                        slot.entries[entryDvoranaId] = [];
                                    }
                                    slot.entries[entryDvoranaId].push(entry);
                                }
                            }
                        });
                    });
                    setEntries(timeSlots)
                })
                .catch(error => console.error('Error fetching data: ', error));
        }
    }, [joinedDate, dvorane, datum]); // Depend on dvorane as well

    const goToNextMonth = () => {
        const newDate = new Date(currentYear, currentMonth + 1, 1);
        const newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
        navigate(`/pocetna/${newDateString}`);
        setCurrentDate(newDate);
    };
    
    const goToPreviousMonth = () => {
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        const newDateString = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
        navigate(`/pocetna/${newDateString}`);
        setCurrentDate(newDate);
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
        const isSelectedDay = datumDate.getDate() === day && datumDate.getMonth() === monthIndex && datumDate.getFullYear() === year;
        const dayClass = (isSelectedDay ? "calendar-day selected-day" : (isToday ? "calendar-day current-day" : "calendar-day"));
        const joinedDate1 = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        calendarDays.push(
            <div key={day} className={dayClass} onClick={() => openPocetna(joinedDate1)} style={{cursor: 'pointer'}}>
                {day}
            </div>
        );
    }

    // Add empty slots at the end
    for (let i = totalDays; i < totalGridItems; i++) {
        calendarDays.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    const generateTimeSlots = () => {
        const slots = [];
        const today = new Date();
        let startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0); // Ensure this starts at 8:00
        const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 15);
    
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
        <h2 className="datum_pocetna">{dayName} {dayOfMonth} {monthNames[monthIndex]} {year}</h2>
        
        <div className="calendar-navigation">
            <button onClick={goToPreviousMonth}>Previous</button>
            <p className="p_pocetna">{monthNames[currentMonth]} {currentYear}</p>
            <button onClick={goToNextMonth}>Next</button>
        </div>
        
        <div className="calendar-grid">
            {calendarDays}
        </div>
        <p className="dnevni_pregled">Dnevni pregled</p>
        <table>
    <thead>
        <tr>
            <td style={{textAlign: 'center', backgroundColor: '#0041b9', fontWeight: 'bold'}}>Time</td>
            {dvorane.map(dvorana => (
                <td key={dvorana.id_dvorane} style={{textAlign: 'center', backgroundColor: '#0041b9', fontWeight: 'bold'}}>{dvorana.naziv}</td>
            ))}
        </tr>
    </thead>
        <tbody>
            {entries.map((slot, index) => (
                <tr key={index}>
                    <td style={{textAlign: 'center'}}>{slot.time}</td>
                    {dvorane.map(dvorana => {
                        const entriesForDvorana = slot.entries[dvorana.id_dvorane] || [];
                        if (entriesForDvorana.length> 0) {
                            return entriesForDvorana.map((entry, entryIndex) => {
                                // Check if the entry should be rendered in this slot
                                if (index === entry.startSlot) {
                                    return (
                                        <td key={`${dvorana.id_dvorane}-${entryIndex}`} rowSpan={entry.spanCount} style={{backgroundColor: entry.boja_studijskog_programa, textAlign: 'center', width: index === 0 ? '5%' : 'calc(95% / ' + dvorane.length + ')'}}>
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

