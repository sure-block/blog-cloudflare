import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { QrCode } from "lucide-react";

const EXAMPLES = [
  { label: "网址", value: "https://github.com" },
  { label: "邮箱", value: "mailto:hello@example.com" },
  { label: "电话", value: "tel:+8613800138000" },
  { label: "WiFi", value: "WIFI:T:WPA;S:MyNetwork;P:password;;" },
  { label: "文本", value: "Hello, World!" },
];

/** 二维码生成 */
export function QrCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://github.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canvasRef.current || !text.trim()) return;
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    }).catch((e) => setError(e.message));
  }, [text, fgColor, bgColor, size]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
          <QrCode className="text-indigo-400" size={28} />
          二维码生成
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="输入内容..."
            className="w-full rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 p-3 text-sm"
          />

          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setText(ex.value)}
                className="glass-button px-2.5 py-1 text-xs"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2">
              前景
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
            </label>
            <label className="flex items-center gap-2">
              背景
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border"
              />
            </label>
            <label className="flex items-center gap-2 col-span-2">
              尺寸 {size}px
              <input
                type="range"
                min={128}
                max={512}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="flex-1"
              />
            </label>
          </div>

          {error ? <p className="text-red-500 text-xs">{error}</p> : null}
        </div>

        <div className="glass-card p-4 flex flex-col items-center gap-4">
          <canvas ref={canvasRef} className="rounded-lg" />
          <button type="button" onClick={download} className="glass-button px-4 py-2 text-sm">
            下载 PNG
          </button>
        </div>
      </div>
    </div>
  );
}
