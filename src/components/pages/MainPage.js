import { useState } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import { SearchPanel } from '../pages';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";


import { useLocation } from "react-router-dom";


import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    let location = useLocation();
    localStorage.setItem('url', location.pathname);  // сохраняем url страницы, чтоб при ошибки вернуться именно на главную страницу

    const [id, setId] = useState(null);

    const getCharListId = (e, id) => {

        if (e.which === 65 || e.which > 65 || e.which === 9 || e.which === 16 || e.which === 18) {
            return;
        }

        setId(id);
    }

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <meta
                        name="description"
                        content="Marvel information portal"
                    />
                    <title>Marvel information portal</title>
                </Helmet>
            </HelmetProvider>

            <ErrorBoundary>
                <RandomChar />
            </ErrorBoundary>

            <div className="char__content">

                <ErrorBoundary>
                    <CharList getCharListId={getCharListId} />
                </ErrorBoundary>

                <ErrorBoundary>
                    <div style={{ position: 'sticky', top: '10px', 'zIindex': 5 }}>
                        <CharInfo charId={id} />
                        <SearchPanel />
                    </div>

                </ErrorBoundary>

            </div>
            <img className="bg-decoration" src={decoration} alt="vision" />
        </>
    )
}

export default MainPage;