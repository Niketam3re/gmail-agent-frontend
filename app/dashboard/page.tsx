'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { emailsApi } from '@/lib/api/emails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, Archive, Loader2, RefreshCw, Inbox, FileText, SendIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [syncing, setSyncing] = useState(false);

  // Fetch emails based on selected tab
  const query = selectedTab === 'inbox'
    ? 'is:unread in:inbox'
    : selectedTab === 'drafts'
    ? 'in:drafts'
    : 'in:sent';

  const { data: emailsData, isLoading, error, refetch } = useQuery({
    queryKey: ['emails', query],
    queryFn: () => emailsApi.listEmails({ query, maxResults: 20 }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle errors
  if (error) {
    toast.error('Failed to load emails');
    console.error('Error loading emails:', error);
  }

  const emails = emailsData?.emails || [];

  // Parse email sender name
  const getSenderName = (fromEmail: string) => {
    const match = fromEmail.match(/^"?([^"<]+)"?\s*<?.*>?$/);
    return (match && match[1]) ? match[1].trim() : fromEmail.split('@')[0] || 'Unknown';
  };

  const handleRefresh = async () => {
    refetch();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await emailsApi.syncEmails();
      toast.success(`Synced ${response.syncedCount} new emails`);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    } catch (error) {
      toast.error('Failed to sync emails');
    } finally {
      setSyncing(false);
    }
  };

  const getUserInitials = (email?: string) => {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
  };

  const navigateToEmail = (emailId: string) => {
    router.push(`/email/${emailId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold">AI Email Assistant</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Sync Gmail
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.['avatar_url']} />
                      <AvatarFallback>{getUserInitials(user?.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.['full_name'] || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Email List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Emails</CardTitle>
                <CardDescription>
                  Click on an email to generate an AI-powered draft reply
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inbox">
                      <Inbox className="w-4 h-4 mr-2" />
                      Inbox
                    </TabsTrigger>
                    <TabsTrigger value="drafts">
                      <FileText className="w-4 h-4 mr-2" />
                      Drafts
                    </TabsTrigger>
                    <TabsTrigger value="sent">
                      <SendIcon className="w-4 h-4 mr-2" />
                      Sent
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="inbox" className="space-y-4 mt-4">
                    {isLoading ? (
                      // Loading skeletons
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-lg border">
                          <Skeleton className="h-4 w-1/3 mb-2" />
                          <Skeleton className="h-5 w-2/3 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))
                    ) : emails && emails.length > 0 ? (
                      emails.map((email) => (
                        <div
                          key={email.id}
                          onClick={() => navigateToEmail(email.id)}
                          className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                            !email.is_read ? 'border-primary-200 bg-primary-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-medium ${!email.is_read ? 'font-semibold' : ''}`}>
                                  {getSenderName(email.from)}
                                </h3>
                                {!email.is_read && (
                                  <Badge variant="secondary" className="text-xs">
                                    New
                                  </Badge>
                                )}
                                {email.is_important && (
                                  <Badge variant="destructive" className="text-xs">
                                    Important
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {email.subject || '(No subject)'}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {email.snippet || 'No preview available'}
                              </p>
                              {email.labels && email.labels.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {email.labels.slice(0, 3).map((label, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {label}
                                    </Badge>
                                  ))}
                                  {email.labels.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{email.labels.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No emails found</p>
                        <p className="text-sm mt-1">Try refreshing or check back later</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="drafts" className="space-y-4 mt-4">
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No drafts yet</p>
                      <p className="text-sm mt-1">Click on an email to generate a draft reply</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="sent" className="space-y-4 mt-4">
                    <div className="text-center py-8 text-gray-500">
                      <SendIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No sent emails yet</p>
                      <p className="text-sm mt-1">Send your first AI-generated email</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Drafts Generated</span>
                  <span className="text-2xl font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Saved</span>
                  <span className="text-2xl font-semibold">0h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Emails Processed</span>
                  <span className="text-2xl font-semibold">0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Compose New Email
                </Button>
                <Button className="w-full" variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Selected
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary-200">
              <CardHeader>
                <CardTitle className="text-primary-900">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-700">
                  Click on any email to see AI-generated draft replies. The AI will analyze
                  the context and suggest professional responses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}