const express = require("express");

const app = express();

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");
app.use(express.json());

let dbMovie = null;

const dbpath = path.join(__dirname, "moviesData.db");

const intializeDBAndserver = async () => {
  try {
    dbMovie = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Eroor: ${e.message}`);
  }
};

intializeDBAndserver();

// API 1

app.get("/movies/", async (request, response) => {
  const listOfMoviesQuery = `

    SELECT movie_name AS movieName
    FROM movie
    `;

  const movies = await dbMovie.all(listOfMoviesQuery);

  response.send(movies);
});

// API 2

app.post("/movies/", async (request, response) => {
  const movie = request.body;
  const { directorId, movieName, leadActor } = movie;

  const movieAddQuery = `
    
    INSERT INTO 
    movie(director_id,movie_name, lead_actor)
    VALUES 
    (

        ${directorId},
        '${movieName}',
        '${leadActor}'

    )
    
    `;
  const moviePost = await dbMovie.run(movieAddQuery);
  response.send("Movie Successfully Added");
});

// API 3

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;

  const movieDetails = `
    
    SELECT 
      movie_id AS movieId,
      director_id AS directorId,
      movie_name AS movieName,
      lead_actor AS leadActor
    FROM 
    movie
    WHERE
    movie_id = ${movieId}`;

  const movie = await dbMovie.get(movieDetails);
  response.send(movie);
  console.log(movie);
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const { directorId, movieName, leadActor } = request.body;

  const movieDetailsUpadate = `
    
    UPDATE movie
    SET
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'

    WHERE
    movie_id = ${movieId}
    `;
  await dbMovie.run(movieDetailsUpadate);

  response.send("Movie Details Updated");
});

// API 5

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;

  const movieDelete = `
    
    DELETE FROM movie
    WHERE movie_id = ${movieId}`;

  await dbMovie.run(movieDelete);
  response.send("Movie Removed");
});

// API 6

app.get("/directors/", async (request, response) => {
  const directors = `
    SELECT 
    director_id AS directorId,
    director_name AS directorName
    FROM 
    director
    `;
  const directorList = await dbMovie.all(directors);
  response.send(directorList);
});

module.exports = app;

// API 7

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;

  const directorsDetails = `
    SELECT movie_name AS movieName
    FROM 
    movie
    WHERE
    director_id = ${directorId}

    `;
  const movieName = await dbMovie.all(directorsDetails);
  response.send(movieName);
  console.log(movieName);
});
