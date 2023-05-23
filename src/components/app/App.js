import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// import { MainPage, ComicsPage, Page404, SingleComicPage } from '../pages';
import { useState } from 'react';
import AppHeader from "../appHeader/AppHeader";
import PreLoader from "../spinner/PreLoader";
import dataCotext from '../context/Context';

const { Provider } = dataCotext;   // для прокидывание пропсов напрямую в компоненты 

const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));
const Page404 = lazy(() => import('../pages/404'));



const App = () => {
    const [data, setName] = useState({
        name: '',
        getComponentName: getComponentName
    });

    function getComponentName(name) {
        setName({...data, name});
    }


    return (
        <Provider value={data}>
            <Router>
                <div className="app">
                    <AppHeader />
                    <main>

                        <Suspense fallback={<PreLoader />}>
                            <Switch>
                                <Route exact path="/">
                                    <MainPage  />
                                </Route>

                                <Route exact path="/comics">
                                    <ComicsPage  />
                                </Route>
                                <Route exact path="/comics/:id">
                                    <SingleComicPage  />
                                </Route>
                                <Route exact path="/characters/:id">
                                    <SingleComicPage  />
                                </Route>
                                <Route path="*">
                                    <Page404 />
                                </Route>
                            </Switch>
                        </Suspense>

                    </main>
                </div>
            </Router>
        </Provider>
    )
}

export default App;