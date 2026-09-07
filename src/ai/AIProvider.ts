export interface AICompletionRequest { systemPrompt: string; userPrompt: string; maxTokens?: number; temperature?: number; }
export interface AICompletionResponse { content: string; usage?: { promptTokens: number; completionTokens: number; totalTokens: number; }; }
export interface AICVAnalysisResult { skills: string[]; experienceYears: number | null; jobTitles: string[]; industries: string[]; languages: string[]; educationLevel: string | null; summary: string; }
export interface AIJobMatchResult { jobId: string; matchScore: number; matchReasons: string[]; gaps: string[]; }
export interface AIProvider { readonly name: string; complete(request: AICompletionRequest): Promise<AICompletionResponse>; analyzeCV(cvText: string): Promise<AICVAnalysisResult>; matchJob(profile: { skills: string[]; experienceYears: number | null; jobTitles: string[]; preferences: string[]; }, job: { id: string; title: string; description: string; requirements: string[]; }): Promise<AIJobMatchResult>; }
export type ProviderType = 'openai' | 'anthropic' | 'google';
export interface ProviderConfig { type: ProviderType; apiKey: string; model?: string; }
export type AIProviderFactory = (config: ProviderConfig) => AIProvider;
