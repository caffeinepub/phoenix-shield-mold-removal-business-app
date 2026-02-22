import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostGenerator from '../components/social/PostGenerator';
import ContentCalendar from '../components/social/ContentCalendar';
import TemplateLibrary from '../components/social/TemplateLibrary';
import PostPreview from '../components/social/PostPreview';
import { useState } from 'react';

export default function SocialMediaPage() {
  const [generatedPost, setGeneratedPost] = useState('');

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Social Media Manager</h1>
          <p className="text-muted-foreground">
            Create engaging content for your mold remediation business
          </p>
        </div>
        
        <div className="flex justify-center md:justify-end">
          <img
            src="/assets/character.png"
            alt="Phoenix Shield Mascot"
            className="h-40 w-40 object-contain"
          />
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="generator">AI Generator</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <PostGenerator onGenerate={setGeneratedPost} />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <ContentCalendar />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateLibrary onSelectTemplate={setGeneratedPost} />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <PostPreview content={generatedPost} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
