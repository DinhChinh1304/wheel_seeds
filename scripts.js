let totalParticipants = 0;
let maxParticipantsPerHouse = 0;
let isSpinning = false; // Để kiểm tra nếu vòng quay đang quay

const participantsPerHouse = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0
};

const houses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

document.getElementById('spinButton').addEventListener('click', spin);
document.getElementById('participantInput').addEventListener('input', updateParticipants);

function updateParticipants() {
    totalParticipants = parseInt(document.getElementById('participantInput').value) || 0;
    maxParticipantsPerHouse = Math.ceil(totalParticipants / 4);
    resetHouses();
}

function resetHouses() {
    participantsPerHouse.Gryffindor = 0;
    participantsPerHouse.Slytherin = 0;
    participantsPerHouse.Ravenclaw = 0;
    participantsPerHouse.Hufflepuff = 0;

    document.querySelectorAll('.segment').forEach(segment => {
        segment.style.display = 'flex';
    });

    houses.length = 0;
    houses.push("Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff");

    updateWheelSegments(); // Cập nhật lại các phân đoạn
}

function spin() {
    if (isSpinning) return; // Nếu vòng quay đang quay, không làm gì cả
    if (totalParticipants <= 0) {
        alert("Please enter the number of participants.");
        return;
    }

    if (houses.length === 0) {
        alert("All houses are full!");
        return;
    }

    isSpinning = true; // Đặt cờ để cho biết vòng quay đang quay

    const degree = Math.floor(Math.random() * 360) + 360 * 5; // Quay ít nhất 5 vòng
    const wheel = document.getElementById('wheel');
    wheel.style.transform = `rotate(${degree}deg)`;

    setTimeout(() => {
        const actualDegree = degree % 360;
        const selectedHouse = getHouseByDegree(actualDegree);

        if (selectedHouse) {
            participantsPerHouse[selectedHouse]++;
            if (participantsPerHouse[selectedHouse] >= maxParticipantsPerHouse) {
                const index = houses.indexOf(selectedHouse);
                if (index > -1) houses.splice(index, 1);

                const segment = document.querySelector(`.segment[data-house="${selectedHouse}"]`);
                if (segment) segment.remove(); // Xóa hẳn phân đoạn khỏi vòng quay
            }

            displayResult(selectedHouse);
            updateWheelSegments(); // Cập nhật lại các phân đoạn
        }

        // Reset vòng quay về trạng thái ban đầu
        wheel.style.transform = 'rotate(0deg)';
        isSpinning = false; // Đặt cờ để cho biết vòng quay đã dừng
    }, 4000);
}

function getHouseByDegree(degree) {
    const segments = document.querySelectorAll('.segment');
    const segmentDegree = 360 / segments.length;

    for (let i = 0; i < segments.length; i++) {
        const startDegree = i * segmentDegree;
        const endDegree = startDegree + segmentDegree;

        if (degree >= startDegree && degree < endDegree) {
            return segments[i].getAttribute('data-house');
        }
    }
    return null; // Nếu không tìm thấy nhà, trả về null
}

function displayResult(house) {
    const result = document.getElementById('result');
    result.innerText = house;

    const audio = document.getElementById('audio');
    audio.src = `assets/${house.toLowerCase()}.mp3`;
    audio.play();

    const houseImage = document.getElementById('houseImage');
    houseImage.src = `assets/${house.toLowerCase()}.png`;
    houseImage.style.display = 'block';
    houseImage.style.animation = 'zoom 1s forwards';

    setTimeout(() => {
        houseImage.style.animation = '';
        houseImage.style.display = 'none';
    }, 3000);
}

function updateWheelSegments() {
    const segments = document.querySelectorAll('.segment');
    const segmentDegree = 360 / segments.length;

    segments.forEach((segment, index) => {
        segment.style.transform = `rotate(${index * segmentDegree}deg) translate(-100%, -100%)`;
    });
}
