import { MessageSquare, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MessageTemplateCard from '../components/followups/MessageTemplateCard';
import { messageTemplates } from '../data/messageTemplates';

export default function FollowUpsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Follow-Up Message Templates</h1>
          <p className="text-muted-foreground mt-1">
            Customize and copy message templates for customer follow-ups
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Edit any template below to customize your message, then copy it to send manually to your customers.
          Changes are temporary and will reset when you refresh the page.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {messageTemplates.map((template) => (
          <MessageTemplateCard key={template.id} template={template} />
        ))}
      </div>

      <div className="mt-8 p-6 rounded-lg border bg-muted/30">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Tips for Using Templates</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Personalize each message by replacing [Customer Name] with the actual customer name</li>
              <li>For Google review requests, replace [Google Review Link] with your business review URL</li>
              <li>Adjust timing and tone based on your relationship with each customer</li>
              <li>Keep messages professional, friendly, and concise</li>
              <li>Follow up consistently to build trust and maintain customer relationships</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
