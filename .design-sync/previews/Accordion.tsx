import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@librechat/client';

export const Faq = () => (
  <Accordion type="single" collapsible defaultValue="where" className="w-96">
    <AccordionItem value="where">
      <AccordionTrigger>Where does my data go?</AccordionTrigger>
      <AccordionContent>
        Nowhere. The model runs on your own server, and conversations stay in your database.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="models">
      <AccordionTrigger>Which models can I use?</AccordionTrigger>
      <AccordionContent>Any model your administrator has deployed.</AccordionContent>
    </AccordionItem>
  </Accordion>
);
