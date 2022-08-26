import * as React from 'react'
import axios from '../../node_modules/axios/index';
import { baseUrl } from '../ui';

interface IconBtnProps {
    onItemPress?: () => void;
    url: string;
    name: string;
    index: number;
}

export interface dropProps {
    dropPosition: {
        clientX: number;
        clientY: number;
    },
    windowSize: {
        width: number;
        height: number;
    },
    offset: {
        x: number;
        y: number;
    },
    itemSize: {
        width: number;
        height: number;
    },
}

const IconBtn: React.FC<IconBtnProps> = ({ name, url, onItemPress, index }) => {
    name = name.split("/").pop().split(".svg").join("")

    const [offset, setDropPosition] = React.useState({
        x: 0,
        y: 0
    })


    const isRight = (index + 1) % 6 === 0
    const isLeft = index % 6 === 0;
    const isCenter = (!isRight && !isLeft)

    const renderPosition = () => {
        if (isCenter) return { left: '50%' }
        if (isRight) return { right: 0 }
        if (isLeft) return { left: 0 }
    }

    const animatedStyle = {
        transform: `translateY(48px) translateX(${isCenter ? "-50%" : "0"})`,
        width: `calc(${7 * name.length}px)`,
        ...renderPosition()
    }



    const onGragHandler = async (dropValues: dropProps) => {
        let res = await axios.get(url);

        parent.postMessage(
            { pluginMessage: { type: "on_drag", data: res.data, dropValues } },
            "*"
        );
    };
    return (
        <div className="icon__box">
            <img
                onDragStart={event => {
                    setDropPosition({
                        x: event.clientX,
                        y: event.clientY
                    })
                }}
                onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {

                    const dropPosition = {
                        clientX: e.clientX,
                        clientY: e.clientY
                    };

                    // Getting the size of the app/browser window.
                    const windowSize = {
                        width: window.outerWidth,
                        height: window.outerHeight
                    };



                    const itemSize = {
                        width: e.currentTarget.clientWidth,
                        height: e.currentTarget.clientHeight
                    };

                    onGragHandler({
                        dropPosition,
                        windowSize,
                        offset,
                        itemSize
                    })
                }}
                onClick={() => onItemPress && onItemPress()}
                src={url}
                className="icons"

            />

            <p className={`icon__title`} style={animatedStyle}>
                <small>
                    {name}
                </small>
            </p>
        </div>
    )
}

export default IconBtn