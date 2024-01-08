const authorInput = document.getElementById('authorInput');
const jokeInput = document.getElementById('jokeInput');
const errorAuthor = document.getElementById('errorAuthor');
const errorJoke = document.getElementById('errorJoke');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const jokesCount = document.getElementById('jokesCount');
const jokesList = document.getElementById('jokesList');

jokesCount.innerHTML = 0;

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
            jokesCount.innerHTML++;
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
});

authorInput.addEventListener("input", () => {
    if(!authorInput.value){
        errorAuthor.style.display = 'block';
        submitBtn.disabled = true;
    }
    else{
        errorAuthor.style.display = 'none';
        if(jokeInput.value.length <= 5 || !jokeInput.value){
            submitBtn.disabled = true;
        }
        else  
        submitBtn.disabled = false;
    }
});

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
        if(!authorInput.value){
            submitBtn.disabled = true;
        }
        else
        submitBtn.disabled = false;
    }
});

resetBtn.addEventListener('click', () => {
    authorInput.value = "";
    jokeInput.value = "";
    errorAuthor.style.display="none",
    errorJoke.style.display="none";
});

generateBtn.addEventListener('click', () => {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', "https://api.chucknorris.io/jokes/random", true);
    ajax.addEventListener('load', function () {
        if (ajax.status != 200) {
            return alert("something went wrong");
        }

        let response = JSON.parse(ajax.response);
        jokeInput.value = response.value;
        
        if(jokeInput.value.length <= 5){
            errorJoke.style.display = 'block';
            submitBtn.disabled = true;
        }
        else
            errorJoke.style.display = 'none';
        
        if(!authorInput.value){
            submitBtn.disabled = true;
        }
        else
        submitBtn.disabled = false;
    }
    );
    ajax.addEventListener('error', function () {
        alert("something went wrong");

    });
    ajax.send();
}
);

const getJokes = () => {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', api, true);
    ajax.addEventListener('load', function () {
        if (ajax.status != 200) {
            return alert("something went wrong");
            
        }
        let jokes = JSON.parse(ajax.response);
        jokesCount.innerHTML = jokes.length;

        for(let joke of jokes)
            addJoke(joke);
        
        });
    

    ajax.addEventListener('error', function () {
        alert("something went wrong");

    });
    ajax.send();
}

getJokes();

const addJoke = (joke) => {
    const li = document.createElement('li');

    const likes = document.createElement('div');

    const content = document.createElement('div');
    const author = document.createElement('h3');
    const jokeContent = document.createElement('p');

    const btns = document.createElement('div');
    const deleteButton = document.createElement('button');
    const likeButton = document.createElement('button');

    likes.innerHTML = joke.likeCount + " likes";
    author.innerHTML = joke.author;
    jokeContent.innerHTML = joke.joke;
    deleteButton.innerHTML = "Delete";
    likeButton.innerHTML = "Like";

    likes.classList.add('likes');
    content.classList.add('content');
    btns.classList.add('btns');
    deleteButton.classList.add('delete');
    likeButton.classList.add('likeBtn');

    content.appendChild(author);
    content.appendChild(jokeContent);

    btns.appendChild(deleteButton);
    btns.appendChild(likeButton);

    li.appendChild(likes);
    li.appendChild(content);
    li.appendChild(btns);

    jokesList.appendChild(li);

    likeButton.addEventListener('click', () => {
        let data = {
            author: joke.author,
            joke: joke.joke,
            likeCount: joke.likeCount,
            click: "like"
        };
        const ajax = new XMLHttpRequest();
        ajax.open('PUT', api + "/" + joke.id, true);
        ajax.setRequestHeader('Content-type', 'application/json');
        ajax.addEventListener('load', function () {
            let response = JSON.parse(ajax.response);
            if (response.status == "success") {
                likes.innerHTML = response.joke.likeCount + " likes";
                joke.likeCount = response.joke.likeCount;
            }
            else {
                alert(response.msg);
            }
        }

        );
        ajax.addEventListener('error', function () {
            alert("something went wrong");

        });
        ajax.send(JSON.stringify(data));
    });

    deleteButton.addEventListener('click', () => {
        const ajax = new XMLHttpRequest();
        ajax.open('DELETE', api + "/" + joke.id, true);
        ajax.addEventListener('load', function () {
            let response = JSON.parse(ajax.response);
            if (response.status == "success") {
                jokesCount.innerHTML--;
                li.remove();
            }
            else {
                alert(response.msg);
            }
        });
        ajax.addEventListener('error', function () {
            alert("something went wrong");

        });
        ajax.send();
    }
    );

}




