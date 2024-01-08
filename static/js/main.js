const authorInput = document.getElementById('authorInput');
const jokeInput = document.getElementById('jokeInput');
const errorAuthor = document.getElementById('errorAuthor');
const errorJoke = document.getElementById('errorJoke');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const jokesCount = document.getElementById('jokesCount');
const jokesList = document.getElementById('jokesList');

const api = "http://localhost:3000/jokes";

errorAuthor.style.display = 'none';
errorJoke.style.display = 'none';
submitBtn.disabled = true;


submitBtn.addEventListener('click', () => {

    let author = authorInput.value;
    let joke = jokeInput.value;
    const data = {
        author: author,
        joke: joke,
    };

    dataToSend = JSON.stringify(data);

    const ajax = new XMLHttpRequest();
    ajax.open('POST', api, true);
    ajax.setRequestHeader('Content-type', 'application/json');
    ajax.addEventListener('load', function () {
        let response = JSON.parse(ajax.response);
        if (response.status == "success") {
            addJoke(response.joke);
            authorInput.value = "";
            jokeInput.value = "";
        }
        else {
            alert(response.msg);
        }
    }
    );
    ajax.addEventListener('error', function () {
        alert("something went wrong");

    });
    ajax.send(dataToSend);
}
);

authorInput.addEventListener("input", () => {
    if(!authorInput.value){
        errorAuthor.style.display = 'block';
        submitBtn.disabled = true;
    }
    else{
        errorAuthor.style.display = 'none';
        submitBtn.disabled = false;
    }
}
);

jokeInput.addEventListener("input", () => {
    if(!jokeInput.value){
        errorJoke.style.display = 'block';
        submitBtn.disabled = true;
    }
    if(jokeInput.value.length <= 5){
        errorJoke.style.display = 'block';
        submitBtn.disabled = true;
    }
    else{
        errorJoke.style.display = 'none';
        submitBtn.disabled = false;
    }
}
);








