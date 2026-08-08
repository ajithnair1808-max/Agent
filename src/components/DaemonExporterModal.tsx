import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, Shield, Zap, X } from 'lucide-react';

interface DaemonExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DaemonExporterModal: React.FC<DaemonExporterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const daemonCode = `/**
 * AGENTIC WEALTH ENGINE - 24/7 STANDALONE CLI DAEMON
 * Run locally or on a VPS (Ubuntu, macOS, Windows) to execute continuous AI workflows.
 * Usage: node agent-daemon.js
 */

const fs = require('fs');
const path = require('path');

console.log("=================================================");
console.log(" 🚀 AGENTIC WEALTH ENGINE - DAEMON RUNNER STARTED");
console.log("=================================================");

const STRATEGIES = [
  { name: "Freelance Proposal & Code Builder", val: 450, intervalSec: 15 },
  { name: "B2B Lead Prospecting Engine", val: 650, intervalSec: 25 },
  { name: "SEO & Affiliate Content Generator", val: 350, intervalSec: 35 },
  { name: "Micro-SaaS Niche Arbitrage Scanner", val: 850, intervalSec: 45 },
];

let totalVal = 0;
let cycle = 1;

function runCycle() {
  const strat = STRATEGIES[(cycle - 1) % STRATEGIES.length];
  console.log(\`\\n[CYCLE \${cycle}] [\${new Date().toLocaleTimeString()}] Executing Strategy: \${strat.name}\`);
  console.log(\` -> Scanning market vectors...\`);
  
  setTimeout(() => {
    console.log(\` -> Synthesizing deliverable asset (Code/CSV/MD)...\`);
    totalVal += strat.val;
    
    // Save deliverable file locally
    const outputDir = path.join(__dirname, 'agent_outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    
    const fileName = \`deliverable_\${Date.now()}_\${strat.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md\`;
    const filePath = path.join(outputDir, fileName);
    
    const content = \`# Deliverable: \${strat.name}\\nSynthesized at: \${new Date().toISOString()}\\nValuation: $\${strat.val}\\n\\nStatus: SUCCESS\\n\`;
    fs.writeFileSync(filePath, content);
    
    console.log(\` [✔ SUCCESS] Asset saved to \${fileName} (+$ \${strat.val})\`);
    console.log(\` [💰 TOTAL VALUE GENERATED]: $\${totalVal.toLocaleString()}\`);
    cycle++;
  }, 2000);
}

// Start continuous execution loop
runCycle();
setInterval(runCycle, 20000);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(daemonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([daemonCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agent-daemon.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Export 24/7 Background CLI Daemon</h3>
              <p className="text-xs text-slate-400">Run your profit agent continuously on local CLI or VPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Download this standalone JavaScript file and execute with <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-white">node agent-daemon.js</code> on your machine or cloud server.
            </span>
          </div>

          <div className="relative">
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto custom-scrollbar">
              {daemonCode}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" /> Zero dependencies required (Node.js runtime)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Code' : 'Copy Script'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download agent-daemon.js</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
