import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { AgentSelector } from './components/AgentSelector';
import { LiveExecutionMonitor } from './components/LiveExecutionMonitor';
import { DeliverablesVault } from './components/DeliverablesVault';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AutomationControlCenter } from './components/AutomationControlCenter';
import { DaemonExporterModal } from './components/DaemonExporterModal';
import { CustomStrategyModal } from './components/CustomStrategyModal';

import {
  ExecutionTask,
  Deliverable,
  FinancialMetric,
  UserStrategyConfig,
  AgentCategory
} from './types/agent';
import { AGENT_PRESETS } from './services/agentPresets';
import { AgentExecutor } from './services/agentExecutor';
import { AutomationPipeline, WebhookConfig, PaymentGatewayConfig } from './services/automationPipeline';

const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: 'deliv_init_1',
    taskId: 'task_init_1',
    agentId: 'freelancer-pro',
    agentName: 'Freelance Proposal & Code Deliverable Agent',
    category: 'freelance',
    title: 'Client Proposal & Working Source Code: Upwork React/Tailwind Dashboard ($450)',
    type: 'code',
    estimatedValue: 450,
    createdDate: 'Aug 8, 2026',
    tags: ['React', 'TypeScript', 'Proposal', 'Client-Ready'],
    content: `
# 💼 WINNING CLIENT PROPOSAL & SOURCE CODE DELIVERABLE

**Client Job Reference:** Upwork React/Tailwind E-Commerce Dashboard  
**Proposed Rate:** $450 Fixed Fee  

---

## 🎯 Proposal Pitch
Hi there! I reviewed your project requirements for the modern React/Tailwind analytics dashboard.
I have pre-built the full typed component deliverable below.

\`\`\`tsx
import React from 'react';
import { Zap } from 'lucide-react';

export const AnalyticsDashboardWidget = () => (
  <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-white">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-lg">Sales Revenue Stream</h3>
      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-full">
        +28.4% growth
      </span>
    </div>
    <div className="text-3xl font-extrabold font-mono text-emerald-400">$14,250.00</div>
  </div>
);
export default AnalyticsDashboardWidget;
\`\`\`
`.trim(),
  },
  {
    id: 'deliv_init_2',
    taskId: 'task_init_2',
    agentId: 'leadgen-master',
    agentName: 'B2B High-Ticket Lead Gen & Outreach Agent',
    category: 'leadgen',
    title: 'B2B Verified Leads & Cold Outreach: SaaS CEOs ($650)',
    type: 'leads_csv',
    estimatedValue: 650,
    createdDate: 'Aug 8, 2026',
    tags: ['B2B Leads', 'Cold Email', 'Prospecting'],
    content: `
# 🎯 B2B VERIFIED LEAD PROSPECTING & OUTREACH PACKAGE

\`\`\`csv
Company Name,Decision Maker,Title,Verified Email,Est Revenue,Pain Point
Apex Digital,Sarah Jenkins,VP Growth,s.jenkins@apexdigital.io,$15M/yr,High CAC Retention
Vanguard Health,Marcus Vance,CEO,marcus@vanguardhealth.com,$8M/yr,Outdated Booking UI
Nexus Commerce,Elena Rostova,Head Marketing,elena@nexuscommerce.co,$25M/yr,Abandoned Cart Rates
\`\`\`
`.trim(),
  },
];

const INITIAL_METRICS: FinancialMetric[] = [
  { date: 'Aug 2', revenue: 450, proposalsSent: 2, leadsCaptured: 10, contentPublished: 1 },
  { date: 'Aug 4', revenue: 900, proposalsSent: 4, leadsCaptured: 22, contentPublished: 2 },
  { date: 'Aug 6', revenue: 1550, proposalsSent: 7, leadsCaptured: 34, contentPublished: 4 },
  { date: 'Aug 8', revenue: 1950, proposalsSent: 9, leadsCaptured: 45, contentPublished: 5 },
];

export function App() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('freelancer-pro');
  const [currentTask, setCurrentTask] = useState<ExecutionTask | null>(null);
  const [activeExecutor, setActiveExecutor] = useState<AgentExecutor | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [metrics, setMetrics] = useState<FinancialMetric[]>(INITIAL_METRICS);

  const [activeTab, setActiveTab] = useState<'workspace' | 'automation' | 'vault' | 'analytics'>('workspace');

  const [daemonModalOpen, setDaemonModalOpen] = useState(false);
  const [customStrategyModalOpen, setCustomStrategyModalOpen] = useState(false);

  // Automation & Auto-pilot State
  const [isAutoPilotActive, setIsAutoPilotActive] = useState(false);
  const [autoIntervalMinutes, setAutoIntervalMinutes] = useState(1); // 1 min demo default
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    enabled: false,
    webhookUrl: '',
    provider: 'zapier',
    autoDispatchLeads: true,
    autoDispatchProposals: true,
  });
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>({
    stripeAccountId: '',
    paypalHandle: '',
    upiId: '',
    cryptoAddress: '',
    customPaymentUrl: '',
    paymentMethod: 'stripe',
    defaultCurrency: 'USD',
    autoAttachInvoice: true,
  });
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);

  const [config, setConfig] = useState<UserStrategyConfig>({
    geminiApiKey: '',
    useLiveApi: false,
    autoExecuteInterval: 0,
    targetDailyRevenue: 1000,
    defaultCategory: 'freelance',
    autoSaveDeliverables: true,
  });

  const totalRevenue = deliverables.reduce((acc, d) => acc + d.estimatedValue, 0);
  const autoPilotTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addDispatchLog = (msg: string) => {
    setDispatchLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 30)]);
  };

  const handleRunTask = async (agentId: string, goal: string) => {
    if (activeExecutor) {
      activeExecutor.cancel();
    }

    const executor = new AgentExecutor(
      agentId,
      goal,
      (updatedTask) => {
        setCurrentTask({ ...updatedTask });
      },
      config.geminiApiKey
    );

    setActiveExecutor(executor);
    const finishedTask = await executor.run();

    if (finishedTask.status === 'completed' && finishedTask.deliverable) {
      const newDeliv = finishedTask.deliverable;

      // Auto-attach invoice if configured
      if (paymentConfig.autoAttachInvoice) {
        const { invoiceMarkdown } = AutomationPipeline.generatePaymentInvoiceLink(
          newDeliv.title,
          newDeliv.estimatedValue,
          paymentConfig
        );
        newDeliv.content += `\n\n${invoiceMarkdown}`;
      }

      setDeliverables((prev) => [newDeliv, ...prev]);

      // Auto-dispatch to webhook if configured and allowed for this deliverable type
      if (webhookConfig.enabled && webhookConfig.webhookUrl) {
        const shouldDispatch =
          (newDeliv.type === 'leads_csv' && webhookConfig.autoDispatchLeads) ||
          (newDeliv.type !== 'leads_csv' && webhookConfig.autoDispatchProposals);
        if (shouldDispatch) {
          AutomationPipeline.dispatchToWebhook(webhookConfig.webhookUrl, {
            type: newDeliv.type,
            title: newDeliv.title,
            estimatedValue: newDeliv.estimatedValue,
            content: newDeliv.content,
            timestamp: new Date().toISOString(),
          });
          addDispatchLog(`Auto-Dispatched "${newDeliv.title.substring(0, 30)}..." to Webhook`);
        }
      }

      // Update metrics
      setMetrics((prev) => {
        const last = prev[prev.length - 1];
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...last,
          revenue: last.revenue + newDeliv.estimatedValue,
        };
        return updated;
      });

      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    setActiveExecutor(null);
  };

  // Auto-Pilot Continuous Loop Scheduler
  useEffect(() => {
    if (isAutoPilotActive) {
      addDispatchLog(`[AUTO-PILOT STARTED] Running continuous loop every ${autoIntervalMinutes} min(s)`);

      autoPilotTimerRef.current = setInterval(() => {
        if (!activeExecutor) {
          // Rotate through presets
          const randomPreset = AGENT_PRESETS[Math.floor(Math.random() * AGENT_PRESETS.length)];
          const randomTask = randomPreset.suggestedTasks[Math.floor(Math.random() * randomPreset.suggestedTasks.length)];
          addDispatchLog(`[AUTO-TRIGGER] Launching ${randomPreset.name}...`);
          handleRunTask(randomPreset.id, randomTask);
        }
      }, autoIntervalMinutes * 60 * 1000);
    } else {
      if (autoPilotTimerRef.current) {
        clearInterval(autoPilotTimerRef.current);
        autoPilotTimerRef.current = null;
      }
    }

    return () => {
      if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
    };
  }, [isAutoPilotActive, autoIntervalMinutes]);

  const handleCancelTask = () => {
    if (activeExecutor) {
      activeExecutor.cancel();
      setActiveExecutor(null);
    }
  };

  const handleSaveCustomStrategy = (strategy: {
    category: AgentCategory;
    goal: string;
    targetRevenue: number;
  }) => {
    const preset = AGENT_PRESETS.find((p) => p.category === strategy.category) || AGENT_PRESETS[0];
    setSelectedAgentId(preset.id);
    handleRunTask(preset.id, strategy.goal);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        totalRevenue={totalRevenue}
        config={config}
        onUpdateConfig={setConfig}
        onOpenDaemonModal={() => setDaemonModalOpen(true)}
        onOpenCustomStrategyModal={() => setCustomStrategyModalOpen(true)}
        activeTasksCount={activeExecutor ? 1 : 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'workspace'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            ⚡ Agent Strategy Studio
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'automation'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            🤖 24/7 Auto-Pilot & Webhooks
            {isAutoPilotActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'vault'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            📂 Deliverables Vault
            <span className="px-1.5 py-0.2 bg-slate-800 text-emerald-400 font-mono text-[10px] rounded-full">
              {deliverables.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            📈 Financial Analytics
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'workspace' && (
          <div className="space-y-8">
            <AgentSelector
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              onRunTask={handleRunTask}
              isExecuting={!!activeExecutor}
            />

            <LiveExecutionMonitor
              currentTask={currentTask}
              onCancelTask={handleCancelTask}
            />

            <DeliverablesVault
                deliverables={deliverables}
                webhookUrl={webhookConfig.webhookUrl}
                paymentConfig={paymentConfig}
                onLogDispatch={addDispatchLog}
              />
          </div>
        )}

        {activeTab === 'automation' && (
          <AutomationControlCenter
            isAutoPilotActive={isAutoPilotActive}
            onToggleAutoPilot={setIsAutoPilotActive}
            autoIntervalMinutes={autoIntervalMinutes}
            onChangeInterval={setAutoIntervalMinutes}
            webhookConfig={webhookConfig}
            onUpdateWebhookConfig={setWebhookConfig}
            paymentConfig={paymentConfig}
            onUpdatePaymentConfig={setPaymentConfig}
            dispatchLogs={dispatchLogs}
          />
        )}

        {activeTab === 'vault' && (
          <DeliverablesVault
            deliverables={deliverables}
            webhookUrl={webhookConfig.webhookUrl}
            stripeAccountId={paymentConfig.stripeAccountId}
            onLogDispatch={addDispatchLog}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            metrics={metrics}
            deliverables={deliverables}
            totalRevenue={totalRevenue}
          />
        )}
      </main>

      {/* Modals */}
      <DaemonExporterModal
        isOpen={daemonModalOpen}
        onClose={() => setDaemonModalOpen(false)}
      />

      <CustomStrategyModal
        isOpen={customStrategyModalOpen}
        onClose={() => setCustomStrategyModalOpen(false)}
        onSaveStrategy={handleSaveCustomStrategy}
      />
    </div>
  );
}

export default App;
