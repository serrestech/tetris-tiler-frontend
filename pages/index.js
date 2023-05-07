import Grid from "@/components/Grid";
import LetterPicker from "@/components/Grid Options/LetterPicker";
import SizePicker from "@/components/Grid Options/SizePicker";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import ColRowPicker from "@/components/Grid Options/ColRowPicker";
import LetterPickerUnique from "@/components/Grid Options/LetterPickerUnique";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import RotationButton from "@/components/Grid Options/RotationButton";
import FlipButton from "@/components/Grid Options/FlipButton";

export default function Home({ links }) {
    const [showAllButton, setShowAllButton] = useState(false);
    const [showLessButton, setShowLessButton] = useState(false);
    const [sizeData, setSizeData] = useState("");
    const [columnData1, setColumnData1] = useState(5);
    const [columnData4, setColumnData4] = useState(8);
    const [columnData5, setColumnData5] = useState(5);
    const [columnData7, setColumnData7] = useState(5);
    const [rowData1, setRowData1] = useState(5);
    const [rowData4, setRowData4] = useState(8);
    const [rowData5, setRowData5] = useState(5);
    const [rowData7, setRowData7] = useState(5);
    const [uniqueLetterData3, setUniqueLetterData3] = useState("");
    const [uniqueLetterData4, setUniqueLetterData4] = useState("");
    const [blackCellsArray, setBlackCellsArray] = useState([]);
    const [blackCellsArray4, setBlackCellsArray4] = useState([]);
    const [blackCellsArray5, setBlackCellsArray5] = useState([]);
    const [rotationValue4, setRotationValue4] = useState(false);
    const [flipValue4, setFlipValue4] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [task5content, setTask5Content] = useState("");
    const [task7content, setTask7content] = useState("");
    const [task8content, setTask8content] = useState("");
    const [task5filled, setTask5filled] = useState(0);
    const [task5unfilled, setTask5unfilled] = useState(0);
    const [perimeterTask8, setPerimeterTask8] = useState(0);
    const [task2time, setTask2time] = useState(0);
    const [task3time, setTask3time] = useState(0);
    const [task4time, setTask4time] = useState(0);
    const [task5time, setTask5time] = useState(0);
    const [task7time, setTask7time] = useState(0);
    const [task8time, setTask8time] = useState(0);
    const [selectLetters7,setSelectLetters7] = useState()
    const [tasksCompleted, setTasksCompleted] = useState([]);
    //TASK 2 - Getting all the shape information from the API
    const [shapes, setShapes] = useState([]);

    useEffect(() => {
        console.log(tasksCompleted);
    }, [tasksCompleted]);

    async function task2apiCall() {
        await axios.get("http://matsaki95.ddns.net:8900/api/v1/a2-task").then((response) => {
            setTask2time(response.data.pop());
            setShapes(response.data);
        });
    }

    //TASK 3
    const [rotations, setRotations] = useState([]);

    async function task3apiCall() {
        await axios
            .get("http://matsaki95.ddns.net:8900/api/v1/a3-task/?letter=" + uniqueLetterData3)
            .then((response) => {
                setTask3time(response.data.pop());
                setRotations(response.data);
                setTasksCompleted((prev) => {
                    const filteredTasks = prev.filter((task) => task.task !== "task3"); // filter out existing task3
                    const newTask = { task: "task3", time: task3time };
                    return [...filteredTasks, newTask]; // add the new task3
                });
            });
    }

    //TASK 4
    const [allowedPositions, setAllowedPositions] = useState([]);

    function task4apiCall() {
        console.log(blackCellsArray4);
        const finalBlackCellsArray = [];
        for (let i = 0; i < blackCellsArray4.length; i++) {
            finalBlackCellsArray.push([blackCellsArray4[i].col, rowData4 - blackCellsArray4[i].row - 1]);
        }
        let task4data = JSON.stringify({
            gridSizeX: rowData4,
            gridSizeY: columnData4,
            letter: uniqueLetterData4,
            blackHoles: finalBlackCellsArray,
            allowRotations: rotationValue4,
            allowFlip: flipValue4,
        });
        console.log(task4data);
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://matsaki95.ddns.net:8900/api/v1/a4-task",
            headers: {
                Key: "Content-Type",
                Value: "application/json",
                "Content-Type": "application/json",
            },
            data: task4data,
        };

        axios
            .request(config)
            .then((response) => {
                setTask4time(response.data.pop());
                setAllowedPositions(response.data);
                setTasksCompleted((prev) => {
                    const filteredTasks = prev.filter((task) => task.task !== "task4"); // filter out existing task3
                    const newTask = { task: "task4", time: task4time };
                    return [...filteredTasks, newTask]; // add the new task3
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //TASK 5
    function task5apiCall() {
        const finalBlackCellsArray = [];
        for (let i = 0; i < blackCellsArray5.length; i++) {
            finalBlackCellsArray.push([blackCellsArray5[i].col, rowData5 - blackCellsArray5[i].row - 1]);
        }
        let task5data = JSON.stringify({
            gridSizeX: rowData5,
            gridSizeY: columnData5,
            blackHoles: finalBlackCellsArray,
        });
        console.log(finalBlackCellsArray);
        // console.log(task5data);
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://matsaki95.ddns.net:8900/api/v1/a5-task",
            headers: {
                Key: "Content-Type",
                Value: "application/json",
                "Content-Type": "application/json",
            },
            data: task5data,
        };

        axios
            .request(config)
            .then((response) => {
                setTask5time(response.data["timeTaken"]);
                setTask5Content(response.data["grid"]);
                setTask5filled(response.data["filled"]);
                setTask5unfilled(response.data["unfilled"]);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //TASK 7
    function task7apiCall() {


        let task7data = {
            letter1: selectLetters7[0],
            letter2: selectLetters7[1],
            gridSizeX: rowData7,
            gridSizeY: columnData7,
        };

        console.log(task7data);
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "http://matsaki95.ddns.net:8900/api/v1/a7-task",
            headers: {
                Key: "Content-Type",
                Value: "application/json",
                "Content-Type": "application/json",
            },
            data: task7data,
        };
        axios
            .request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                setTask7content(response.data["grid"])
                setTask7time(response.data["timeTaken"])
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //TASK 8
    
    function task8apiCall() {
        axios
            .get("http://matsaki95.ddns.net:8900/api/v1/a8-task")
            .then((response) => {
                const jsonArray = response.data;
                const firstObject = jsonArray[0];

                setTask8content(firstObject.grid);
                setPerimeterTask8(firstObject.perimeter);
                setTask8time(firstObject.timer);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //TASK 10 - Generating Data and Sending them to the API with Axios
    function task10apiCall() {
        var task10data = JSON.stringify({
            x: 5,
            y: 5,
            holes: [{ x: 2, y: 2 }],
            allow_rotations: true,
            allow_flips: false,
            shapes: ["T", "L"],
        });

        // var config = {
        //   method: 'post',
        //   url: 'api',
        //   data: data
        // }
        axios.post("/api/user", task10data).then(
            (response) => {
                const data = response.data;
                //console.log(response)
            },
            (error) => {
                console.log(error);
            }
        );
    }

    //Callback function
    function handleSizeChange(newSize) {
        setSizeData(newSize);
    }

    //Callback function for Columns & Rows Size
    function handleColRowChange1(newSize) {
        setColumnData1(newSize[0]);
        setRowData1(newSize[1]);
    }

    function handleColRowChange4(newSize) {
        setColumnData4(newSize[0]);
        setRowData4(newSize[1]);
    }

    function handleColRowChange5(newSize) {
        setColumnData5(newSize[0]);
        setRowData5(newSize[1]);
    }

    function handleColRowChange7(newSize) {
        setColumnData7(newSize[0]);
        setRowData7(newSize[1]);
    }

    function handleUniqueLetterChange3(newUniqueLetter) {
        setUniqueLetterData3(newUniqueLetter);
    }

    function handleUniqueLetterChange4(newUniqueLetter) {
        setUniqueLetterData4(newUniqueLetter);
    }

    function handleBlackCellsArray(blackCellsArray) {
        setBlackCellsArray(blackCellsArray);
    }

    function handleBlackCellsArray4(blackCellsArray) {
        setBlackCellsArray4(blackCellsArray);
    }

    function handleBlackCellsArray5(blackCellsArray) {
        setBlackCellsArray5(blackCellsArray);
    }

    function handleRotationChange(newRotation) {
        setRotationValue4(newRotation);
    }

    function handleFlipChange(newFlip) {
        setFlipValue4(newFlip);
    }

    function handleLettersChange7(newLetters){
        setSelectLetters7(newLetters)
    }

    //Show All Objects
    const objectsToRender = showAll ? allowedPositions : allowedPositions.slice(0, 3);
    const renderAllObjects = objectsToRender.map((allowedPosition, i) => {
        return (
            <div className="inline-block mx-2" key={i}>
                <Grid
                    onHandleBlackCellsArray={handleBlackCellsArray}
                    isClickable={false}
                    rows={rowData4}
                    columns={columnData4}
                    sizeData={sizeData}
                    colorData={allowedPosition}
                />
            </div>
        );
    });

    
    return (
        <div id="task1" className="my-4 p-2 mt-20 md:px-6 lg:px-14">
            <div className="flex justify-between items-start bg-red-500 p-2 rounded my-4">
                <h1 className="font-semibold ">TASK 1</h1>
            </div>
            <div className="border-2 border-red-200 ">
                <div className="flex flex-col my-4">
                    <div className="flex justify-center items-center">
                        <Grid
                            isClickable={false}
                            rows={rowData1}
                            columns={columnData1}
                            sizeData={sizeData}
                            colorData={""}
                            onHandleBlackCellsArray={handleBlackCellsArray}
                        />
                    </div>
                    <div className="flex justify-center items-center p-4">
                        <SizePicker onSizeChange={handleSizeChange} />
                        <ColRowPicker onColRowChange={handleColRowChange1} />
                    </div>
                </div>
            </div>
            <div id="task2" className="flex justify-between items-start bg-[#f89622] p-2 rounded my-4 ">
                <h1 className="font-semibold">TASK 2</h1>
                <h1 className="font-semibold">Time : {task2time}ms</h1>
            </div>
            <div className="border-2 border-orange-200 pb-4">
                <div className="flex justify-center items-center md:ml-4 lg:ml-8 my-4">
                    <button
                        className="hover:bg-orange-200 rounded bg-white p-2 my-2 border-2 border-black flex"
                        onClick={task2apiCall}
                    >
                        Generate all the shapes!
                    </button>
                </div>
                {shapes.map((shape, i) => {
                    return (
                        <>
                            <div className="inline-block mx-2 text-center">
                                <Grid
                                    onHandleBlackCellsArray={handleBlackCellsArray}
                                    key={i}
                                    rows={5}
                                    columns={5}
                                    sizeData={sizeData}
                                    colorData={shape.content}
                                />
                            </div>
                        </>
                    );
                })}
            </div>
            <div id="task3" className="flex justify-between items-start bg-[#fde100] p-2 rounded my-4">
                <h1 className="font-semibold">TASK 3</h1>
                <h1 className="font-semibold">Time : {task3time}ms </h1>
            </div>
            <div className="border-2 border-yellow-200 pb-4">
                <div className="flex justify-center items-center md:ml-4 lg:ml-8 my-4">
                    <button
                        className="hover:bg-yellow-200 rounded bg-white p-2 my-2 border-2 border-black flex"
                        onClick={task3apiCall}
                    >
                        Generate the Shape`s Rotations
                    </button>
                </div>
                <div className="">
                    <LetterPickerUnique onUniqueLetterChange={handleUniqueLetterChange3} />
                </div>
                {rotations.map((rotation, i) => {
                    return (
                        <>
                            <div className="inline-block mx-2">
                                <Grid
                                    onHandleBlackCellsArray={handleBlackCellsArray}
                                    isClickable={false}
                                    key={i}
                                    rows={5}
                                    columns={5}
                                    sizeData={sizeData}
                                    colorData={rotation.content}
                                />
                            </div>
                        </>
                    );
                })}
            </div>

            <div id="task4" className="flex justify-between items-start bg-[#4eb748] p-2 rounded my-4">
                <h1 className="font-semibold">TASK 4</h1>
                <h1 className="font-semibold">Time : {task4time}ms </h1>
            </div>
            <div className="border-2 border-green-200 pb-4">
                <div className="flex flex-col my-4 ">
                    <div className="flex justify-center items-center">
                        <Grid
                            onHandleBlackCellsArray={handleBlackCellsArray4}
                            isClickable={true}
                            rows={rowData4}
                            columns={columnData4}
                            sizeData={sizeData}
                            colorData={""}
                        />
                    </div>
                    <div className="flex justify-center items-center mr-10 mt-4">
                        <div>
                            <RotationButton onRotationChange={handleRotationChange} />
                        </div>
                        <div>
                            <FlipButton onFlipChange={handleFlipChange} />
                        </div>
                        <div className="ml-[14px]">
                            <ColRowPicker onColRowChange={handleColRowChange4} />
                        </div>
                    </div>
                    <div>
                        <LetterPickerUnique onUniqueLetterChange={handleUniqueLetterChange4} />
                    </div>
                    <div className="flex justify-center items-center md:ml-4 lg:ml-8 my-4">
                        <button
                            className="hover:bg-green-200 rounded bg-white p-2 my-2 border-2 border-black flex"
                            onClick={() => {
                                task4apiCall();
                                setShowAllButton(true);
                            }}
                        >
                            Generate Any Allowed Position
                        </button>
                    </div>
                </div>
                <div className="flex items-center flex-wrap">
                    {renderAllObjects}
                    {!showAll && showAllButton && (
                        <button className="bg-purple-200 p-2 rounded-md t" onClick={() => setShowAll(true)}>
                            Show all
                        </button>
                    )}
                    {showAll && !showLessButton && (
                        <button className="bg-purple-200 p-2 rounded-md t" onClick={() => setShowAll(false)}>
                            Show Less
                        </button>
                    )}
                </div>
            </div>
            <div id="task5" className="flex justify-between items-start bg-blue-400 p-2 rounded my-4">
                <h1 className="font-semibold">TASK 5</h1>
                <h1 className="font-semibold">Time : {task5time}ms </h1>
            </div>
            <div className="flex flex-col my-4">
                <div className="flex justify-center items-center">
                    <Grid
                        onHandleBlackCellsArray={handleBlackCellsArray5}
                        isClickable={true}
                        rows={rowData5}
                        columns={columnData5}
                        sizeData={sizeData}
                        colorData={task5content}
                    />
                </div>
                <div className="flex justify-center items-center mr-10 mt-4">
                    <div className="ml-[14px]">
                        <p>Filled = {task5filled}</p>
                        <p>Unfilled = {task5unfilled}ms</p>
                    </div>
                </div>
                <div className="flex justify-center items-center mr-10 mt-4">
                    <div className="ml-[14px]">
                        <ColRowPicker onColRowChange={handleColRowChange5} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center md:ml-4 lg:ml-8 my-4">
                <div>
                    <button
                        className="rounded bg-white p-2 my-2 mr-8 lg:mr-12 border-2 border-black flex"
                        onClick={task5apiCall}
                    >
                        Generate A Random Shape Button
                    </button>
                </div>
            </div>
            <div id="task6" className="flex justify-between items-start bg-purple-400 p-2 rounded my-4">
                <h1 className="font-semibold">TASK 6</h1>
                <h1 className="font-semibold">Time : {task5time}ms</h1>
            </div>
            <div>
                <p className="font">We are gonna showcase the previous task`s shape in Plain Text</p>
                {task5content.length === 0 ? (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-4 rounded relative"
                        role="alert"
                    >
                        <strong className="font-bold">Warning! </strong>
                        <span className="block sm:inline">Please press the `Generate A Random Shape Button`</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
                    </div>
                ) : (
                    <div className="bg-gray-200 text-center p-2 mx-auto w-[300px] mt-2">
                        <h1 className="font-semibold">{task5content}</h1>
                    </div>
                )}
            </div>
            <div id="task7" className="flex justify-between items-start bg-[#d740ff] p-2 rounded my-4">
                <h1 className="font-semibold">TASK 7</h1>
                <h1 className="font-semibold">Time : {task7time}ms</h1>
            </div>
            <div>
                <p>
                    Please choose <b> Exactly 2 </b>of the options!
                </p>
                <LetterPicker onLettersChange={handleLettersChange7}/>
            </div>
            <div>
                <ColRowPicker onColRowChange={handleColRowChange7} />
            </div>
            <button
                className="rounded bg-white p-2 my-2 mr-8 lg:mr-12 border-2 border-black flex"
                onClick={task7apiCall}
            >
                Generate the Group
            </button>
            <div className="flex justify-center items-center">
                    <Grid
                        onHandleBlackCellsArray={handleBlackCellsArray}
                        isClickable={false}
                        rows={rowData7}
                        columns={columnData7}
                        sizeData={sizeData}
                        colorData={task7content}
                    />
                </div>
            <div id="task8" className="flex justify-between items-start bg-red-500 p-2 rounded my-4">
                <h1 className="font-semibold">TASK 8</h1>
                <h1 className="font-semibold">Time : {task8time}ms</h1>
            </div>
            <div className="flex justify-center items-center">
                <Grid
                    onHandleBlackCellsArray={handleBlackCellsArray}
                    isClickable={false}
                    rows={5}
                    columns={5}
                    sizeData={sizeData}
                    colorData={task8content}
                />
            </div>
            <div>
                <p>Perimeter = {perimeterTask8}</p>
            </div>
            <div className="md:ml-4 lg:ml-8 my-4">
                <button className="rounded bg-white p-2 my-2 border-2 border-black flex" onClick={task8apiCall}>
                    Generate a shape and Calculate the Perimeter
                </button>
            </div>
            <div id="task9" className="flex justify-between items-start bg-[#f89622] p-2 rounded my-4">
                <h1 className="font-semibold">TASK 9</h1>
            </div>
            <div>
                <p>
                    The Function has already been showing some of the times on the previous Headers, but we will show
                    all the times here again.
                </p>
                {task2time === undefined ||
                task3time === undefined ||
                task4time === undefined ||
                task5time === undefined ||
                task7time === undefined || 
                task8time === undefined? (
                    <>
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-4 rounded relative"
                            role="alert"
                        >
                            <strong className="font-bold">Warning! </strong>
                            <span className="block sm:inline">
                                Please run all the tasks to be able to see each task time{" "}
                            </span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3"></span>
                        </div>
                    </>
                ) : (
                    <>
                        <div>test</div>
                    </>
                )}
            </div>
        </div>
    );
}
