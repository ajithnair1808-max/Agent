export type AgentCategory = 'freelance' | 'leadgen' | 'content' | 'arbitrage';

export interface AgentPreset {
  id: string;
  name: string;
  category: AgentCategory;
  tagline: string;
  description: string;
  iconName: string;
  estimatedRoi: string;
  avgDeliveryTime: string;
  monetizationStrategy: string;
  defaultPrompt: string;
  tools: string[];
  suggestedTasks: string[];
  color: string;
}

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ExecutionStep {
  id: string;
  title: string;
  toolUsed?: string;
  status: StepStatus;
  timestamp: string;
  detail?: string;
  codeSnippet?: string;
}

export interface Deliverable {
  id: string;
  taskId: string;
  agentId: string;
  agentName: string;
  category: AgentCategory;
  title: string;
  type: 'code' | 'proposal' | 'leads_csv' | 'article' | 'report';
  content: string;
  estimatedValue: number;
  createdDate: string;
  tags: string[];
  meta?: Record<string, any>;
}

export interface ExecutionTask {
  id: string;
  agentId: string;
  agentName: string;
  goal: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number; // 0 to 100
  startTime?: string;
  endTime?: string;
  steps: ExecutionStep[];
  deliverable?: Deliverable;
  estimatedRevenue: number;
}

export interface FinancialMetric {
  date: string;
  revenue: number;
  proposalsSent: number;
  leadsCaptured: number;
  contentPublished: number;
}

export interface UserStrategyConfig {
  geminiApiKey: string;
  useLiveApi: boolean;
  autoExecuteInterval: number; // in minutes (0 = manual)
  targetDailyRevenue: number;
  defaultCategory: AgentCategory;
  autoSaveDeliverables: boolean;
}
