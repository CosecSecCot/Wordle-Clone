let input = ["", "", "", "", ""];
let guesses = 1;
let currChars = 0;
let gameOver = false;

function updateBox(input, line) {
    return `<div class="box" id="${line}:${0}">${input[0]}</div>
        <div class="box" id="${line}:${1}">${input[1]}</div>
        <div class="box" id="${line}:${2}">${input[2]}</div>
        <div class="box" id="${line}:${3}">${input[3]}</div>
        <div class="box" id="${line}:${4}">${input[4]}</div>`;
}

async function getWord() {
    const response = await fetch(
        "https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase"
    );
    const body = await response.json();
    return body[0];
}

function validate(guess, answer) {
    const result = [];
    const guessFrequency = {};
    const frequency = {};

    for (let i = 0; i < answer.length; i++) {
        frequency[answer[i]] = 0;
    }
    for (let i = 0; i < answer.length; i++) {
        frequency[answer[i]] += 1;
    }
    // console.log(frequency);

    for (let i = 0; i < guess.length; i++) {
        guessFrequency[guess[i]] = 0;
    }
    for (let i = 0; i < guess.length; i++) {
        guessFrequency[guess[i]] += 1;
    }
    // console.log(guessFrequency);

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) {
            result.push("green");
            guessFrequency[guess[i]]--;
        } else if (
            guess[i] in frequency &&
            guessFrequency[guess[i]] > 0 &&
            guessFrequency[guess[i]] < frequency[answer[i]]
        ) {
            result.push("yellow");
        } else {
            result.push("grey");
        }
    }

    // console.log(result);
    return result;
}

function updateCSS(data, guesses) {
    for (let i = 0; i < data.length; i++) {
        const currBox = document.getElementById(`${guesses}:${i}`);
        currBox.style.backgroundColor = data[i];
    }
}

function declareResult(result, answer) {
    const content = result ? "YOU WON" : "YOU LOSE";
    // console.log(content);
    document.querySelector(".result").innerHTML = content;
    if (!result) {
        document.querySelector(".answer").innerHTML = `Word was: ${answer}`;
    }
    const reloadButton = document.createElement("button");
    reloadButton.classList.add("playagain");
    reloadButton.textContent = "Play Again";
    reloadButton.addEventListener("click", (_) => window.location.reload());
    document.querySelector("main").appendChild(reloadButton);
}

function didYouWin(data) {
    for (let i = 0; i < data.length; i++)
        if (data[i] !== "green") {
            return false;
        }
    return true;
}

function handleEvent(event, answer) {
    if (guesses > 6 || gameOver) {
        return;
    }
    if (currChars < 5 && event.key.length === 1) {
        input[currChars] = event.key.toUpperCase();
        currChars++;
        let attempt = document.querySelector(`.attempt-${guesses}`);
        attempt.innerHTML = updateBox(input, guesses);
    } else if (event.key == "Enter") {
        if (input.join("").length < 5) {
            console.log("bro complete that shit");
        } else {
            // console.log("Enter pressed");
            const data = validate(input.join(""), answer);
            updateCSS(data, guesses);
            if (didYouWin(data)) {
                declareResult(true, answer);
                gameOver = true;
                return;
            } else {
                if (guesses === 6) {
                    declareResult(false, answer);
                    gameOver = true;
                }
            }
            guesses++;
            input = ["", "", "", "", ""];
            currChars = 0;
        }
    } else if (event.key == "Backspace" && currChars > 0) {
        currChars--;
        input[currChars] = "";
        // console.log(input);
        let attempt = document.querySelector(`.attempt-${guesses}`);
        attempt.innerHTML = updateBox(input);
    }
}

async function setupWordle() {
    const answer = await getWord();
    // console.log(answer);

    // pass it into handle event or make a new function validate
    // then update css

    document.addEventListener("keyup", (_) => handleEvent(_, answer));
}

setupWordle();
