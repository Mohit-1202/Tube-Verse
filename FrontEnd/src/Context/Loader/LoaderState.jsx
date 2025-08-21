/* eslint-disable react/prop-types */
import { useRef } from "react";
import LoaderContext from "./LoaderContext"
import LoadingBar from "react-top-loading-bar";

const LoaderState = ({children}) => {
    const ref = useRef(null)
    const startLoading = () => ref.current?.continuousStart();
    const stopLoading = () => ref.current?.complete();
    return(
        <LoaderContext.Provider value={{startLoading, stopLoading}}>
            <LoadingBar color="#FF9200" ref={ref} height={3}  />
            {children}
        </LoaderContext.Provider>
    )
}

export default LoaderState