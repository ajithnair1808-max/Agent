import React, { useState } from 'react';
import {
  FolderCheck,
  Copy,
  Download,
  Check,
  Code,
  FileText,
  Table,
  Sparkles,
  DollarSign,
  CreditCard,
  Send,
  Zap
} from 'lucide-react';
import { Deliverable } from '../types/agent';
import { AutomationPipeline, PaymentGatewayConfig } from '../services/automationPipeline';

interface DeliverablesVaultProps {
  deliverables: Deliverable[];
  webhookUrl?: string;
  paymentConfig?: PaymentGatewayConfig;
  onLogDispatch?: (msg: string) => void;
}

export const DeliverablesVault: React.FC<DeliverablesVaultProps> = ({
  deliverables,
  webhookUrl = '',
  paymentConfig,
  onLogDispatch,
}) => {
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>(
    deliverables[0]?.id || null
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const activeDeliverable =
    deliverables.find((d) => d.id === selectedDeliverableId) || deliverables[0];

  const filteredDeliverables = deliverables.filter((d) => {
    if (activeCategoryFilter === 'all') return true;
    return d.category === activeCategoryFilter;
  });

  const handleCopyContent = () => {
    if (!activeDeliverable) return;
    navigator.clipboard.writeText(activeDeliverable.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!activeDeliverable) return;
    const ext =
      activeDeliverable.type === 'code'
        ? 'tsx'
        : activeDeliverable.type === 'leads_csv'
        ? 'csv'
        : 'md';
    const blob = new Blob([activeDeliverable.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeDeliverable.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}_deliverable.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGeneratePaymentInvoice = () => {
    if (!activeDeliverable) return;
    const defaultConfig: PaymentGatewayConfig = paymentConfig || {
      paymentMethod: 'paypal',
      stripeAccountId: '',
      paypalHandle: 'yourname',
      upiId: 'yourname@upi',
      cryptoAddress: '',
      customPaymentUrl: '',
      defaultCurrency: 'USD',
      autoAttachInvoice: true,
    };

    const { invoiceMarkdown, paymentUrl } = AutomationPipeline.generatePaymentInvoiceLink(
      activeDeliverable.title,
      activeDeliverable.estimatedValue,
      defaultConfig
    );

    activeDeliverable.content += `\n\n${invoiceMarkdown}`;
    setPaymentNotice(`Payment Link Attached! (${paymentUrl})`);
    setTimeout(() => setPaymentNotice(null), 4000);
  };

  const handleManualWebhookDispatch = async () => {
    if (!activeDeliverable) return;
    if (!webhookUrl.trim()) {
      setDispatchStatus('Please set Webhook URL in Automation Control Center!');
      setTimeout(() => setDispatchStatus(null), 3000);
      return;
    }

    setDispatchStatus('Dispatching via Webhook...');
    const result = await AutomationPipeline.dispatchToWebhook(webhookUrl, {
      type: activeDeliverable.type,
      title: activeDeliverable.title,
      estimatedValue: activeDeliverable.estimatedValue,
      content: activeDeliverable.content,
      timestamp: new Date().toISOString(),
    });

    setDispatchStatus(result.message);
    if (onLogDispatch) {
      onLogDispatch(`[DISPATCH] Sent "${activeDeliverable.title}" to ${webhookUrl.substring(0, 30)}...`);
    }
    setTimeout(() => setDispatchStatus(null), 3500);
  };

  const getTypeIcon = (type: Deliverable['type']) => {
    switch (type) {
      case 'code':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'leads_csv':
        return <Table className="w-4 h-4 text-cyan-400" />;
      case 'article':
        return <FileText className="w-4 h-4 text-violet-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  if (deliverables.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <FolderCheck className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-200 text-sm">Deliverables Vault Empty</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Execute tasks using the Agent Engine above to synthesize and store ready-to-sell code deliverables, client proposals, lead lists, and articles here.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Vault Header & Category Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
              Deliverables Vault
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded-full border border-emerald-500/30">
                {deliverables.length} Assets
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Actionable monetizable assets ready to export, attach payment invoice, or dispatch via webhook
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'freelance', 'leadgen', 'content', 'arbitrage'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition capitalize ${
                activeCategoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asset Selection List */}
        <div className="lg:col-span-5 space-y-3 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
          {filteredDeliverables.map((item) => {
            const isSelected = item.id === (activeDeliverable?.id || selectedDeliverableId);
            return (
              <div
                key={item.id}
                onClick={() => setSelectedDeliverableId(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-emerald-500/50 ring-1 ring-emerald-500/20 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +${item.estimatedValue}
                  </span>
                </div>

                <h4 className="font-bold text-slate-200 text-xs mb-1 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  Agent: {item.agentName}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                  <span>{item.createdDate}</span>
                  <div className="flex items-center gap-1">
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Asset Viewer & Action Bar */}
        {activeDeliverable && (
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[520px]">
            {/* Viewer Toolbar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate max-w-xs sm:max-w-sm">
                {getTypeIcon(activeDeliverable.type)}
                <span className="font-bold text-xs text-slate-200 truncate">
                  {activeDeliverable.title}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleGeneratePaymentInvoice}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/30 transition"
                  title="Generate automated payment invoice link"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Attach Payment Invoice</span>
                </button>

                <button
                  onClick={handleManualWebhookDispatch}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-lg border border-cyan-500/30 transition"
                  title="Send via automated Webhook"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Webhook Send</span>
                </button>

                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-md shadow-emerald-500/20 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Notices */}
            {paymentNotice && (
              <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-amber-300 text-xs flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{paymentNotice}</span>
              </div>
            )}
            {dispatchStatus && (
              <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-2 text-cyan-300 text-xs flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{dispatchStatus}</span>
              </div>
            )}

            {/* Content Viewer */}
            <div className="p-5 font-mono text-xs text-slate-200 space-y-4 overflow-y-auto max-h-[450px] custom-scrollbar bg-slate-950 leading-relaxed">
              <pre className="whitespace-pre-wrap font-mono text-slate-300 text-xs">
                {activeDeliverable.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
