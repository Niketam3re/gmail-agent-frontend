import axios from 'axios';
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: `${API_URL}/api/drafts`,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

export interface Draft {
  id: string;
  emailId: string;
  userId: string;
  content: string;
  confidenceScore: number;
  status: 'draft' | 'sent' | 'discarded';
  metadata?: {
    model: string;
    intent?: string;
    tone?: string;
    processingTime?: number;
  };
  createdAt: string;
  sentAt?: string;
}

export interface GenerateDraftRequest {
  emailId: string;
  variations?: number;
}

export interface GenerateDraftResponse {
  success: boolean;
  data: Draft | Draft[];
  analysis?: {
    intent: string;
    tone: string;
    keyPoints: string[];
    strategy: string;
  };
}

class DraftsAPI {
  /**
   * Generate AI draft for an email
   */
  async generateDraft(emailId: string, variations = 1): Promise<GenerateDraftResponse> {
    try {
      const response = await api.post<GenerateDraftResponse>('/generate', {
        emailId,
        variations,
      });

      return response.data;
    } catch (error) {
      console.error('Error generating draft:', error);
      throw error;
    }
  }

  /**
   * Get all drafts for an email
   */
  async getDrafts(emailId: string): Promise<Draft[]> {
    try {
      const response = await api.get<{ success: boolean; data: Draft[] }>(`/${emailId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
  }

  /**
   * Update a draft
   */
  async updateDraft(draftId: string, content: string): Promise<Draft> {
    try {
      const response = await api.put<{ success: boolean; data: Draft }>(`/${draftId}`, {
        content,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
  }

  /**
   * Delete a draft
   */
  async deleteDraft(draftId: string): Promise<void> {
    try {
      await api.delete(`/${draftId}`);
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
  }

  /**
   * Send a draft as an email
   */
  async sendDraft(draftId: string): Promise<void> {
    try {
      await api.post(`/${draftId}/send`);
    } catch (error) {
      console.error('Error sending draft:', error);
      throw error;
    }
  }
}

export const draftsApi = new DraftsAPI();