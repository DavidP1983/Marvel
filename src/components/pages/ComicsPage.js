import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";
import { useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";


const ComicsPage = () => {
    let location = useLocation();
    localStorage.setItem('url', location.pathname);  // сохраняем url страницы, чтоб при ошибки вернуться именно на страницу комиисов
    return (
        <>
            <HelmetProvider>
                <Helmet>
                <meta
                        name="description"
                        content="Comics's Page"
                    />
                    <title>Comics page</title>
                </Helmet>
            </HelmetProvider>
            <AppBanner />
            <ComicsList />
        </>
    )
}

export default ComicsPage;