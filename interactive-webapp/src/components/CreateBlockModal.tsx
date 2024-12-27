"use client";

import { BlockStyle, IBlock } from "@/interfaces/BlockInterfaces";
import { useState } from "react";

export default function CreateBlockModal({isOpen, onClose, onCreate}: {isOpen: boolean, onClose: () => void, onCreate: (block: IBlock) => void}) {
    const [blockName, setBlockName] = useState<string>("");
    const [blockDescription, setBlockDescription] = useState<string>("");
    const [blockStyle, setBlockStyle] = useState<BlockStyle>(BlockStyle.NORMAL);
    const [blockInputs, setBlockInputs] = useState<string[]>([]);
    const [blockOutputs, setBlockOutputs] = useState<string[]>([]);
    const [blockFn, setBlockFn] = useState<string>("");

    const resetState = () => {
        setBlockName("");
        setBlockDescription("");
        setBlockStyle(BlockStyle.NORMAL);
        setBlockInputs([]);
        setBlockOutputs([]);
    }

    const createNewBlock = () => {
        onCreate({
            id: 0,
            x: 0,
            y: 0,
            name: blockName,
            description: blockDescription,
            nInputs: blockInputs.length,
            nOutputs: blockOutputs.length,
            inputNames: blockInputs,
            outputNames: blockOutputs,
            fn: eval(`(${blockFn})`),
            style: blockStyle,
        });
        resetState();
    }

    const cancelCreateBlock = () => {
        resetState();
        onClose();
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 justify-center items-center z-40 flex flex-col">
            <h1>Create Block Modal</h1>
            <div className="flex flex-col w-96">
                <label htmlFor="blockName">Block Name</label>
                <input type="text" id="blockName" value={blockName} onChange={(e) => setBlockName(e.target.value)} className="text-primary-background" placeholder="Block Name"/>
                <label htmlFor="blockDescription">Block Description</label>
                <input type="text" id="blockDescription" value={blockDescription} onChange={(e) => setBlockDescription(e.target.value)} className="text-primary-background" placeholder="Block Description"/>
                <label htmlFor="blockStyle">Block Style</label>
                <select id="blockStyle" value={blockStyle} onChange={(e) => setBlockStyle(e.target.value as BlockStyle)} className="text-primary-background">
                    {Object.values(BlockStyle).map((style) => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
                <label htmlFor="blockInputs">Block Inputs</label>
                <input type="text" id="blockInputs" value={blockInputs.join(",")} onChange={(e) => setBlockInputs(e.target.value.split(","))} className="text-primary-background" placeholder="Input1,Input2"/>
                <label htmlFor="blockOutputs">Block Outputs</label>
                <input type="text" id="blockOutputs" value={blockOutputs.join(",")} onChange={(e) => setBlockOutputs(e.target.value.split(","))} className="text-primary-background" placeholder="Output1,Output2"/>
                <label htmlFor="blockFn">Block Function</label>
                <textarea id="blockFn" value={blockFn} onChange={(e) => setBlockFn(e.target.value)} className="text-primary-background" placeholder="([a, b]: number[]) => a + b"/>
            </div>
            <div className="flex justify-between w-96 mt-4">
                <button className="px-3 py-2 bg-danger rounded text-primary-background" onClick={cancelCreateBlock}>Cancel</button>
                <button className="px-3 py-2 bg-success rounded text-primary-background" onClick={createNewBlock}>Create</button>
            </div>
        </div>
    );
}