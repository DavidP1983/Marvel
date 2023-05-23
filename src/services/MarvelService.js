import { useHttp } from '../hooks/http.hook';
import { key } from '../index';

const useMarvelService = () => {
    const {  process, request, clearError, setProcess } = useHttp();

    const _apiUrl = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = `apikey=${key}`;
    const _baseOffset = 210;
    const _baseLimit = 9;
    const _comicsLimit = 8;

    // const getResource = async (url) => {
    //     const res = await fetch(url);
    //     if(!res.ok) {
    //         throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    //     }
    //     return await res.json();
    // }

    const getAllCharacters = async (offset = _baseOffset, limit = _baseLimit) => {
        const res = await request(`${_apiUrl}characters?limit=${limit}&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter); // all characters [{...}, {...}, {...}]
    }

    const getOneCharacter = async (id) => {
        const res = await request(`${_apiUrl}characters/${id}?${_apiKey}`); // getting big obj { { [{...}] } }
        const { data } = res; // Destructuring and getting main obj { [{...}] }
        return _transformCharacter(data.results[0]); // access to our element in array. An obj for one character {...}
    }

    const getComicsList = async (offset = _baseOffset, limit = _comicsLimit) => {
        const res = await request(`${_apiUrl}comics?issueNumber=2&limit=${limit}&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getSingleComic = async (id) => {
        const res = await request(`${_apiUrl}comics/${id}?${_apiKey}`);
        const {data} = res;
        return _transformComics(data.results[0])
    }

    const getCharName = async (name) => {
        const res = await request(`${_apiUrl}characters?name=${name}&${_apiKey}`);
        const {data} = res;
        return _transformCharacter(data.results[0]);
    }

    const _transformCharacter = (char) => {
        if(!char) {
            return char;
        }
        const descrModified = char.description ? `${char.description.slice(0, 174)}...` : 'There is no description for this character';
        const cutComics = char.comics.items.length > 11 ? char.comics.items.slice(0, 10) : char.comics.items;
        return {
            name: char.name,
            description: descrModified,
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comicks: cutComics,
            id: char.id,
        }
    }

    const _transformComics = (char) => {
        const cutTitle = char.title.length >= 51 ? char.title.slice(0, -3) : char.title;
        return {
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            id: char.id,
            title: cutTitle,
            price: char.prices[0].price ? `${char.prices[0].price}$`: null  || 'NOT AVAILABLE',
            description: char.description ? `${char.description.slice(0, 174)}...` : 'There is no description for this character',
            pages: char.pageCount ? `${char.pageCount} pages`: 'No information about the number of pages',
            language: char.textObjects.language || "en-us"
        }
    }
    
    return {
        process, 
        clearError, 
        getAllCharacters, 
        getOneCharacter, 
        getComicsList, 
        getSingleComic, 
        getCharName,
        setProcess}
}


export default useMarvelService;