function toggleTheme(e) {
    if (e.id == "toggle-on") {
        document.getElementById("toggle-off").className = "d-block pointer";
        document.getElementById("toggle-on").className = "d-none pointer";
        // Lite Mode
        document.querySelector("header").style.backgroundColor = "#f1f5f9";
        document.querySelector("#key").style.border = "1px solid black";
        document.querySelector("#search").style.border = "1px solid black";
        document.querySelector(".info").style.backgroundColor = "#f1f5f9";
        document.querySelectorAll(".info p").forEach(e => e.style.color = "#000");
        document.querySelector(".movie-name").style.color = "#ffc107";
        document.querySelectorAll(".titles p").forEach(e => e.style.color = "#000");
        document.querySelector(".degrees").style.backgroundColor = "#000";
        document.querySelector(".degrees").style.color = "#f1f5f9";
        document.querySelector(".top").style.backgroundColor = "#ffc107";
        document.querySelector(".similars").style.backgroundColor = "#f1f5f9";
        document.querySelector(".similar-text").style.borderLeft = "3px solid #ffc107";
        document.querySelector(".similar-text").style.color = "#000";
        document.querySelector(".similars").style.backgroundColor = "#f1f5f9";
    }
    else {
        document.getElementById("toggle-on").className = "d-block pointer";
        document.getElementById("toggle-off").className = "d-none pointer";
        // Dark Mode
        document.querySelector("header").style.backgroundColor = "#000";
        document.querySelector("#key").style.border = "none";
        document.querySelector("#search").style.border = "none";
        document.querySelector(".info").style.backgroundColor = "#000";
        document.querySelectorAll(".info p").forEach(e => e.style.color = "#fff");
        document.querySelector(".movie-name").style.color = "yellow";
        document.querySelectorAll(".titles p").forEach(e => e.style.color = "#000");
        document.querySelector(".degrees").style.backgroundColor = "#fff";
        document.querySelector(".degrees").style.color = "#000";
        document.querySelector(".top").style.backgroundColor = "yellow";
        document.querySelector(".similars").style.backgroundColor = "#000";
        document.querySelector(".similar-text").style.borderLeft = "3px solid yellow";
        document.querySelector(".similar-text").style.color = "#fff";
    }
}
function setAlert(alert) {
    document.querySelector('.alert').style.display = "block";
    document.querySelector('.alert-text').innerHTML += (document.querySelector('.alert-text').innerHTML == "") ? alert : `<br>${alert}`;
}
function closeAlert() {
    document.querySelector('.alert').style.display = "none";
    document.querySelector('.alert-text').innerHTML = "";
}
function search() {
    var title = document.getElementById('search').value;
    var key = document.getElementById("key").value;
    if (key == "") {
        setAlert("API KEY field is empty");
        return;
    }
    else if (title == "") {
        setAlert("Movie title is empty");
        return;
    }
    document.getElementsByClassName("loading-section")[0].style.display = "flex";
    fetch(`https://imdb-api.com/en/API/Search/${key}/${title}`)
        .then(response => response.json())
        .then(
            (response) => {
                if (response.results.length == 0 || response.results == undefined) {
                    document.getElementsByClassName("loading-section")[0].style.display = "none";
                    setAlert("Movie Not Found Or Maximum Requests Per Day Occurred");
                    return;
                }
                var id = response.results[0].id;
                fetch(`https://imdb-api.com/en/API/Title/${key}/${id}`)
                    .then(response => response.json())
                    .then(
                        (response) => {
                            document.getElementsByClassName('movie-name')[0].innerHTML = response.title;
                            response.runtimeStr = (response.type == "TVSeries") ? response.tvSeriesInfo.seasons.length.toString() + " Seasons" : response.runtimeStr;
                            document.getElementsByClassName('movie-time')[0].innerHTML = response.year + " - " + response.runtimeStr;
                            var genres = response.genres.split(", ");
                            var allTags = "";
                            for (let i = 0; i < genres.length; i++) {
                                allTags = `<div class="tag">${genres[i]}</div>`
                            }
                            document.getElementsByClassName('tags')[0].innerHTML = allTags
                            document.getElementsByClassName("description")[0].innerHTML = response.plot;
                            document.getElementsByClassName("movie-score")[0].innerHTML = parseFloat(response.imDbRating).toFixed(1);
                            document.getElementsByClassName("director-name")[0].innerHTML = (response.type == "TVSeries") ? response.tvSeriesInfo.creators : response.directors;
                            document.getElementsByClassName("writer-name")[0].innerHTML = (response.type == "TVSeries") ? response.tvSeriesInfo.creators : response.writers;
                            document.getElementsByClassName("stars-names")[0].innerHTML = response.stars;
                            document.getElementsByClassName("movie-card")[0].src = response.image;
                            response.awards = response.awards.replace("Awards, ","");
                            document.getElementsByClassName("top")[0].innerHTML = (response.awards.split(" | ").length == 2) ? response.awards.split(" | ")[0] : "";
                            if(response.awards.split(" | ").length == 1){
                                document.getElementsByClassName("top")[0].style.display = "none";
                                document.getElementsByClassName("degrees")[0].style.width = "100%";
                            }
                            document.getElementsByClassName("degrees")[0].innerHTML = (response.awards.split(" | ").length == 2) ? response.awards.split(" | ")[1] : response.awards.split(" | ")[0];
                            // Set Similar Movies
                            for (let i = 0; i < 4; i++) {
                                document.getElementsByClassName("similar-name")[i].innerHTML = response.similars[i].title;
                                document.getElementsByClassName("similar-rate")[i].innerHTML = response.similars[i].imDbRating;
                                document.getElementsByClassName("similar-img")[i].src = response.similars[i].image;
                            }
                            document.getElementsByClassName("loading-section")[0].style.display = "none";
                        },
                        (error) => {
                            document.getElementsByClassName("loading-section")[0].style.display = "none";
                            setAlert(`Error Occurred : ${error}`)
                        }
                    )
            },
            (error) => {
                document.getElementsByClassName("loading-section")[0].style.display = "none";
                setAlert(`Error Occurred : ${error}`)
            }
        )
        document.querySelector('.alert-text').innerHTML = "";
}


setInterval(() => {
    if(document.getElementsByClassName("loading-section")[0].style.display != "none"){
    var loadingText = document.getElementsByClassName("loader-text")[0].innerHTML;
    if(loadingText == "Loading Data from IMDB "){
        document.getElementsByClassName("loader-text")[0].innerHTML = "Loading Data from IMDB .";
    }
    else if(loadingText == "Loading Data from IMDB ."){
        document.getElementsByClassName("loader-text")[0].innerHTML = "Loading Data from IMDB ..";
    }
    else if(loadingText == "Loading Data from IMDB .."){
        document.getElementsByClassName("loader-text")[0].innerHTML = "Loading Data from IMDB ...";
    }
    else if(loadingText == "Loading Data from IMDB ..."){
        document.getElementsByClassName("loader-text")[0].innerHTML = "Loading Data from IMDB ";
    }
}
}, 500);