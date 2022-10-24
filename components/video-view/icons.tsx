import React from 'react'

export interface IconStyle {
    width?: number,
    height?: number,
    style: { [key: string]: any }
}

export interface ToggleIcon {
    isEnable: boolean
    onClick: ()=>void;
}

export const PauseIcon = ({ width, height, style }: IconStyle) => (
    <svg
        width={width}
        height={height}
        style={style}
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1664 192v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45zm-896 0v1408q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-1408q0-26 19-45t45-19h512q26 0 45 19t19 45z" />
    </svg>
)

export const PlayIcon = ({ width, height, style }: IconStyle) => (
    <svg
        width={width}
        height={height}
        style={style}
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1576 927l-1328 738q-23 13-39.5 3t-16.5-36v-1472q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z" />
    </svg>
)

export const UnMuteIcon = ({ width, height, style }: IconStyle) => (
    <svg
        width={width}
        height={height}
        style={style}
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M832 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45zm384 544q0 76-42.5 141.5t-112.5 93.5q-10 5-25 5-26 0-45-18.5t-19-45.5q0-21 12-35.5t29-25 34-23 29-36 12-56.5-12-56.5-29-36-34-23-29-25-12-35.5q0-27 19-45.5t45-18.5q15 0 25 5 70 27 112.5 93t42.5 142zm256 0q0 153-85 282.5t-225 188.5q-13 5-25 5-27 0-46-19t-19-45q0-39 39-59 56-29 76-44 74-54 115.5-135.5t41.5-173.5-41.5-173.5-115.5-135.5q-20-15-76-44-39-20-39-59 0-26 19-45t45-19q13 0 26 5 140 59 225 188.5t85 282.5zm256 0q0 230-127 422.5t-338 283.5q-13 5-26 5-26 0-45-19t-19-45q0-36 39-59 7-4 22.5-10.5t22.5-10.5q46-25 82-51 123-91 192-227t69-289-69-289-192-227q-36-26-82-51-7-4-22.5-10.5t-22.5-10.5q-39-23-39-59 0-26 19-45t45-19q13 0 26 5 211 91 338 283.5t127 422.5z" />
    </svg>
)

export const MuteIcon = ({ width, height, style }: IconStyle) => (
    <svg
        width={width}
        height={height}
        style={style}
        viewBox="0 0 1792 1792"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1280 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45z" />
    </svg>
)

export const PostureIcon = (props: ToggleIcon & IconStyle) => (
    <svg
        width={props.width}
        height={props.height}
        style={props.style}
        onClick={props.onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512">
        {/* <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
        <path
            fill={props.isEnable ? "black" : "gray"}
            d="M256 64c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zM152.9 169.3c-23.7-8.4-44.5-24.3-58.8-45.8L74.6 94.2C64.8 79.5 45 75.6 30.2 85.4s-18.7 29.7-8.9 44.4L40.9 159c18.1 27.1 42.8 48.4 71.1 62.4V480c0 17.7 14.3 32 32 32s32-14.3 32-32V384h32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V221.6c29.1-14.2 54.4-36.2 72.7-64.2l18.2-27.9c9.6-14.8 5.4-34.6-9.4-44.3s-34.6-5.5-44.3 9.4L291 122.4c-21.8 33.4-58.9 53.6-98.8 53.6c-12.6 0-24.9-2-36.6-5.8c-.9-.3-1.8-.7-2.7-.9z" /></svg>
)

export const WaveformIcon = (props: ToggleIcon & IconStyle) => (
    <svg
        width={props.width}
        height={props.height}
        style={props.style}
        xmlns="http://www.w3.org/2000/svg"
        onClick={props.onClick}
        viewBox="0 0 512 512">

        {/* <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
        <path
            fill={props.isEnable ? "black" : "gray"}
            d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
)