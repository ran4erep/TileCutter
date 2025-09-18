
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ResetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-7.95 0a4.5 4.5 0 0 1 6.364 0l3.18 3.185" />
    </svg>
);

const ZoomInIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
    </svg>
);

const ZoomOutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
    </svg>
);

const FitScreenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);

interface ModalState {
    isOpen: boolean;
    col: number;
    row: number;
}

const SingleTileModal: React.FC<{
    modalData: ModalState;
    fileNameTemplate: string;
    onClose: () => void;
    generateTileDataUrl: (col: number, row: number) => string | null;
    downloadDataUrl: (dataUrl: string, filename: string) => void;
}> = ({ modalData, fileNameTemplate, onClose, generateTileDataUrl, downloadDataUrl }) => {
    if (!modalData.isOpen) return null;

    const { col, row } = modalData;

    const [fileName, setFileName] = useState(`${fileNameTemplate}_${row}_${col}`);
    const [saveTileAsBase64, setSaveTileAsBase64] = useState(false);
    const [copied, setCopied] = useState(false);
    const [base64Output, setBase64Output] = useState<string | null>(null);

    useEffect(() => {
        if (modalData.isOpen) {
            setFileName(`${fileNameTemplate}_${row}_${col}`);
            setSaveTileAsBase64(false);
            setCopied(false);
            setBase64Output(null);
        }
    }, [modalData, fileNameTemplate, row, col]);

    const handleDownload = () => {
        const dataUrl = generateTileDataUrl(col, row);
        if (!dataUrl) return;

        if (saveTileAsBase64) {
            setBase64Output(dataUrl);
        } else {
            downloadDataUrl(dataUrl, `${fileName}.png`);
            onClose();
        }
    };

    const handleCopy = () => {
        if (!base64Output) return;
        navigator.clipboard.writeText(base64Output).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleBack = () => {
        setBase64Output(null);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-lg text-slate-200" onClick={e => e.stopPropagation()}>
                {base64Output ? (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-semibold text-cyan-400">Base64 Строка</h3>
                        <textarea
                            readOnly
                            value={base64Output || ''}
                            className="w-full h-48 bg-slate-900 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
                        />
                        <div className="flex gap-4">
                            <button onClick={handleCopy} className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-all duration-300">
                                <CopyIcon className="w-5 h-5"/>
                                <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
                            </button>
                            <button onClick={handleBack} className="w-full px-5 py-3 bg-slate-600 text-slate-200 font-bold rounded-lg hover:bg-slate-700 transition-all duration-300">
                                Назад
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <h3 className="text-xl font-semibold text-cyan-400">Скачать тайл ({col}, {row})</h3>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="singleTileName" className="font-medium text-slate-300">Имя файла (без .png)</label>
                            <input
                                id="singleTileName"
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="saveTileAsBase64"
                                checked={saveTileAsBase64}
                                onChange={(e) => setSaveTileAsBase64(e.target.checked)}
                                className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600"
                            />
                            <label htmlFor="saveTileAsBase64" className="font-medium text-slate-300">Сохранить как Base64 строку</label>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-slate-700">
                            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-all duration-300">
                                <DownloadIcon className="w-5 h-5"/>
                                <span>Скачать</span>
                            </button>
                            <button onClick={onClose} className="w-full px-5 py-3 bg-slate-600 text-slate-200 font-bold rounded-lg hover:bg-slate-700 transition-all duration-300">
                                Отмена
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function App() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [imageName, setImageName] = useState<string>('');
    const [tileWidth, setTileWidth] = useState<string>('128');
    const [tileHeight, setTileHeight] = useState<string>('128');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [fileNameTemplate, setFileNameTemplate] = useState<string>('');
    const [saveAsBase64, setSaveAsBase64] = useState<boolean>(false);
    const [modalData, setModalData] = useState<ModalState>({ isOpen: false, col: 0, row: 0 });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const lastMousePositionRef = useRef({ x: 0, y: 0 });

    const numTileWidth = useMemo(() => Math.max(1, parseInt(tileWidth) || 1), [tileWidth]);
    const numTileHeight = useMemo(() => Math.max(1, parseInt(tileHeight) || 1), [tileHeight]);

    const gridDimensions = useMemo(() => {
        if (!image || numTileWidth <= 0 || numTileHeight <= 0) return { cols: 0, rows: 0 };
        return {
            cols: Math.ceil(image.naturalWidth / numTileWidth),
            rows: Math.ceil(image.naturalHeight / numTileHeight),
        };
    }, [image, numTileWidth, numTileHeight]);

    const fitToScreen = useCallback(() => {
        if (!image || !previewContainerRef.current) return;
        const { clientWidth: containerWidth, clientHeight: containerHeight } = previewContainerRef.current;
        const { naturalWidth: imgWidth, naturalHeight: imgHeight } = image;

        if (imgWidth === 0 || imgHeight === 0) return;

        const scaleX = containerWidth / imgWidth;
        const scaleY = containerHeight / imgHeight;
        const newScale = Math.min(scaleX, scaleY) * 0.95; // 95% to have some padding

        const newX = (containerWidth - imgWidth * newScale) / 2;
        const newY = (containerHeight - imgHeight * newScale) / 2;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
    }, [image]);

    useEffect(() => {
        fitToScreen();
        window.addEventListener('resize', fitToScreen);
        return () => window.removeEventListener('resize', fitToScreen);
    }, [fitToScreen]);


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setImage(img);
                const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.') || 'tile';
                setImageName(file.name);
                setFileNameTemplate(nameWithoutExtension);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setImage(null);
        setImageName('');
        setTileWidth('128');
        setTileHeight('128');
        setFileNameTemplate('');
        setSaveAsBase64(false);
        setModalData({ isOpen: false, col: 0, row: 0 });
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const generateTileDataUrl = useCallback((col: number, row: number): string | null => {
        if (!image || numTileWidth <= 0 || numTileHeight <= 0) return null;

        const sx = col * numTileWidth;
        const sy = row * numTileHeight;

        if (sx >= image.naturalWidth || sy >= image.naturalHeight) return null;

        const sWidth = Math.min(numTileWidth, image.naturalWidth - sx);
        const sHeight = Math.min(numTileHeight, image.naturalHeight - sy);

        const canvas = document.createElement('canvas');
        canvas.width = sWidth;
        canvas.height = sHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
        
        return canvas.toDataURL('image/png');
    }, [image, numTileWidth, numTileHeight]);


    const downloadDataUrl = (dataUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadAllTiles = async () => {
        if (!image) return;
        setIsProcessing(true);

        const { cols, rows } = gridDimensions;
        
        if (saveAsBase64) {
            const base64Collection: { [key: string]: string } = {};
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const dataUrl = generateTileDataUrl(c, r);
                    if (dataUrl) {
                        const key = `${fileNameTemplate}_${r}_${c}`;
                        base64Collection[key] = dataUrl;
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            const jsonString = JSON.stringify(base64Collection, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            downloadDataUrl(url, `${fileNameTemplate}.json`);
            URL.revokeObjectURL(url);
        } else {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const dataUrl = generateTileDataUrl(c, r);
                    if (dataUrl) {
                        downloadDataUrl(dataUrl, `${fileNameTemplate}_${r}_${c}.png`);
                    }
                    if ((r * cols + c) % 10 === 0) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
            }
        }
        
        setIsProcessing(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPanning(true);
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setIsPanning(false);
    const handleMouseLeave = () => setIsPanning(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning) return;
        const dx = e.clientX - lastMousePositionRef.current.x;
        const dy = e.clientY - lastMousePositionRef.current.y;
        setPosition({ x: position.x + dx, y: position.y + dy });
        lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (!previewContainerRef.current) return;

        const rect = previewContainerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.1;
        const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
        const clampedScale = Math.max(0.1, Math.min(newScale, 15));

        const newX = mouseX - ((mouseX - position.x) / scale) * clampedScale;
        const newY = mouseY - ((mouseY - position.y) / scale) * clampedScale;

        setScale(clampedScale);
        setPosition({ x: newX, y: newY });
    };

    const zoom = (direction: 'in' | 'out') => {
        if (!previewContainerRef.current) return;
        const { clientWidth, clientHeight } = previewContainerRef.current;
        const centerX = clientWidth / 2;
        const centerY = clientHeight / 2;

        const zoomFactor = 1.5;
        const newScale = direction === 'in' ? scale * zoomFactor : scale / zoomFactor;
        const clampedScale = Math.max(0.1, Math.min(newScale, 15));

        const newX = centerX - ((centerX - position.x) / scale) * clampedScale;
        const newY = centerY - ((centerY - position.y) / scale) * clampedScale;

        setScale(clampedScale);
        setPosition({ x: newX, y: newY });
    };

    const openSingleTileModal = (col: number, row: number) => {
        setModalData({ isOpen: true, col, row });
    };

    const renderUploadScreen = () => (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-lg p-8 text-center bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-cyan-400 mb-2">Нарезка Тайлов</h2>
                <p className="text-slate-400 mb-8">Загрузите изображение, чтобы разрезать его на тайлы.</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                />
                <button
                    onClick={handleUploadClick}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                >
                    <UploadIcon className="w-6 h-6"/>
                    <span>Выбрать изображение</span>
                </button>
            </div>
        </div>
    );
    
    const renderTilingScreen = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-4 md:p-6">
            <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 flex flex-col gap-6 self-start">
                <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-cyan-400">Параметры</h3>
                    <div className="text-sm bg-slate-900 p-3 rounded-lg border border-slate-700">
                        <p className="font-mono truncate" title={imageName}>{imageName}</p>
                        <p className="text-slate-400">{image?.naturalWidth} x {image?.naturalHeight} px</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="font-medium text-slate-300">Размер тайла (в пикселях)</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            min="1"
                            value={tileWidth}
                            onChange={(e) => setTileWidth(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Ширина"
                        />
                        <input
                            type="number"
                            min="1"
                            value={tileHeight}
                            onChange={(e) => setTileHeight(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Высота"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label htmlFor="fileNameTemplate" className="font-medium text-slate-300">Шаблон имени файла</label>
                    <input
                        id="fileNameTemplate"
                        type="text"
                        value={fileNameTemplate}
                        onChange={(e) => setFileNameTemplate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="например, my_tile"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="saveAsBase64"
                        checked={saveAsBase64}
                        onChange={(e) => setSaveAsBase64(e.target.checked)}
                        className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600"
                    />
                    <label htmlFor="saveAsBase64" className="font-medium text-slate-300">Сохранить в Base64 (.json)</label>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
                     <button
                        onClick={downloadAllTiles}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                           <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                             <span>Обработка...</span>
                           </>
                        ) : (
                            <>
                                <DownloadIcon className="w-5 h-5"/>
                                <span>Скачать все тайлы ({gridDimensions.cols * gridDimensions.rows})</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-slate-600 text-slate-200 font-bold rounded-lg hover:bg-slate-700 transition-all duration-300"
                    >
                        <ResetIcon className="w-5 h-5"/>
                        <span>Начать сначала</span>
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex flex-col min-h-[400px] lg:min-h-0">
                <div
                    ref={previewContainerRef}
                    className="relative flex-grow w-full h-full bg-slate-900/50 rounded-t-xl overflow-hidden touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onWheel={handleWheel}
                >
                    {image && (
                        <div
                            className="relative select-none"
                            style={{
                                width: image.naturalWidth,
                                height: image.naturalHeight,
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                transformOrigin: 'top left',
                                cursor: isPanning ? 'grabbing' : 'grab',
                            }}
                        >
                            <img src={image.src} alt="Preview" className="block" style={{ imageRendering: 'pixelated' }} draggable="false" />
                            <div
                                className="absolute top-0 left-0 w-full h-full grid"
                                style={{
                                    gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
                                    gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
                                }}
                            >
                                {Array.from({ length: gridDimensions.rows * gridDimensions.cols }).map((_, index) => {
                                    const col = index % gridDimensions.cols;
                                    const row = Math.floor(index / gridDimensions.cols);
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => !isPanning && openSingleTileModal(col, row)}
                                            className="border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors duration-200 cursor-pointer"
                                            title={`Настроить скачивание тайла (${col}, ${row})`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center gap-2 p-2 bg-slate-800 rounded-b-xl border-t border-slate-700">
                    <button onClick={() => zoom('out')} className="p-2 rounded-md hover:bg-slate-700 transition-colors" title="Уменьшить"><ZoomOutIcon className="w-5 h-5"/></button>
                    <span className="text-sm font-mono w-16 text-center" title="Текущий масштаб">{Math.round(scale * 100)}%</span>
                    <button onClick={() => zoom('in')} className="p-2 rounded-md hover:bg-slate-700 transition-colors" title="Увеличить"><ZoomInIcon className="w-5 h-5"/></button>
                    <div className="border-l border-slate-600 h-6 mx-2"></div>
                    <button onClick={fitToScreen} className="p-2 rounded-md hover:bg-slate-700 transition-colors" title="Подогнать под размер экрана"><FitScreenIcon className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    );
    
    return (
        <main className="min-h-screen w-full flex flex-col p-4">
            <header className="w-full text-center pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">
                    Image
                    <span className="text-cyan-400">Tiler</span>
                </h1>
            </header>
            <div className="flex-grow">
                {image ? renderTilingScreen() : renderUploadScreen()}
            </div>
            <SingleTileModal 
                modalData={modalData}
                fileNameTemplate={fileNameTemplate}
                onClose={() => setModalData({ isOpen: false, col: 0, row: 0 })}
                generateTileDataUrl={generateTileDataUrl}
                downloadDataUrl={downloadDataUrl}
            />
        </main>
    );
}
