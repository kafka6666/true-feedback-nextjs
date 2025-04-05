"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as messages from "@/utils/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    
    <>
      <main 
        className="flex flex-col flex-grow items-center justify-center px-4 md:px-24 py-12"
      >
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Dive into the World of True Conversations
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore True Feedback- where your identity remains a secret
          </p>
        </section>
        <Carousel 
          className="w-full max-w-xs"
          plugins={[
            Autoplay({
              delay: 4000
            }),
          ]}
        >
          <CarouselContent>
            {Array.from(messages).map((message) => (
              <CarouselItem key={message.id}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <span className="text-2xl font-semibold">{message.title}</span>
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center text-gray-500 p-4 md:p-6">
        &copy; 2025 True Feedback. All rights reserved.
      </footer>
    </>
  )
}
