import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import MovieList from "./MovieList";

export class Movie extends Component {
  state = {
    movie: "",
    movieArray: [],
    movieArray2: [],
    movieArray3: [],
    totalCount: 0,
    totalPage: 0,
    perPage: 10,
    currentPage: 1,
    maxPageLimit: 10,
    minPageLimit: 0,
    pageArray: [],
  };

  // async componentDidMount() {
  //   //console.log(this.props.location.search);

  //   //Big trouble and little china
  //   //the simpsons
  //   //Rush hour
  //   //the godfather
  //   //Luca
  //   //Pulp Fiction
  //   //The Matrix
  //   let randomMovieArray = [
  //     "Big trouble in little china",
  //     "the simpsons",
  //     "Rush hour",
  //     "the godfather",
  //     "Luca",
  //     "Pulp Fiction",
  //     "The Matrix",
  //   ];

  //   let randomSelectedMovieIndex = Math.floor(
  //     Math.random() * randomMovieArray.length
  //   );

  //   try {
  //     let randomMovieData = await axios.get(
  //       `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${randomMovieArray[randomSelectedMovieIndex]}`
  //     );

  //     this.setState({
  //       movieArray: randomMovieData.data.Search,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   try {
  //     let searchedMovieTitle =
  //       window.sessionStorage.getItem("searchedMovieTitle");

  //     if (searchedMovieTitle) {
  //       let result = await axios.get(
  //         `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${searchedMovieTitle}`
  //       );

  //       this.setState({
  //         movieArray: result.data.Search,
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }



  getTotalPages = (totalResults, perPage) => {
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalResults / perPage); i++) {
      pages.push(i);
    }

    return pages;
  };

  async componentDidMount() {
    try {
      //check for session storage
      let searchedMovieTitleSessionStorage =
        window.sessionStorage.getItem("searchedMovieTitle");

      if (searchedMovieTitleSessionStorage) {
        let result = await this.handleSearchMovie(
          searchedMovieTitleSessionStorage
        );

        this.setState({
          movieArray: result.data.Search,
        });
      } else {
        let randomMovieTitle = this.handleRandomTitle();
        //let result = await this.handleSearchMovie(randomMovieTitle);
        let result = await this.handleSearchMovie("batman");

        let totalPageArray = this.getTotalPages(
          +result.data.totalResults,
          this.state.perPage
        );

        this.setState({
          movieArray: result.data.Search,
          totalPage: +result.data.totalResults, //in batman result is 440
          pageArray: totalPageArray, //[1,2,3,4...] all the way up to 440
        });

        // let randomMovieTitle = this.handleRandomTitle();

        // let result = this.handleSearchMovie(randomMovieTitle);

        // let result2 = this.handleSearchMovie("batman");
        // let result3 = this.handleSearchMovie("the matrix");

        // let getAllPromiseMovies = Promise.all([result, result2, result3]);

        // let resolvedMovie = await getAllPromiseMovies;

        // console.log(resolvedMovie);

        // this.setState({
        //   movieArray: resolvedMovie[0].data.Search,
        //   movieArray2: resolvedMovie[1].data.Search,
        //   movieArray3: resolvedMovie[2].data.Search,
        // });
      }
    } catch (e) {}
  }

  handleRandomTitle = () => {
    let randomMovieArray = [
      "Big trouble in little china",
      "the simpsons",
      "Rush hour",
      "the godfather",
      "Luca",
      "Pulp Fiction",
      "The Matrix",
    ];
    let randomSelectedMovieIndex = Math.floor(
      Math.random() * randomMovieArray.length
    );
    return randomMovieArray[randomSelectedMovieIndex];
  };

  handleSearchMovie = async (movieTitle) => {
    try {
      let randomMovieData = await axios.get(
        `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${movieTitle}&page=${this.state.currentPage}`
      );

      return randomMovieData;
    } catch (e) {
      return e;
    }
  };



//----------------------------------------------------------------
  handleOnChange = (event) => {
    this.setState({
      movie: event.target.value,
    });
  };

  onSubmit = async (event) => {
    try {
      let result = await axios.get(
        `https://omdbapi.com/?apikey=${process.env.REACT_APP_MOVIE_API}&s=${this.state.movie}`
      );

      console.log(result);

      this.setState({
        movieArray: result.data.Search,
      });
    } catch (e) {
      console.log(e);
    }
  };

  showMovieList = () => {
    return this.state.movieArray.map((item) => {
      return (
        <div
          key={item.imdbID}
          style={{ width: 300, height: 300, marginRight: 25 }}
        >
          <Link
            to={{
              pathname: `/movie-detail/${item.Title}`,
              //search: `?t=${item.Title}`, //?minPrice=20&maxPrice=59&color=white&size=10
            }}
          >
            <div>
              <img src={item.Poster} alt={item.Title} />
            </div>
            <div>
              Title: {item.Title}
              Year: {item.Year}
            </div>
          </Link>
        </div>
      );
    });
  };

  render() {
    console.log(this.props);

    return (
      <div>
        <div
          style={{
            width: 500,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          <input
            type="text"
            placeholder="Search something..."
            name="movie"
            onChange={this.handleOnChange}
          />
          <button onClick={this.onSubmit}>Search</button>
        </div>

        <div
          style={{
            width: 1200,
            margin: "0 auto",
            textAlign: "center",
            marginTop: "50px",
            display: "flex",
          }}
        >
          {this.showMovieList()}
        </div>
      </div>
    );
  }
}

export default Movie;
