import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gmailApi, Email, DraftRequest } from '@/lib/api/gmail';
import { toast } from 'react-hot-toast';

export function useEmails(query?: string, maxResults?: number) {
  return useQuery({
    queryKey: ['emails', query, maxResults],
    queryFn: () => gmailApi.listEmails(query, maxResults),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
    onError: (error: any) => {
      toast.error('Failed to fetch emails');
      console.error('Error fetching emails:', error);
    },
  });
}

export function useEmail(id: string) {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => gmailApi.getEmail(id),
    enabled: !!id,
    onError: (error: any) => {
      toast.error('Failed to fetch email');
      console.error('Error fetching email:', error);
    },
  });
}

export function useCreateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: DraftRequest) => gmailApi.createDraft(draft),
    onSuccess: () => {
      toast.success('Draft created successfully');
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create draft');
      console.error('Error creating draft:', error);
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: DraftRequest) => gmailApi.sendEmail(email),
    onSuccess: () => {
      toast.success('Email sent successfully');
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: any) => {
      toast.error('Failed to send email');
      console.error('Error sending email:', error);
    },
  });
}

export function useWatchEmails() {
  return useMutation({
    mutationFn: () => gmailApi.watchEmails(),
    onSuccess: () => {
      toast.success('Gmail sync enabled');
    },
    onError: (error: any) => {
      toast.error('Failed to enable Gmail sync');
      console.error('Error setting up Gmail watch:', error);
    },
  });
}