'use client';

import { useState } from 'react';
import { useGenerateDraft, useDrafts, useUpdateDraft, useSendDraft } from '@/hooks/use-drafts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, Send, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmailDraftGeneratorProps {
  emailId: string;
  subject: string;
  from: string;
}

export function EmailDraftGenerator({ emailId, subject, from }: EmailDraftGeneratorProps) {
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [variations, setVariations] = useState<number>(1);

  const { data: drafts, isLoading: draftsLoading } = useDrafts(emailId);
  const generateDraft = useGenerateDraft();
  const updateDraft = useUpdateDraft();
  const sendDraft = useSendDraft();

  const selectedDraft = drafts?.find(d => d.id === selectedDraftId);

  const handleGenerateDraft = () => {
    generateDraft.mutate(
      { emailId, variations },
      {
        onSuccess: (data) => {
          const newDrafts = Array.isArray(data.data) ? data.data : [data.data];
          if (newDrafts.length > 0) {
            setSelectedDraftId(newDrafts[0].id);
            setEditedContent(newDrafts[0].content);
          }
        },
      }
    );
  };

  const handleUpdateDraft = () => {
    if (selectedDraftId && editedContent !== selectedDraft?.content) {
      updateDraft.mutate({ draftId: selectedDraftId, content: editedContent });
    }
  };

  const handleSendDraft = () => {
    if (selectedDraftId) {
      sendDraft.mutate(selectedDraftId);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-600" />
          AI Draft Generator
        </CardTitle>
        <CardDescription>
          Generate intelligent email replies for: <strong>{subject}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generate Draft Controls */}
        <div className="flex gap-2">
          <Select
            value={variations.toString()}
            onValueChange={(value) => setVariations(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Variations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Draft</SelectItem>
              <SelectItem value="2">2 Variations</SelectItem>
              <SelectItem value="3">3 Variations</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerateDraft}
            disabled={generateDraft.isPending}
            className="flex-1"
          >
            {generateDraft.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>
        </div>

        {/* Draft Selection */}
        {drafts && drafts.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Draft:</label>
            <Select
              value={selectedDraftId || ''}
              onValueChange={(value) => {
                setSelectedDraftId(value);
                const draft = drafts.find(d => d.id === value);
                if (draft) {
                  setEditedContent(draft.content);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a draft" />
              </SelectTrigger>
              <SelectContent>
                {drafts.map((draft) => (
                  <SelectItem key={draft.id} value={draft.id}>
                    Draft {draft.metadata?.tone || 'Standard'} - Confidence:{' '}
                    <span className={getConfidenceColor(draft.confidenceScore)}>
                      {Math.round(draft.confidenceScore * 100)}%
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Draft Editor */}
        {selectedDraft && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Draft Content:</label>
              <div className="flex gap-2">
                {selectedDraft.metadata?.intent && (
                  <Badge variant="outline">{selectedDraft.metadata.intent}</Badge>
                )}
                {selectedDraft.metadata?.tone && (
                  <Badge variant="outline">{selectedDraft.metadata.tone}</Badge>
                )}
                <Badge
                  variant="outline"
                  className={getConfidenceColor(selectedDraft.confidenceScore)}
                >
                  {Math.round(selectedDraft.confidenceScore * 100)}% Confidence
                </Badge>
              </div>
            </div>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Draft content..."
            />
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateDraft}
                disabled={updateDraft.isPending || editedContent === selectedDraft.content}
              >
                {updateDraft.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
              <Button
                onClick={handleSendDraft}
                disabled={sendDraft.isPending}
                className="ml-auto"
              >
                {sendDraft.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!drafts || drafts.length === 0) && !generateDraft.isPending && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No drafts yet</p>
            <p className="text-sm mt-1">Click "Generate Draft" to create AI-powered replies</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}