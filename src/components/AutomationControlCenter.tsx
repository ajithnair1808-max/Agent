import React, { useState } from 'react';
import {
  Zap,
  Play,
  Pause,
  Link,
  CreditCard,
  Check,
  Send,
  Clock,
  ShieldCheck,
  Radio,
  HelpCircle,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { WebhookConfig, PaymentGatewayConfig, PaymentMethodType } from '../services/automationPipeline';

interface AutomationControlCenterProps {
  isAutoPilotActive: boolean;
  onToggleAutoPilot: (active: boolean) => void;
  autoIntervalMinutes: number;
  onChangeInterval: (minutes: number) => void;
  webhookConfig: WebhookConfig;
  onUpdateWebhookConfig: (config: WebhookConfig) => void;
  paymentConfig: PaymentGatewayConfig;
  onUpdatePaymentConfig: (config: PaymentGatewayConfig) => void;
  dispatchLogs: string[];
}

export const AutomationControlCenter: React.FC<AutomationControlCenterProps> = ({
  isAutoPilotActive,
  onToggleAutoPilot,
  autoIntervalMinutes,
  onChangeInterval,
  webhookConfig,
  onUpdateWebhookConfig,
  paymentConfig,
  onUpdatePaymentConfig,
  dispatchLogs,
}) => {
  const [tempWebhookUrl, setTempWebhookUrl] = useState(webhookConfig.webhookUrl);
  const [autoDispatchLeads, setAutoDispatchLeads] = useState(webhookConfig.autoDispatchLeads ?? false);
  const [autoDispatchProposals, setAutoDispatchProposals] = useState(webhookConfig.autoDispatchProposals ?? false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(paymentConfig.paymentMethod || 'paypal');
  const [paypalHandle, setPaypalHandle] = useState(paymentConfig.paypalHandle || '');
  const [upiId, setUpiId] = useState(paymentConfig.upiId || '');
  const [cryptoAddr, setCryptoAddr] = useState(paymentConfig.cryptoAddress || '');
  const [customUrl, setCustomUrl] = useState(paymentConfig.customPaymentUrl || '');
  const [tempStripeId, setTempStripeId] = useState(paymentConfig.stripeAccountId || '');

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateWebhookConfig({
      ...webhookConfig,
      webhookUrl: tempWebhookUrl,
      enabled: tempWebhookUrl.trim().length > 0,
      autoDispatchLeads: autoDispatchLeads,
      autoDispatchProposals: autoDispatchProposals,
    });
    onUpdatePaymentConfig({
      ...paymentConfig,
      paymentMethod,
      paypalHandle,
      upiId,
      cryptoAddress: cryptoAddr,
      customPaymentUrl: customUrl,
      stripeAccountId: tempStripeId,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const setTestWebhook = () => {
    const testUrl = 'https://discord.com/api/webhooks/demo_agentic_wealth_channel';
    setTempWebhookUrl(testUrl);
    onUpdateWebhookConfig({
      ...webhookConfig,
      webhookUrl: testUrl,
      enabled: true,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const simpleTestWebhookUrl = "https://webhook.site/your-token-here";

  const handleSimpleMode = () => {
    onUpdateWebhookConfig({
      ...webhookConfig,
      enabled: true,
      webhookUrl: simpleTestWebhookUrl,
      autoDispatchLeads: true,
      autoDispatchProposals: true,
    });
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header & Auto-Pilot Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl border ${
              isAutoPilotActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base">
                Autonomous Auto-Pilot Engine
              </h2>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full border ${
                  isAutoPilotActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isAutoPilotActive ? 'AUTO-PILOT ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuously mines opportunities, generates assets, and dispatches leads 24/7 without manual intervention
            </p>
          </div>
        </div>

        {/* Master Toggle Button */}
        <button
          onClick={() => onToggleAutoPilot(!isAutoPilotActive)}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all ${
            isAutoPilotActive
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          {isAutoPilotActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Auto-Pilot</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Enable Auto-Pilot 24/7</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interval, Webhook & Payment Selection */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-7 space-y-5">
          {/* Interval Selector */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                Auto-Pilot Execution Loop Interval
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Loop Frequency</span>
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { min: 1, label: '1 Min (Fast Demo)' },
                { min: 5, label: 'Every 5 Mins' },
                { min: 15, label: 'Every 15 Mins' },
                { min: 60, label: 'Every 1 Hour' },
              ].map((item) => (
                <button
                  key={item.min}
                  type="button"
                  onClick={() => onChangeInterval(item.min)}
                  className={`py-2 px-2 rounded-lg border text-center font-semibold transition ${
                    autoIntervalMinutes === item.min
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Webhook Input */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Link className="w-4 h-4 text-cyan-400" />
                Automated Webhook Dispatch Endpoint (Optional)
              </label>
              <button
                type="button"
                onClick={setTestWebhook}
                className="text-[11px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 font-mono"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" /> Use Test Webhook
              </button>
            </div>

            <input
              type="text"
              value={tempWebhookUrl}
              onChange={(e) => setTempWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/... or https://discord.com/api/webhooks/..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
            />

            {/* Auto‑dispatch toggles */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={autoDispatchLeads}
                  onChange={(e) => setAutoDispatchLeads(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-emerald-500 bg-slate-800 border-slate-700 rounded"
                />
                <span className="text-slate-200">Auto‑dispatch Leads (CSV)</span>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={autoDispatchProposals}
                  onChange={(e) => setAutoDispatchProposals(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-emerald-500 bg-slate-800 border-slate-700 rounded"
                />
                <span className="text-slate-200">Auto‑dispatch Proposals (Code)</span>
              </label>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTOR (No Stripe Required!) */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Select Payment Collection Method (No Stripe Account Needed!)
              </label>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                100% Free Setup
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
              {[
                { id: 'paypal', label: 'PayPal / PayPal.Me' },
                { id: 'upi', label: 'UPI / GPay' },
                { id: 'crypto', label: 'Crypto (USDT)' },
                { id: 'custom', label: 'Custom Link' },
                { id: 'stripe', label: 'Stripe' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as PaymentMethodType)}
                  className={`py-2 px-2 rounded-lg border text-center font-semibold transition ${
                    paymentMethod === m.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dynamic Input Based on Selection */}
            {paymentMethod === 'paypal' && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <label className="block text-xs text-slate-300 font-semibold">
                  PayPal.Me Username or PayPal Email:
                </label>
                <input
                  type="text"
                  value={paypalHandle}
                  onChange={(e) => setPaypalHandle(e.target.value)}
                  placeholder="e.g. john_doe or paypal.me/john_doe"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Generates an automatic 1-click PayPal payment link: <code className="text-amber-400 font-mono">paypal.me/yourname/450</code>
                </p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <label className="block text-xs text-slate-300 font-semibold">
                  UPI ID (Google Pay / PhonePe / Paytm / BHIM):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@upi or mobile@paytm"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Generates a instant QR / UPI deep link for Google Pay, PhonePe, or BHIM.
                </p>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <label className="block text-xs text-slate-300 font-semibold">
                  Crypto Wallet Address (USDT TRC20 / BTC / ETH):
                </label>
                <input
                  type="text"
                  value={cryptoAddr}
                  onChange={(e) => setCryptoAddr(e.target.value)}
                  placeholder="e.g. TXXXXXX... (USDT TRC20)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            )}

            {paymentMethod === 'custom' && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <label className="block text-xs text-slate-300 font-semibold">
                  Custom Payment URL (BuyMeACoffee / Razorpay / Bank Details):
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://buymeacoffee.com/yourname or https://razorpay.me/@yourname"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            )}

            {paymentMethod === 'stripe' && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <label className="block text-xs text-slate-300 font-semibold">
                  Stripe Account ID (Starts with acct_):
                </label>
                <input
                  type="text"
                  value={tempStripeId}
                  onChange={(e) => setTempStripeId(e.target.value)}
                  placeholder="acct_1MXXXXXXXXXXXXXX"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedNotice ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Automation & Payment settings saved!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
            >
              Save Automation & Payment Pipeline
            </button>
          </div>
        </form>

        {/* Right Column: Live Automated Dispatch Console */}
        <div className="lg:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-teal-400" />
                Live Automated Dispatch Log
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Real-time Stream</span>
            </div>

            <div className="space-y-2 font-mono text-[11px] max-h-80 overflow-y-auto custom-scrollbar">
              {dispatchLogs.length === 0 ? (
                <div className="text-slate-600 italic py-6 text-center">
                  Enable Auto-Pilot or select payment method to observe live dispatches...
                </div>
              ) : (
                dispatchLogs.map((log, idx) => (
                  <div key={idx} className="text-emerald-400/90 leading-relaxed border-b border-slate-900 pb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Automatic retry & payment link generation active</span>
          </div>
        </div>
      </div>
    </section>
  );
};
