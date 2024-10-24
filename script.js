const seats = document.querySelectorAll('.seat.available');
const totalDisplay = document.getElementById('total');
const payBtn = document.getElementById('payBtn');
let total = 0;

seats.forEach(seat => {
  seat.addEventListener('click', function() {
    const seatPrice = parseInt(this.dataset.price);

    if (!this.classList.contains('selected')) {
      // If the seat is not selected, select it and add to total
      this.classList.add('selected');
      total += seatPrice;
    } else {
      // If the seat is already selected, deselect it and subtract from total
      this.classList.remove('selected');
      total -= seatPrice;
    }

    totalDisplay.textContent = total;
    payBtn.textContent = `Pay Rs.${total}`;
  });
});
