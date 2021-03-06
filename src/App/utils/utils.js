import * as Constants from "../constants/constants";
import { fetchAlbums, fetchSongs } from "../redux/actions/fetchActions";

export const findSong = (songs, id) => {
  const parsedId = parseInt(id, 10);
  let result = songs.find(song => song.id === parsedId);
  result = result === undefined ? [] : [result];
  return result;
};

/**
 * Obtiene una subcoleccion de canciones aleatorias
 * con un tamaño maximo de 6
 *
 * @param {*} songs
 */
export const getRecommendedSongs = songs => {
  let maxLength = 6;
  let length =
    songs.length >= maxLength ? maxLength : Math.floor(songs.length / 2);
  return songs.sort(() => Math.random() - 0.5).slice(0, length);
};

export const getInitialValueByPath = () => {
  let initialValue;
  let path = window.location.pathname;
  switch (path) {
    case "/":
      initialValue = Constants.START;
      break;
    case "/recent":
      initialValue = Constants.RECENT;
      break;
    case "/search":
      initialValue = Constants.SEARCH;
      break;
    case "/albums":
      initialValue = Constants.ALBUMS;
      break;
    case "/login":
      initialValue = Constants.LOGIN;
      break;
    case "/profile":
      initialValue = Constants.PROFILE;
      break;
    default:
      if (path.match(/\/player\/\d{1,}/)) {
        initialValue = Constants.PLAYER;
      } else {
        initialValue = Constants.START;
      }
  }
  return initialValue;
};

export const getSongsAlbum = (songs, albums) =>
  songs.reduce((result, song) => {
    song = {
      ...song,
      album: albums.items.find(album => song.album_id === album.id)
    };
    return [...result, song];
  }, []);

export const addRecentSong = id => {
  id = id.toString();
  let recentSongs = [localStorage.getItem("recentSongs")];

  if (!recentSongs || !recentSongs[0]) {
    localStorage.setItem("recentSongs", [id]);
  } else {
    recentSongs = recentSongs[0].split(",");

    if (!recentSongs.includes(id)) {
      if (recentSongs.length === 5) {
        recentSongs.shift();
      }
      recentSongs.push(id);
      localStorage.setItem("recentSongs", recentSongs);
    }
  }
};

export const getRecentSongs = songs => {
  let recentSongs = [localStorage.getItem("recentSongs")];

  if (recentSongs !== null && recentSongs[0] !== null) {
    recentSongs = recentSongs[0].split(",");

    return songs.items.filter(({ id }) => recentSongs.includes(id.toString()));
  }

  return [];
};

export const createUpdateDOMNode = () => {
  let div = document.createElement("div");
  div.id = "updateApplication";
  div.innerHTML =
    'Hay una nueva versión de esta aplicación<button id="reload">Recargar</button></div>';

  let modal = document.getElementById("modal");
  modal.parentNode.insertBefore(div, modal.nextSibling);
};

/**
 * Funcion comun para ejecutar las acciones Fetch
 * de Albums y Canciones y guardarlas en el store
 */
export const fetchResourcesAndSaveToStore = (
  albums,
  songs,
  getAlbums,
  getSongs
) => {
  // Comprobamos que no se esta haciendo ya la carga
  // o que haya finalizado
  if (
    !albums.isLoading &&
    !albums.error &&
    albums.items &&
    albums.items.length === 0
  ) {
    getAlbums();
  }
  if (
    !songs.isLoading &&
    !songs.error &&
    songs.items &&
    songs.items.length === 0
  ) {
    getSongs();
  }
};

export const resourcesAreLoaded = (albums, songs) =>
  albums &&
  albums.items &&
  albums.items.length > 0 &&
  songs &&
  songs.items &&
  songs.items.length > 0;

/**
 * Funcion comun para sacar a props el state de redux
 */
export const mapStateToProps = state => {
  return {
    ...state
  };
};

/**
 * Funciones comunes para conectar componentes con
 * las acciones Fetch de Albums y Canciones
 */
export const fetchMapDispatchToProps = dispatch => {
  return {
    getAlbums: () => dispatch(fetchAlbums()),
    getSongs: () => dispatch(fetchSongs())
  };
};

export const parseSeconds = seconds =>
  Number.isInteger(seconds)
    ? `${Math.floor(seconds / 60)}:${seconds % 60}`
    : "";
