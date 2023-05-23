import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import { useContext } from 'react';
import dataCotext from '../context/Context';
import setContent from '../utils/setContent';

import './charInfo.scss';
// import thor from '../../resources/img/thor.jpeg';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const context = useContext(dataCotext);

    const { process, clearError, getOneCharacter, setProcess } = useMarvelService();

    useEffect(() => {
        updateCharInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.charId]);



    const updateCharInfo = () => {
        const { charId } = props;
        if (!charId) {  //if we don't have id,stop method
            return;
        }

        clearError();
        getOneCharacter(charId)
            .then(onCharInfoLoaded)
            .then(() => setProcess('confirmed'))
        // this.foo.bar = 0;
    }


    const onCharInfoLoaded = (char) => {
        setChar(char);
    }



    return (
        <div className="char__info">
            {setContent(process, View, char, context.getComponentName)}
        </div>
    )


}

const View = ({ data, getComponentName }) => {
    const { name, description, thumbnail, homepage, wiki, comicks } = data;

    const reg = /(no description|image_not_available)/ig;
    const style = reg.test(description) ? { 'color': 'red' } : null;
    const styleImg = reg.test(thumbnail) ? { 'objectFit': 'fill' } : null;
    const isEpmty = comicks.length > 0 ? comicks.length : <span>There is no comicks to show</span>;

    //Create comicks items
    const comicksList = comicks.map((item, i) => {
        const { name, resourceURI } = item;
        const id = Number(resourceURI.match(/\d+/g)[1]);   //get id from url comics list http://gateway.marvel.com/v1/public/comics/7403
        return (
            <li className="char__comics-item" key={i} onClick={() => getComponentName('comics')}>
                <div><Link to={`/comics/${id}`}>{name}</Link></div>
            </li>
        )
    });

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={styleImg} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr" style={style}>
                {description}
            </div>
            <div className="char__comics">Comics: {isEpmty}</div>
            <ul className="char__comics-list">
                {comicksList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;