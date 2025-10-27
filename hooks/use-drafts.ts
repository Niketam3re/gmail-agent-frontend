import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { draftsApi, Draft } from '@/lib/api/drafts';
import { toast } from 'react-hot-toast';

export function useGenerateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ emailId, variations = 1 }: { emailId: string; variations?: number }) =>
      draftsApi.generateDraft(emailId, variations),
    onSuccess: (data, variables) => {
      toast.success(
        Array.isArray(data.data)
          ? `Generated ${data.data.length} draft variations`
          : 'Draft generated successfully'
      );
      queryClient.invalidateQueries({ queryKey: ['drafts', variables.emailId] });
    },
    onError: (error: any) => {
      toast.error('Failed to generate draft');
      console.error('Error generating draft:', error);
    },
  });
}

export function useDrafts(emailId: string) {
  return useQuery({
    queryKey: ['drafts', emailId],
    queryFn: () => draftsApi.getDrafts(emailId),
    enabled: !!emailId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error: any) => {
      toast.error('Failed to fetch drafts');
      console.error('Error fetching drafts:', error);
    },
  });
}

export function useUpdateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ draftId, content }: { draftId: string; content: string }) =>
      draftsApi.updateDraft(draftId, content),
    onSuccess: () => {
      toast.success('Draft updated');
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
    onError: (error: any) => {
      toast.error('Failed to update draft');
      console.error('Error updating draft:', error);
    },
  });
}

export function useDeleteDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => draftsApi.deleteDraft(draftId),
    onSuccess: () => {
      toast.success('Draft deleted');
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
    },
    onError: (error: any) => {
      toast.error('Failed to delete draft');
      console.error('Error deleting draft:', error);
    },
  });
}

export function useSendDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draftId: string) => draftsApi.sendDraft(draftId),
    onSuccess: () => {
      toast.success('Email sent successfully');
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: any) => {
      toast.error('Failed to send email');
      console.error('Error sending draft:', error);
    },
  });
}