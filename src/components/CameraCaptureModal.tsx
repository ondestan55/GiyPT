import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, SwitchCamera, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  // Check available cameras
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      setHasMultipleCameras(videoInputs.length > 1);
    }).catch((e) => console.log('Device enum err:', e));
  }, []);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setErrorMsg(null);
      return;
    }

    let isMounted = true;

    async function startCamera() {
      try {
        setErrorMsg(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Tarayıcınız kamera erişimini desteklemiyor veya izin verilmedi.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        if (isMounted) {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch((err) => console.log('Video play error:', err));
          }
        } else {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      } catch (err: any) {
        console.error('Camera access error:', err);
        if (isMounted) {
          setErrorMsg(
            'Kamera başlatılamadı. Lütfen tarayıcı izinlerinizden kamera erişimine izin verildiğinden emin olun.'
          );
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleToggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart camera
    setFacingMode((prev) => prev);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1C1917] text-white border border-[#3E3835] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-[#2C2826] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#E5DCCF]" />
            <h3 className="font-editorial text-lg font-semibold tracking-wide text-white">
              Kıyafet Fotoğrafı Çek
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A8A29E] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-xs text-[#FCA5A5] max-w-sm space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-[#EF4444]" />
              <p>{errorMsg}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              {/* Aiming Reticle / Framing Guide */}
              <div className="absolute inset-8 border border-white/25 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-sans tracking-wide text-white/60 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Kıyafeti çerçevenin içine hizalayın
                </span>
              </div>

              {/* Flip camera button */}
              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-xs"
                  title="Kamerayı Değiştir"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* Hidden Canvas for capture processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Bottom Action Controls */}
        <div className="p-4 bg-[#1C1917] border-t border-[#2C2826] flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2B2623] hover:bg-[#3D3734] text-xs font-medium text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yeniden Çek</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-white text-[#1C1917] hover:bg-[#E5DCCF] text-xs font-semibold shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Fotoğrafı Kullan</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#A8A29E] hover:text-white transition-colors"
              >
                İptal
              </button>

              {!errorMsg && (
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="w-14 h-14 rounded-full border-4 border-white/80 bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all active:scale-95"
                  title="Fotoğrafı Çek"
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm" />
                </button>
              )}

              <div className="w-12" /> {/* balance spacing */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
