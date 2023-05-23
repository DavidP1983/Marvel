/* eslint-disable default-case */
/* eslint-disable no-unreachable */
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, useRef, useCallback } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import { useMemo, useContext } from 'react';
import dataCotext from '../context/Context';
import { Link } from 'react-router-dom';

import './searchPanel.scss';


const setContent = (process) => {
    switch(process) {
        case 'error':
            return <ErrorMessage />
            break;
        }
}



//useMutationObservable
const DEFAULT_OPTIONS = {
    config: { attributes: true, childList: true, subtree: true },
  };
  function useMutationObservable(targetEl, cb, options = DEFAULT_OPTIONS) {
    const [observer, setObserver] = useState(null);
  
    useEffect(() => {
      const obs = new MutationObserver(cb);
      setObserver(obs);
    }, [cb, options, setObserver]);
  
    useEffect(() => {
      if (!observer) return;
      const { config } = options;
      observer.observe(targetEl, config);
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }, [observer, targetEl, options]);
  }


const SearchPanel = (props) => {
    const myRef = useRef();
    const [charname, setcharname] = useState(null);   // либо полный объект приходит при запросе на API либо undefinde
    const [message, setMessage] = useState(false);  // trigger для показа сообщения ошибки или найденного персонажа

    const context = useContext(dataCotext);

    const {getCharName, process, clearError} = useMarvelService();

    
    const mutation = useCallback(
        (mutationList) => {
            setMessage(false); // // когда очищаю input автоматически удаляються сообщения об ошибке
        },
        [setMessage]
      );

      useMutationObservable(myRef.current, mutation);   // когда очищаю input автоматически удаляються сообщения об ошибке
    

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                     .required('This field is required')
                     .matches(/^\D+$/, 'No digits')
                     .min(4, 'Min 4 character required')
        }),
        onSubmit:  async ({name}, action) => {     // name это  values:{name:''} т.е. деструктуризировал 
            action.setSubmitting(true);
            clearError();
            await  getCharName(name)
                        .then(setcharname)
            setMessage(true);

        }
        
    });

    // const errorMessage = error ? <ErrorMessage /> : null;   //формирование серверной ошибки

    // Динамическое формирование ошибки при поиске
    const messageContent = [
        {clazz: 'char_panel__message', contentField: `There is! Visit ${charname?.name} page?`},
        {clazz: 'char_panel__error', contentField: 'The character was not found. Check the name and try again'}
    ];
 
    const content = useMemo(() => {
        for(let i = 0; i < messageContent.length; i++) {
            if(charname) {
                return messageContent[0]
            }
            return messageContent[1]
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[charname]);


    return (
            <form className='char_panel' onSubmit={formik.handleSubmit}>
             <label htmlFor="name">Or find a character by name:</label>
                <input 
                contentEditable
                type="text"
                id='name'
                name='name'
                placeholder='Enter name' 
                ref={myRef}
                {...formik.getFieldProps('name')}  />
                {formik.errors.name && formik.touched.name ? <div className='char_panel__error'>{formik.errors.name}</div> : null}

                {message ? <div className={content.clazz}>{content.contentField}</div> : null}
                {/* {
                   message ? charname ? <div className='char_panel__message'>There is! Visit {charname.name} page?</div> : 
                   <div className='char_panel__error'>The character was not found. Check the name and try again</div>
                    : null
                } */}
                <div className="char_panel__btns">
                        <button className="button button__main" type='submit' disabled={formik.isSubmitting}> 
                          {/* !(formik.isValid && formik.dirty) ||  formik.isSubmitting  -  можно и данную конструкцию добавить кнопке, таким образом работает иначе в атрибут  disabled*/} 
                            <div className="inner">FIND</div>
                        </button>
                        {
                            message && charname ?  <Link to={`/characters/${charname.id}`} className="button button__secondary" onClick={() => context.getComponentName('search')}>
                                <div className="inner">TO PAGE</div>
                            </Link> : null
                        }
                </div>
                {/* {errorMessage} */}
                {setContent(process)}
            </form>
    )
}


export default SearchPanel;