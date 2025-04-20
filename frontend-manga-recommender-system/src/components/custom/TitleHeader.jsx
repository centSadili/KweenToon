import React, {useEffect} from 'react'

const TitleHeader = (title) => {
    useEffect(()=>{
        document.title = `${title} | KwenToon`
    },[title])
}

export default TitleHeader
