'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EmailDraftGenerator } from '@/components/email-draft-generator';
import { ArrowLeft, Mail, Clock, User, Tag, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function EmailDetailPage() {
  const router = useRouter();
  const params = useParams();
  const emailId = params?.id as string;

  // Mock email data for demonstration
  const email = {
    id: emailId,
    user_id: '123',
    gmail_id: emailId,
    thread_id: '123',
    from: 'john.doe@example.com',
    to: 'user@example.com',
    cc: null,
    bcc: null,
    subject: 'Meeting Request - Project Update',
    body: `Hi there,

I hope this email finds you well. I wanted to reach out regarding our upcoming project update meeting.

Could we schedule a time to discuss the progress on our current initiatives? I have some important updates to share about the Q4 roadmap and would love to get your input on the strategic direction.

Please let me know your availability for next week. I'm flexible with timings and can adjust according to your schedule.

Best regards,
John`,
    html_body: null,
    snippet: 'Hi there, I hope this email finds you well. I wanted to reach out regarding our upcoming project...',
    labels: ['INBOX', 'IMPORTANT'],
    attachments: null,
    is_read: false,
    is_important: true,
    received_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: { important: true }
  };

  // Simulate loading for better UX
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inbox
        </Button>
        <h1 className="text-3xl font-bold">Email Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Email Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl line-clamp-2">
                    {email.subject || '(No Subject)'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {email.from}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(email.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  </CardDescription>
                </div>
                {email.metadata?.important && (
                  <Badge variant="destructive">Important</Badge>
                )}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              {/* Email Metadata */}
              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                {email.to && (
                  <div className="flex gap-2">
                    <span className="font-medium">To:</span>
                    <span>{email.to}</span>
                  </div>
                )}
                {email.cc && (
                  <div className="flex gap-2">
                    <span className="font-medium">Cc:</span>
                    <span>{email.cc}</span>
                  </div>
                )}
                {email.labels && email.labels.length > 0 && (
                  <div className="flex gap-2 items-start">
                    <span className="font-medium">Labels:</span>
                    <div className="flex flex-wrap gap-1">
                      {email.labels.map((label, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {email.attachments && email.attachments.length > 0 && (
                  <div className="flex gap-2 items-start">
                    <span className="font-medium">Attachments:</span>
                    <div className="flex flex-wrap gap-1">
                      {email.attachments.map((attachment, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {attachment.filename}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator className="mb-6" />

              {/* Email Body */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div
                  className="whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: email.html_body || email.body || 'No content'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Draft Generator - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <EmailDraftGenerator
              emailId={email.id}
              subject={email.subject || ''}
              from={email.from}
            />
          </div>
        </div>
      </div>
    </div>
  );
}