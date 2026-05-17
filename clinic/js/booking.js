document.getElementById("bookingForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const service = document.getElementById("service").value;
    const doctor = document.getElementById("doctor").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const res = await fetch("../api/bookings.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            phone,
            service,
            doctor,
            date,
            time
        })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Booking Successful");
        document.getElementById("bookingForm").reset();
    } else {
        alert(data.error || "Something went wrong");
    }
});