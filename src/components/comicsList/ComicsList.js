/* eslint-disable no-unreachable */
import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ButtonSpiner from '../spinner/ButtonSpiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import dataCotext from '../context/Context';   // прокидываю пропсы через контекст, Provider которого в App.js

import './comicsList.scss';
// import uw from '../../resources/img/UW.png';
// import xMen from '../../resources/img/x-men.png';


const setContent = (process ,Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />;
            break;
        case 'confirmed':
            return <Component />;
            break;
        case 'error':
            return <ErrorMessage />
            break;
        default:
            throw new Error('Unexpected process state');
    }
}


const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newComicsLoading, setnewComicsLoading] = useState(true);

    const context = useContext(dataCotext);

    const { process, getComicsList, setProcess } = useMarvelService();

    useEffect(() => {
        updateComicsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateComicsList = (offset, initial = true) => {
        initial ? setnewComicsLoading(false) : setnewComicsLoading(true)
        getComicsList(offset)
            .then(comicsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const comicsListLoaded = (newItem) => {
        setComics(char => [...char, ...newItem]);
        setOffset(offset => offset + 8);
        setnewComicsLoading(false);
    }

    const myRef = useRef([]);
    const focusOnItem = (e) => {
        if (e.which === 65 || e.which > 65 || e.which === 9 || e.which === 16 || e.which === 18) {
            return;
        }
        e.target.lastChild.focus();
    }

    const randomChar = (char) => {
        const comicItems = char.map(({ thumbnail, id, title, price }, i) => {
            const styles = /NOT/.exec(price) ? { color: 'red' } : null;
            return (
                <li className="comics__item"
                    key={id}
                    tabIndex={0}
                    ref={el => myRef.current[i] = el}
                    onKeyDown={focusOnItem}
                    onFocus={focusOnItem}
                    onClick={() => context.getComponentName('comics')}
                >
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img" />
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price" style={styles}>{price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {comicItems}
            </ul>
        )
    }

    const filterNewItem = comics.filter((item, index, arr) => {
        return index === arr.findIndex(obj => (
            item.id === obj.id
        ))
    })

    const buttonSpiner = newComicsLoading ? <div className="inner" style={{ color: '#80bfff' }}>{<ButtonSpiner />}Loading...</div> : <div className="inner">load more</div>;

    return (
        <div className="comics__list">

            {setContent(process, () => randomChar(filterNewItem), newComicsLoading)}

            {/* <ul className="comics__grid">
                <li className="comics__item">
                    <a href="#">
                        <img src={uw} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB</div>
                        <div className="comics__item-price">9.99$</div>
                    </a>
                </li>
            </ul> */}
            <button
                className="button button__main button__long"
                onClick={() => updateComicsList(offset, false)}
                disabled={newComicsLoading}>
                {buttonSpiner}
                {/* <div className="inner">load more</div> */}
            </button>
        </div>
    )
}

export default ComicsList;