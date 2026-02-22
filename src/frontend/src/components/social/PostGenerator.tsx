import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PostGeneratorProps {
  onGenerate: (post: string) => void;
}

export default function PostGenerator({ onGenerate }: PostGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('facebook');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePost = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for your post');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const templates = {
        professional: {
          facebook: `🛡️ ${topic}\n\nAt Phoenix Shield, we understand the importance of maintaining a healthy indoor environment. ${topic} is a critical aspect of mold prevention and remediation.\n\nOur certified team uses industry-leading techniques to ensure your property remains safe and mold-free. Contact us today for a professional assessment.\n\n#MoldRemediation #HealthyHome #PhoenixShield`,
          instagram: `🛡️ ${topic}\n\nProtecting your home starts with knowledge. ${topic} matters more than you think.\n\n✅ Professional assessment\n✅ Certified technicians\n✅ Safe & effective solutions\n\nDM us for a free consultation!\n\n#MoldRemediation #HealthyLiving #HomeProtection #PhoenixShield`,
          linkedin: `${topic}\n\nAs mold remediation specialists, we've seen firsthand how ${topic.toLowerCase()} impacts both residential and commercial properties. Our approach combines cutting-edge technology with proven methodologies to deliver lasting results.\n\nKey benefits of professional mold remediation:\n• Improved air quality\n• Property value protection\n• Health risk mitigation\n• Long-term prevention strategies\n\nConnect with Phoenix Shield for expert consultation.\n\n#MoldRemediation #PropertyManagement #IndoorAirQuality`,
          twitter: `🛡️ ${topic}\n\nDon't let mold compromise your health or property value. Phoenix Shield offers professional remediation services with guaranteed results.\n\nFree assessment available! 📞\n\n#MoldRemediation #HealthyHome`,
        },
        friendly: {
          facebook: `Hey friends! 👋 Let's talk about ${topic}!\n\nWe know dealing with mold isn't fun, but we're here to make it easy! Our friendly team at Phoenix Shield has helped hundreds of families breathe easier in their homes.\n\n${topic} is something we're passionate about, and we'd love to help you too! Drop us a message or give us a call - we're always happy to chat!\n\n#MoldFree #HappyHome #PhoenixShield`,
          instagram: `👋 ${topic}!\n\nYour home should be your happy place 🏡✨\n\nWe're here to help you:\n💚 Breathe easier\n💚 Feel safer\n💚 Live healthier\n\nLet's chat about keeping your space mold-free!\n\n#HealthyHome #MoldFree #PhoenixShield #HomeGoals`,
          linkedin: `${topic}\n\nAt Phoenix Shield, we believe in building relationships, not just removing mold. Our team takes pride in educating homeowners and property managers about ${topic.toLowerCase()} and creating lasting solutions.\n\nWe're more than just a service - we're your partners in maintaining a healthy environment. Let's connect and discuss how we can help!\n\n#MoldRemediation #CustomerFirst #HealthySpaces`,
          twitter: `${topic} 🏡\n\nYour home deserves the best care! We're here to help with friendly, professional mold remediation services.\n\nLet's make your space healthy again! 💚\n\n#MoldFree #HealthyHome`,
        },
        urgent: {
          facebook: `⚠️ IMPORTANT: ${topic}\n\nMold doesn't wait, and neither should you! ${topic} requires immediate attention to prevent serious health risks and property damage.\n\nPhoenix Shield offers:\n🚨 24/7 emergency response\n🚨 Rapid assessment\n🚨 Immediate remediation\n\nDon't risk your family's health. Call us NOW for urgent mold removal services!\n\n#EmergencyMoldRemoval #ActNow #PhoenixShield`,
          instagram: `🚨 URGENT: ${topic}\n\nTime is critical when it comes to mold!\n\n⏰ 24/7 emergency service\n⏰ Same-day response\n⏰ Immediate action\n\nProtect your family TODAY!\nCall now! 📞\n\n#MoldEmergency #ActFast #PhoenixShield #HealthFirst`,
          linkedin: `URGENT: ${topic}\n\nMold contamination requires immediate professional intervention. Delays can result in:\n• Structural damage\n• Health complications\n• Increased remediation costs\n• Legal liabilities\n\nPhoenix Shield provides emergency mold remediation services with rapid response times. Our certified team is available 24/7 to address critical situations.\n\nContact us immediately if you suspect mold contamination.\n\n#EmergencyResponse #MoldRemediation #PropertyProtection`,
          twitter: `🚨 ${topic}\n\nMold emergency? We respond FAST!\n\n✅ 24/7 availability\n✅ Immediate action\n✅ Expert team\n\nCall Phoenix Shield NOW!\n\n#MoldEmergency #ActNow`,
        },
        educational: {
          facebook: `📚 Did You Know? ${topic}\n\nLet's learn about ${topic.toLowerCase()} together! Understanding mold prevention is the first step to a healthier home.\n\nKey Facts:\n✓ Mold can grow within 24-48 hours of water exposure\n✓ Proper ventilation is crucial for prevention\n✓ Regular inspections catch problems early\n✓ Professional remediation ensures complete removal\n\nPhoenix Shield is committed to educating our community about mold safety. Have questions? We're here to help!\n\n#MoldEducation #HealthyHome #KnowledgeIsPower`,
          instagram: `📖 Learn About ${topic}\n\nEducation = Prevention! 🧠\n\nQuick Tips:\n1️⃣ Control humidity levels\n2️⃣ Fix leaks immediately\n3️⃣ Ensure proper ventilation\n4️⃣ Schedule regular inspections\n\nKnowledge protects your home! 🏡\n\n#MoldPrevention #HomeEducation #PhoenixShield #HealthyLiving`,
          linkedin: `Educational Insight: ${topic}\n\nUnderstanding ${topic.toLowerCase()} is essential for property managers and homeowners alike. Here's what you need to know:\n\n1. Prevention Strategies\n- Maintain humidity levels below 60%\n- Address water intrusion immediately\n- Ensure adequate ventilation\n\n2. Early Detection\n- Regular visual inspections\n- Monitor for musty odors\n- Check high-risk areas (basements, bathrooms)\n\n3. Professional Remediation\n- Proper containment procedures\n- Safe removal techniques\n- Post-remediation verification\n\nPhoenix Shield offers educational consultations to help you protect your investment.\n\n#PropertyManagement #MoldPrevention #Education`,
          twitter: `📚 ${topic}\n\nQuick lesson: Mold prevention starts with knowledge!\n\n✓ Control moisture\n✓ Improve ventilation\n✓ Act fast on leaks\n✓ Get professional help\n\nLearn more with Phoenix Shield!\n\n#MoldEducation #Prevention`,
        },
      };

      const generatedContent = templates[tone as keyof typeof templates][platform as keyof typeof templates.professional];
      onGenerate(generatedContent);
      setIsGenerating(false);
      toast.success('Post generated successfully!');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Post Generator
        </CardTitle>
        <CardDescription>
          Generate engaging social media content for your mold remediation business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., Mold Prevention Tips, Water Damage Response, Indoor Air Quality"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generatePost} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Post
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
