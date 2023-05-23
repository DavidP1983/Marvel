import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Helmet, HelmetProvider } from "react-helmet-async";

import useMarvelService from '../../services/MarvelService';
import AppBanner from '../appBanner/AppBanner';
import dataCotext from '../context/Context';
import setContent from '../utils/setContent';

import './singleComicPage.scss';
// import xMen from '../../resources/img/x-men.png';

const SingleComic = (props) => {
    const [singleComic, setSingleComic] = useState({});

    const context = useContext(dataCotext);

    const { id } = useParams();
    const { process, clearError, getSingleComic, getOneCharacter, setProcess } = useMarvelService();

    useEffect(() => {
        clearError();

        getProperComics();

        //    getOneCharacter(id)
        //         .then(setSingleComic)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);   /*если пользователь вручную введет id в строку поиска, то компонент мог правильно перерисоваться. Для этого и поставили зависимость от id  */


    const getProperComics = () => {
        switch (context.name) {
            case 'comics':
                return getSingleComic(id).then(setSingleComic).then(() => setProcess('confirmed'));
            case 'search':
                return getOneCharacter(id).then(setSingleComic).then(() => setProcess('confirmed'));
            default:
                getSingleComic(id).then(setSingleComic).then(() => setProcess('confirmed'));  //ручной ввод id в адрессную строку
        }
    }



    return (
        <>
            <AppBanner />
            {setContent(process, View, singleComic, context.name, id)}
        </>
    )
}

const View = ({ data, getComponentName }) => {
    const { thumbnail, title, description, pages, language, price, name } = data;
    const reg = /image_not_available/ig;
    const styleImg = reg.test(thumbnail) ? { 'objectFit': 'fill' } : null;
    return (
        <>
            <div className="single-comic">

                <HelmetProvider>
                    <Helmet>
                        <meta
                            name="description"
                            content={`${title} comics book`}
                        />
                        <title>{title}</title>
                    </Helmet>
                </HelmetProvider>

                <img src={thumbnail} alt={title || name} className="single-comic__img" style={styleImg} />
                <div className="single-comic__info">

                    {
                        getComponentName === 'comics' || title ? // когда вручную ввожу id, то необходим добполнительный триггер title, который будет отбражать страницу
                            <>
                                <h2 className="single-comic__name">{title}</h2>
                                <p className="single-comic__descr">{description}</p>
                                <p className="single-comic__descr">{pages}</p>
                                <p className="single-comic__descr">Language: {language}</p>
                                <div className="single-comic__price">{price}</div>
                            </>
                            :
                            <>
                                <h2 className="single-comic__name">{name}</h2>
                                <p className="single-comic__descr">{description}</p>
                            </>
                    }


                </div>
                <Link to="/comics" className="single-comic__back">Back to all</Link>


            </div>

        </>



    )
}

export default SingleComic;