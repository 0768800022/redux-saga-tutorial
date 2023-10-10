import React from 'react';
export const CourseIcon = ({ style }) => {
    return (
        <svg
            fill="#1677ff"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 74.174 74.173"
            xmlSpace="preserve"
            stroke="#1677ff"
            style={{ width: '18px', height: '20px', ...style }}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <g>
                    <path d="M37.177,49.667l21.433-8v12.635H15.571V41.912L37.177,49.667z M65.558,45.904v-9.48l8.616-3.214L37.001,19.872L0,33.681 l37.174,13.34l25.742-9.604v8.487c-0.876,0.479-1.494,1.373-1.494,2.44c0,1.551,1.26,2.814,2.815,2.814 c1.554,0,2.814-1.264,2.814-2.814C67.055,47.272,66.434,46.382,65.558,45.904z"></path>
                </g>
            </g>
        </svg>
    );
};

export const FolderIcon = ({ style }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#1677ff"
        style={{ width: '18px', height: '18px', ...style }}
    >
        <path
            d="M21 11V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H15M21 11L15 5M21 11H16.6C16.0399 11 15.7599 11 15.546 10.891C15.3578 10.7951 15.2049 10.6422 15.109 10.454C15 10.2401 15 9.96005 15 9.4V5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default FolderIcon;
