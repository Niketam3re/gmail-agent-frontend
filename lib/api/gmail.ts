import axios from 'axios';
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: `${API_URL}/api/gmail`,
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

export interface Email {
  id: string;
  gmailId: string;
  threadId: string;
  subject: string;
  fromEmail: string;
  toEmail: string;
  bodyPlain?: string;
  bodyHtml?: string;
  receivedAt: string;
  isProcessed: boolean;
}

export interface EmailListResponse {
  success: boolean;
  data: Email[];
  count: number;
}

export interface DraftRequest {
  to: string;
  subject: string;
  body: string;
  threadId?: string;
}

export interface DraftResponse {
  success: boolean;
  data: {
    draftId: string;
  };
}

class GmailAPI {
  /**
   * List emails from inbox
   */
  async listEmails(query?: string, maxResults?: number): Promise<Email[]> {
    try {
      const response = await api.get<EmailListResponse>('/emails', {
        params: {
          query: query || 'is:unread in:inbox',
          maxResults: maxResults || 20,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  /**
   * Get a specific email by ID
   */
  async getEmail(id: string): Promise<Email> {
    try {
      const response = await api.get<{ success: boolean; data: Email }>(`/emails/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching email:', error);
      throw error;
    }
  }

  /**
   * Create a draft
   */
  async createDraft(draft: DraftRequest): Promise<string> {
    try {
      const response = await api.post<DraftResponse>('/drafts', draft);
      return response.data.data.draftId;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  }

  /**
   * Send an email
   */
  async sendEmail(email: DraftRequest): Promise<void> {
    try {
      await api.post('/send', email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Set up Gmail watch for push notifications
   */
  async watchEmails(): Promise<void> {
    try {
      await api.post('/watch');
    } catch (error) {
      console.error('Error setting up Gmail watch:', error);
      throw error;
    }
  }
}

export const gmailApi = new GmailAPI();