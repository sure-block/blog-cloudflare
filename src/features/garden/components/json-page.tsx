import { useState } from "react";
import { Braces } from "lucide-react";

const EXAMPLE = `{
  "blog": "sure",
  "features": ["文章", "说说", "相册"],
  "stats": { "posts": 42, "visitors": 12800 }
}`;

function analyze(obj: unknown, depth = 0): { keys: number; arrays: number; depth: number } {
  let keys = 0, arrays = 0, maxDepth = depth;
  if (Array.isArray(obj)) {
    arrays++;
    for (const item of obj) {
      const r = analyze(item, depth + 1);
      keys += r.keys; arrays += r.arrays; maxDepth = Math.max(maxDepth, r.depth);
    }
  } else if (obj && typeof obj === "object") {
    for (const k of Object.keys(obj as Record<string, unknown>)) {
      keys++;
      const r = analyze((obj as Record<string, unknown>)[k], depth + 1);
      keys += r.keys; arrays += r.arrays; maxDepth = Math.max(maxDepth, r.depth);
    }
  }
  return { keys, arrays, depth: maxDepth };
}

/** JSON 格式化工具 */
export function JsonPage() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [stats, setStats] = useState({ keys: 0, arrays: 0, depth: 0 });

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
      setStats(analyze(parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON 解析失败");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON 解析失败");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-10 py-6 md:py-12">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
          <Braces className="text-indigo-400" size={28} />
          JSON 格式化
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium">输入</h2>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="glass-button text-xs px-2 py-1"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={0}>压缩</option>
            </select>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            className="w-full rounded-xl bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 p-3 font-mono text-xs text-foreground focus:outline-none"
          />
          <div className="flex gap-2 mt-3">
            <button type="button" onClick={format} className="glass-button px-4 py-2 text-sm">
              格式化
            </button>
            <button type="button" onClick={minify} className="glass-button px-4 py-2 text-sm">
              压缩
            </button>
          </div>
        </div>

        <div className="glass-card p-4">
          <h2 className="text-sm font-medium mb-2">输出</h2>
          {error ? (
            <p className="text-red-500 text-xs whitespace-pre-wrap">{error}</p>
          ) : (
            <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap">
              {output || "格式化结果会显示在这里"}
            </pre>
          )}
          {output ? (
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              <span>键: {stats.keys}</span>
              <span>数组: {stats.arrays}</span>
              <span>深度: {stats.depth}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
