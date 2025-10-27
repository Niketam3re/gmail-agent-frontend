import { apiClient } from './client';

export interface Email {
  id: string;
  user_id: string;
  gmail_id: string;
  thread_id: string;
  from: string;
  to: string | null;
  cc: string | null;
  bcc: string | null;
  subject: string | null;
  body: string | null;
  html_body: string | null;
  snippet: string;
  labels: string[] | null;
  attachments: Array<{
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string;
  }> | null;
  is_read: boolean;
  is_important: boolean;
  received_at: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any> | null;
}

export interface ListEmailsParams {
  query?: string;
  maxResults?: number;
  pageToken?: string;
  labelIds?: string[];
}

export interface SyncEmailsResponse {
  success: boolean;
  syncedCount: number;
  emails: Email[];
}

export const emailsApi = {
  listEmails: async (params?: ListEmailsParams): Promise<{ emails: Email[], nextPageToken?: string }> => {
    const response = await apiClient.get('/api/emails', { params });
    return response.data;
  },

  getEmail: async (emailId: string): Promise<Email> => {
    const response = await apiClient.get(`/api/emails/${emailId}`);
    return response.data;
  },

  syncEmails: async (): Promise<SyncEmailsResponse> => {
    const response = await apiClient.post('/api/emails/sync');
    return response.data;
  },

  markAsRead: async (emailId: string): Promise<Email> => {
    const response = await apiClient.patch(`/api/emails/${emailId}/read`);
    return response.data;
  },

  archiveEmail: async (emailId: string): Promise<Email> => {
    const response = await apiClient.post(`/api/emails/${emailId}/archive`);
    return response.data;
  },

  deleteEmail: async (emailId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/api/emails/${emailId}`);
    return response.data;
  },

  searchEmails: async (query: string): Promise<{ emails: Email[] }> => {
    const response = await apiClient.get('/api/emails/search', { params: { query } });
    return response.data;
  },
};