const generateSlots = (startTime, endTime, duration) => {

    const slots = [];

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    let current = sh * 60 + sm;
    const end = eh * 60 + em;

    while (current + duration <= end) {

        const startHour = String(Math.floor(current / 60)).padStart(2,'0');
        const startMinute = String(current % 60).padStart(2,'0');

        const next = current + duration;

        const endHour = String(Math.floor(next / 60)).padStart(2,'0');
        const endMinute = String(next % 60).padStart(2,'0');

        slots.push({
            start:`${startHour}:${startMinute}`,
            end:`${endHour}:${endMinute}`
        });

        current = next;
    }

    return slots;
}

module.exports = generateSlots;