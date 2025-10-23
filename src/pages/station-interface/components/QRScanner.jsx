import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QRScanner = ({ onScanSuccess, onScanError, isScanning, setIsScanning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [scannerError, setScannerError] = useState('');

  // Mock camera devices
  const mockCameras = [
    { value: 'camera1', label: 'Front Camera (Built-in)' },
    { value: 'camera2', label: 'Rear Camera (Built-in)' },
    { value: 'camera3', label: 'USB Camera (External)' }
  ];

  useEffect(() => {
    setCameras(mockCameras);
    setSelectedCamera('camera2');
  }, []);

  const startScanning = async () => {
    try {
      setScannerError('');
      setIsScanning(true);
      
      // Mock camera access - in real implementation would use @zxing/browser
      if (videoRef?.current) {
        // Simulate camera stream
        videoRef.current.style.background = 'linear-gradient(45deg, #1f2937, #374151)';
      }
      
      // Mock QR detection after 3 seconds
      setTimeout(() => {
        const mockQRData = {
          orderCode: "ORD-2024-00123",
          itemId: "ITM-456",
          sku: "POLO-BLU-M",
          productName: "Classic Polo Shirt",
          color: "Blue",
          size: "Medium",
          quantity: 50,
          stage: "Corte",
          priority: "High"
        };
        
        onScanSuccess(JSON.stringify(mockQRData));
        setIsScanning(false);
      }, 3000);
      
    } catch (error) {
      setScannerError('Failed to access camera. Please check permissions.');
      setIsScanning(false);
      onScanError(error?.message);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScannerError('');
  };

  const handleManualSubmit = () => {
    if (manualCode?.trim()) {
      try {
        // Validate JSON format
        JSON.parse(manualCode);
        onScanSuccess(manualCode);
        setManualCode('');
        setShowManualInput(false);
      } catch (error) {
        setScannerError('Invalid QR code format. Please enter valid JSON data.');
      }
    }
  };

  const handleCameraChange = (value) => {
    setSelectedCamera(value);
    if (isScanning) {
      stopScanning();
      setTimeout(startScanning, 500);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="QrCode" size={20} className="text-primary" />
          <span>QR Code Scanner</span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowManualInput(!showManualInput)}
            iconName="Keyboard"
            iconPosition="left"
          >
            Manual Entry
          </Button>
        </div>
      </div>
      {/* Camera Selection */}
      <div className="mb-4">
        <Select
          label="Camera Device"
          options={cameras}
          value={selectedCamera}
          onChange={handleCameraChange}
          disabled={isScanning}
          className="max-w-xs"
        />
      </div>
      {/* Scanner Interface */}
      <div className="space-y-4">
        {/* Video Preview */}
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ minHeight: '240px' }}
          />
          
          {/* Scanner Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
              
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-primary animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Status Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-75 rounded-md p-2 text-center">
              <p className="text-white text-sm">
                {isScanning ? 'Scanning for QR codes...' : 'Click Start to begin scanning'}
              </p>
            </div>
          </div>
        </div>

        {/* Scanner Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isScanning ? (
            <Button
              onClick={startScanning}
              iconName="Play"
              iconPosition="left"
              size="lg"
            >
              Start Scanning
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="destructive"
              iconName="Square"
              iconPosition="left"
              size="lg"
            >
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Error Display */}
        {scannerError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-sm text-destructive">{scannerError}</p>
            </div>
          </div>
        )}

        {/* Manual Input Panel */}
        {showManualInput && (
          <div className="border border-border rounded-lg p-4 bg-muted/50">
            <h3 className="text-sm font-medium text-foreground mb-3">Manual QR Code Entry</h3>
            <div className="space-y-3">
              <Input
                label="QR Code Data"
                type="text"
                placeholder="Paste QR code JSON data here..."
                value={manualCode}
                onChange={(e) => setManualCode(e?.target?.value)}
                description="Enter the complete JSON payload from the QR code"
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleManualSubmit}
                  disabled={!manualCode?.trim()}
                  iconName="Check"
                  iconPosition="left"
                >
                  Process Code
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setManualCode('');
                    setShowManualInput(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default QRScanner;