import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, MessageSquare, AlertCircle, Snowflake } from 'lucide-react';

interface TemplatLibraryProps {
  onSelectTemplate: (template: string) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplatLibraryProps) {
  const templates = [
    {
      category: 'Before/After',
      icon: Image,
      description: 'Showcase transformation results',
      content: `🛡️ Transformation Tuesday!\n\nCheck out this incredible before and after from our latest mold remediation project. Our team worked diligently to restore this property to a safe, healthy condition.\n\n✅ Complete mold removal\n✅ Air quality restoration\n✅ Prevention measures installed\n\nYour home deserves the Phoenix Shield treatment!\n\n#BeforeAndAfter #MoldRemediation #PhoenixShield #Transformation`,
    },
    {
      category: 'Prevention Tips',
      icon: FileText,
      description: 'Share helpful prevention advice',
      content: `💡 Mold Prevention Tip of the Week\n\nDid you know that controlling indoor humidity is one of the most effective ways to prevent mold growth?\n\nQuick tips:\n🔹 Keep humidity below 60%\n🔹 Use exhaust fans in bathrooms\n🔹 Fix leaks immediately\n🔹 Ensure proper ventilation\n\nSmall steps today prevent big problems tomorrow! Have questions? We're here to help.\n\n#MoldPrevention #HealthyHome #TipTuesday #PhoenixShield`,
    },
    {
      category: 'Testimonials',
      icon: MessageSquare,
      description: 'Share customer success stories',
      content: `⭐⭐⭐⭐⭐ Customer Spotlight\n\n"Phoenix Shield saved our home! After discovering mold in our basement, we were overwhelmed. Their team was professional, thorough, and explained every step of the process. Our home is now safe and mold-free!" - Sarah M.\n\nThank you for trusting us with your home! Stories like these remind us why we do what we do.\n\nExperiencing mold issues? Let us help you too!\n\n#CustomerReview #MoldRemediation #PhoenixShield #Testimonial`,
    },
    {
      category: 'Emergency Response',
      icon: AlertCircle,
      description: 'Highlight urgent services',
      content: `🚨 24/7 Emergency Mold Remediation\n\nMold doesn't wait for business hours, and neither do we!\n\nPhoenix Shield offers:\n⚡ Immediate response\n⚡ Same-day assessment\n⚡ Emergency containment\n⚡ Rapid remediation\n\nWater damage? Suspected mold? Don't wait - call us now!\n\nYour family's health and safety are our top priority.\n\n#EmergencyService #MoldRemoval #24-7Service #PhoenixShield`,
    },
    {
      category: 'Seasonal Content',
      icon: Snowflake,
      description: 'Timely seasonal advice',
      content: `🍂 Fall Mold Prevention Checklist\n\nAs temperatures drop and humidity rises, fall is prime time for mold growth. Protect your home with these essential steps:\n\n✓ Clean gutters and downspouts\n✓ Check for roof leaks\n✓ Inspect basement for moisture\n✓ Service your HVAC system\n✓ Monitor indoor humidity levels\n\nStay ahead of mold this season! Schedule your fall inspection with Phoenix Shield today.\n\n#FallMaintenance #MoldPrevention #SeasonalTips #PhoenixShield`,
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Template Library</CardTitle>
          <CardDescription>
            Pre-written templates for common social media posts
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <template.icon className="h-5 w-5" />
                {template.category}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onSelectTemplate(template.content)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
