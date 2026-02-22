import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { MessageTemplate } from '../../data/messageTemplates';

interface MessageTemplateCardProps {
  template: MessageTemplate;
}

export default function MessageTemplateCard({ template }: MessageTemplateCardProps) {
  const [templateText, setTemplateText] = useState(template.defaultText);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(templateText);
      setCopied(true);
      toast.success('Message copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
      console.error('Copy failed:', error);
    }
  };

  const handleReset = () => {
    setTemplateText(template.defaultText);
    toast.success('Template reset to default');
  };

  const isModified = templateText !== template.defaultText;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          {template.timing && (
            <Badge variant="secondary" className="shrink-0">
              {template.timing}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Edit Template</label>
            {isModified && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs"
              >
                Reset to Default
              </Button>
            )}
          </div>
          <Textarea
            value={templateText}
            onChange={(e) => setTemplateText(e.target.value)}
            className="min-h-[200px] font-mono text-sm resize-none"
            placeholder="Enter your message template..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preview</label>
          <div className="rounded-lg border bg-muted/50 p-4 min-h-[120px]">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {templateText || 'Your message preview will appear here...'}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Replace [Customer Name] and [Google Review Link] with actual values when sending
          </p>
        </div>

        <Button
          onClick={handleCopy}
          className="w-full gap-2"
          variant={copied ? 'secondary' : 'default'}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
