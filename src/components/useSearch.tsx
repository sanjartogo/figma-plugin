import * as React from "react";

export const useSearch = () => {
    const [searchInput, setSearchInput] = React.useState("")
    const [icons, setIcons] = React.useState([])

    const onChangeInput = (event:React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setSearchInput(value)
    }

    const onClearInput = () => {
        setSearchInput("")
    }

    return {
        searchInput,
        icons,
        onChangeInput,
        onClearInput,
        setIcons
    }
}
