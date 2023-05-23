/* eslint-disable no-unreachable */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import { Fragment } from 'react';
import Spinner from '../spinner/Spinner';
import ButtonSpiner from '../spinner/ButtonSpiner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import { easings  } from 'react-animation';

import './charList.scss';
import '../../style/variables.scss';
// import abyss from '../../resources/img/abyss.jpg';


const setContent = (process ,  newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? null : <Spinner />;
            break;
        case 'confirmed':
            return null;
            break;
        case 'error':
            return <ErrorMessage />
            break;
        default:
            throw new Error('Unexpected process state');
    }
}



const CharList = (props) => {
    const storageLimit = +localStorage.getItem('offset');
    const storageChar = JSON.parse(localStorage.getItem('char')) || [];

    const [char, setChar] = useState(storageChar);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1526);
    const [charEnded, setcharEnded] = useState(false);
    const [limit, setLimit] = useState(storageLimit);


    const { process, getAllCharacters, setProcess } = useMarvelService();

    useEffect(() => {
        updateCharList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const updateCharList = (offsets, initial = true) => {
        // first request, show loading process spinner, second request from the button, no need to show spinner again.
        initial ? setnewItemLoading(false) : setnewItemLoading(true);

        setOffset(offset => offset === limit ? offset + 9 : offset);
        setLimit(limit => limit === offset ? limit + 9 : limit)

        getAllCharacters(offsets)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))

    }

    const onCharListLoaded = (newItem) => {
        //if don't have any more char
        let ended = false;
        if (newItem.length < 9) {
            ended = true;
        }

        setChar(char => [...char, ...newItem]);
        setnewItemLoading(newItemLoading => false);
        setOffset(offset => offset > limit ? offset + 9 : limit);
        localStorage.setItem('offset', offset + 9);

        setcharEnded(charEnded => ended);

    }



    const myRef = useRef([]);

    const onFocusElem = (e) => {
        myRef.current.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        e.target.classList.add('char__item_selected');
    }

    const style = {
        animation: `pop-in ${easings.easeInSine} 1s`
    }

    const rendomChar = (char) => {
        const elements = char.map((item, i) => {
            const { name, thumbnail, id } = item;
            const reg = /image_not_available/ig;
            const styleImg = reg.test(thumbnail) ? { 'objectFit': 'fill' } : null;
            return (
                <Fragment key={id}>
                    <li className="char__item"
                        onClick={(e) => props.getCharListId(e, id)}
                        tabIndex='0'
                        ref={el => myRef.current[i] = el}  //callback ref
                        onFocus={onFocusElem}
                        onKeyDown={(e) => props.getCharListId(e, id)}
                        style={style}
                        >
                        <img src={thumbnail} alt={name} style={styleImg} />
                        <div className="char__name">{name}</div>
                    </li>
                </Fragment>

            )

        });

        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }


    //to avoid duplicate elements in array
    const newArr = char.filter((item, index, arr) => {
        return index === arr.findIndex(obj => {
            return item.id === obj.id
        });
    });

    const view = rendomChar(newArr);

    localStorage.setItem('char', JSON.stringify(newArr));


    const buttonSpiner = newItemLoading ? <div className="inner" style={{ color: '#80bfff' }}>{<ButtonSpiner />}Loading...</div> : <div className="inner">load more</div>;

    return (
        <div className="char__list">
            {setContent(process,  newItemLoading)} 
            {view}

            {charEnded ? <div style={{ display: 'flex', margin: '33px', justifyContent: 'center', color: '#9F0013' }}>There are no more items to show</div>
                : <button
                    className="button button__main button__long"
                    onClick={() => updateCharList(offset, false)}
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}>
                    {buttonSpiner}
                </button>
            }
        </div>
    )

}

// old  function component

// const View = ({char, getCharListId}) => {  
//    const elements = char.map(item => {
//         const { name, thumbnail, id } = item;
//         const reg = /image_not_available/ig;
//         const styleImg = reg.test(thumbnail) ? {'objectFit': 'fill'} : null;
//         return (
//             <Fragment  key={id}>
//                 <li className="char__item" onClick={() => getCharListId(id)} tabIndex='0' ref={this.myCurrentRef}>
//                     <img src={thumbnail} alt={name} style={styleImg}/>
//                     <div className="char__name">{name}</div>
//                 </li>
//             </Fragment>

//         )

//     });

//     return (
//         <ul className="char__grid">
//             {elements}
//         </ul>
//     )
// }

CharList.propTypes = {
    getCharListId: PropTypes.func.isRequired
}

export default CharList;