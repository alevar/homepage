import React, { useState } from "react";

import "./SplicingVariation.css";

import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import SplicePlotWrapper from "./components/SplicePlot/SplicePlotWrapper";

import { parseBed } from "../../utils/Parsers/Parsers";
import { BedFile, Transcriptome } from "../../types/api";

const SplicingVariation: React.FC = () => {
    const [transcriptome, setTranscriptome] = useState<Transcriptome>(new Transcriptome());
    const [fontSize, setFontSize] = useState<number>(10);
    const [width, setWidth] = useState<number>(1100);
    const [height, setHeight] = useState<number>(700);
    const [bedFiles, setBedFiles] = useState<BedFile[]>([]);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleGtfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const txdata = await Transcriptome.create(file);
                console.log("txdata", txdata);
                setTranscriptome(txdata);
            } catch (error) {
                setTranscriptome(new Transcriptome());
                setErrorMessage("Unable to parse the file. Please make sure the file is in GTF format. Try to run gffread -T to prepare your file.");
                setErrorModalVisible(true);
            }
        }
    };

    const handleBedFileUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const bed_data: BedFile = await parseBed(file);
                const newBedFiles = [...bedFiles];
                newBedFiles[index] = bed_data;
                setBedFiles(newBedFiles);
            } catch (error) {
                const newBedFiles = [...bedFiles];
                newBedFiles[index].status = -1;
                setBedFiles(newBedFiles);
                setErrorMessage("Unable to parse the file. Please make sure the file is in BED format.");
                setErrorModalVisible(true);
            }
        }
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

    const handleAddBedFile = () => {
        setBedFiles([...bedFiles, { data: [], fileName: "", status: 0 }]);
    };

    const handleRemoveBedFile = (index: number) => {
        const newBedFiles = bedFiles.filter((_, i) => i !== index);
        setBedFiles(newBedFiles);
    };

    return (
        <div className="splicemap-plot">
            <SettingsPanel
                onGTFUpload={handleGtfUpload}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                width={width}
                onWidthChange={setWidth}
                height={height}
                onHeightChange={setHeight}
                bedFiles={bedFiles}
                onBedFileUpload={handleBedFileUpload}
                onAddBedFile={handleAddBedFile}
                onRemoveBedFile={handleRemoveBedFile}
            />

            <div className="visualization-container">
                <SplicePlotWrapper
                    transcriptome={transcriptome}
                    bedFiles={bedFiles}
                    width={width}
                    height={height}
                    fontSize={fontSize}
                />
            </div>

            <ErrorModal
                visible={errorModalVisible}
                message={errorMessage}
                onClose={closeErrorModal}
            />
        </div>
    );
};

export default SplicingVariation;
