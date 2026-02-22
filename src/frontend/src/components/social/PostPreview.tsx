import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PostPreviewProps {
  content: string;
}

export default function PostPreview({ content }: PostPreviewProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      toast.success('Post copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Post Preview & Editor</CardTitle>
          <CardDescription>
            Review and edit your post before sharing on social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Your generated post will appear here..."
            className="min-h-[300px] font-sans"
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {editedContent.length} characters
            </p>
            <Button onClick={copyToClipboard} disabled={!editedContent}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {editedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Preview</CardTitle>
            <CardDescription>How your post might appear on social media</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/assets/generated/shield-logo.dim_128x128.png"
                  alt="Phoenix Shield"
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">Phoenix Shield</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm">{editedContent}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
