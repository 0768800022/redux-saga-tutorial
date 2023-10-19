import React from "react";
import { BaseTooltip } from "../form/BaseTooltip";
import { number } from "yup";

const ScheduleFile = ({ schedule }) => {
    let check = JSON.parse(schedule);
    const newCheck = [
        { key: 'M', value: check.t2 },
        { key: 'T', value: check.t3 },
        { key: 'W', value: check.t4 },
        { key: 'T', value: check.t5 },
        { key: 'F', value: check.t6 },
        { key: 'S', value: check.t7 },
        { key: 'S', value: check.cn },
    ];
    let dateString = '';
    newCheck.map((item) => {
        if (item.value) {
            dateString += item.key;
        }
        else {
            dateString += ' ';
        }
    });
    let checkTime = true;
    const today = new Date();
    var dayOfWeek = today.getDay();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const hours = [];
    const minutes = [];
    if (dayOfWeek - 1 < 0) {
        dayOfWeek = 7;
    }
    newCheck.map((item, index) => {
        if (index === dayOfWeek - 1) {
            const inputString = item.value;
            if (inputString) {
                var parts = inputString.split("|");
                // console.log(parts);
            }
            parts.forEach((item) => {
                const [start, end] = item.split("-"); // Tách thành mảng start và end
                const [startHours, startMinutes] = start.split("H").map(Number); // Tách giờ và phút bắt đầu
                const [endHours, endMinutes] = end.split("H").map(Number); // Tách giờ và phút kết thúc

                hours.push(startHours, endHours); // Thêm giờ vào mảng hours
                minutes.push(startMinutes, endMinutes); // Thêm phút vào mảng minutes
            });
        }

        // const firstPart = parts ? parts[0] : 0;
        // const secondPart = parts ? parts[1] : 0;
        // const thirdPart = parts ? parts[2] : 0;
        // // console.log("firstPart " + firstPart + " secondPart " + secondPart + " && " + thirdPart);
        // function timeStringToNumber(timeString) {
        //     const [hour, minute] = timeString.split("H").map(Number);
        //     return { hour, minute };
        // }
        // const firstTime = firstPart ? timeStringToNumber(firstPart) : 0;
        // const secondTime = secondPart ? timeStringToNumber(secondPart) : 0;
        // const thirdTime = thirdPart ? timeStringToNumber(thirdPart) : 0;
        for (let i = 0; i < 6; i++) {
            if (hours[i] <= currentHour && currentHour <= hours[i+1]) {
                return checkTime = true; // Khi i bằng 5, thoát khỏi vòng lặp
            }
            if(i === 5 )
                return checkTime = false;
        }
    });
    const arrayFromInput = dateString.split('');
    const resultArray = arrayFromInput.map((item, index) => (
        <div key={index} style={{
            height: '25px',
            width: '20px',
            textAlign: 'center',
            marginRight: '5px',
        }}>
            <BaseTooltip title={(newCheck[index].value || "Không có lịch").split("|").join(" | ")}>{index === dayOfWeek - 1 ? (
                <span
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        boxShadow: item !== ' ' && checkTime ? '0 0 2px 1px green' : '0 0 2px 1px red',
                        color: dayOfWeek - 1 === index && checkTime ? 'green' : 'red',
                        textAlign: 'center',
                        marginRight: '5px',
                    }}
                >{item}</span>
            ) : <span style={{
                display: 'block',
                width: '100%',
                height: '100%',
                border: '1px solid #000',
            }}>{item}</span>}</BaseTooltip>

        </div>
    ));
    return (
        <div style={{ display: 'flex' }}>
            {resultArray}
        </div>
    );
};

export default ScheduleFile;