export interface EagleConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ScanOptions {
  ca: string;
  chain?: string;
  includeAdvancedData?: boolean;
}

export interface EagleScore {
  score: number;
  level: string;
  verdict: string;
}

export interface SecurityData {
  is_honeypot: boolean;
  mint_renounced: boolean;
  freeze_renounced: boolean;
  lp_burned: number;
}

export interface ScanResult {
  id: string;
  ca: string;
  symbol: string;
  eagleScore: EagleScore;
  security: SecurityData;
  aiReasoning: string;
  creditsRemaining?: number;
}

export class EagleClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: EagleConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.eagleeyes.tech';
  }

  /**
   * Scan a Solana token to get the Eagle Score™ utilizing the Dual Cognitive AI engine
   */
  async scanToken(options: ScanOptions): Promise<ScanResult> {
    const res = await fetch(`${this.baseUrl}/v1/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        ca: options.ca,
        chain: options.chain || 'sol',
        include_advanced: options.includeAdvancedData ?? false,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new EagleError(err.error || `HTTP ${res.status}`, res.status);
    }

    const data = await res.json();
    return {
      id: data.id,
      ca: data.ca,
      symbol: data.symbol,
      eagleScore: data.eagle_score,
      security: data.security,
      aiReasoning: data.ai_reasoning,
      creditsRemaining: data.credits_remaining,
    };
  }

  /**
   * Check API health and backend Oracle status
   */
  async health(): Promise<{ status: string; engine: string }> {
    const res = await fetch(`${this.baseUrl}/v1/health`);
    return res.json();
  }
}

export class EagleError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'EagleError';
    this.status = status;
  }
}

export default EagleClient;
