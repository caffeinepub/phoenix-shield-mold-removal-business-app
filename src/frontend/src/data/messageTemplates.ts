export interface MessageTemplate {
  id: string;
  title: string;
  description: string;
  defaultText: string;
  timing?: string;
}

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'post-job-satisfaction',
    title: 'Post-Job Satisfaction',
    description: 'Follow up with customers 3-7 days after job completion',
    timing: '3-7 days after completion',
    defaultText: `Hi [Customer Name],

We hope you're satisfied with the mold remediation work we completed at your property. We'd love to hear your feedback about our service.

Please let us know if everything met your expectations or if there's anything we can improve. Your satisfaction is our top priority.

Thank you for trusting Phoenix Shield with your mold prevention needs!`,
  },
  {
    id: '6-month-prevention',
    title: '6-Month Mold Prevention Check-In',
    description: 'Remind customers about preventive maintenance',
    timing: '6 months after service',
    defaultText: `Hi [Customer Name],

It's been 6 months since we completed your mold remediation service. We recommend a preventive check-in to ensure everything is still in great condition.

Would you like to schedule a quick inspection to catch any potential issues early? Preventive maintenance can save you time and money in the long run.

Let us know a time that works for you!`,
  },
  {
    id: 'spring-seasonal',
    title: 'Spring Moisture Season Check-In',
    description: 'Address spring moisture concerns',
    timing: 'Spring season',
    defaultText: `Hi [Customer Name],

Spring brings increased moisture from rain and humidity that can lead to mold growth. We'd like to offer a seasonal inspection to check for any moisture issues before they become problems.

Staying ahead of spring moisture is key to preventing mold. Contact us to schedule your spring mold prevention check!`,
  },
  {
    id: 'fall-seasonal',
    title: 'Fall Prep Check-In',
    description: 'Prepare customers for winter moisture control',
    timing: 'Fall season',
    defaultText: `Hi [Customer Name],

As we prepare for winter, now is the perfect time to ensure your property is protected from moisture and mold. We're offering fall prep inspections to help you stay ahead of any potential issues.

Winter weather can create unique moisture challenges. Let's schedule a time that works for you to get your property ready!`,
  },
  {
    id: 'google-review',
    title: 'Google Review Request',
    description: 'Request customer reviews',
    timing: 'After successful service',
    defaultText: `Hi [Customer Name],

Thank you for choosing Phoenix Shield for your mold remediation needs. We truly appreciate your business!

If you were satisfied with our service, we'd be grateful if you could share your experience with a Google review. Your feedback helps us serve our community better.

[Google Review Link]

Thank you!`,
  },
];
