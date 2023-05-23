/* eslint-disable no-unreachable */
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const ErrorSingleComicsPage = ({id}) => {
    return (
        <div style={{'marginTop': 30}}>
            <ErrorMessage />
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': 24}}>Comics doesn't exist {id}</p>
        </div>
    )
}


const setContent = (process , Component, data, dataType, id) => {
    switch(process) {
        case 'waiting':
            return <Skeleton />;
            break;
        case 'loading':
            return <Spinner />;
            break;
        case 'confirmed':
            return <Component data={data} getComponentName={dataType} />
            break;
        case 'error':
            return id ? <ErrorSingleComicsPage id={id}/> : <ErrorMessage />
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

export default setContent;