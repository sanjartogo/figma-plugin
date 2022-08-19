import * as React from 'react'

interface IconBtnProps {
    onItemPress?: () => void;
    url: string;
    name: string;
    index: number;
}

const IconBtn: React.FC<IconBtnProps> = ({ name, url, onItemPress, index }) => {
    const [isHover, setIsHover] = React.useState(false)
    name = name.split("/").pop().split(".svg").join("")

    const isRight = (index + 1) % 6 === 0
    const isLeft = index % 6 === 0;
    const isCenter = (!isRight && !isLeft)

    const renderPosition = () => {
        if (isCenter) return { left: '50%' }
        if (isRight) return { right: 0 }
        if (isLeft) return { left: 0 }
    }

    const animatedStyle = {
        transform: `translateY(-17px) translateX(${isCenter ? "-50%" : "0"})`,
        width: `calc(${7 * name.length}px)`,
        ...renderPosition()
    }

    const onMouseMoveHandler = () => setIsHover(true)

    const onMouseOutHandler = () => setIsHover(false)

    return (
        <div className="icon__box" onMouseMove={onMouseMoveHandler} onMouseOut={onMouseOutHandler}>
            <img
                onClick={() => onItemPress && onItemPress()}
                src={url}
                className="icons"
                
            />

            <p className={`icon__title ${isHover && "active"}`} style={animatedStyle}>
                <small>
                    {name}
                </small>
            </p>
        </div>
    )
}

export default IconBtn