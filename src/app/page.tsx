"use client";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function Component() {
  const router = useRouter(); // use useRouter for navigation

  const handleRedirect = () => {
    router.push('/explore'); // Redirect to the explore route
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4 p-5">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-black">Upcoming Events</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Discover Our <span className="bg-gradient-to-r from-[#099ef1] via-[#6863f8] to-[#ff891f] bg-clip-text text-transparent">Exciting Events</span>
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join us for a variety of engaging events, from informative workshops to lively social gatherings. Expand
            your knowledge, connect with like-minded individuals, and have a great time.
          </p>
          <Button
            className="bg-white text-black rounded-xl font-semibold text-xl hover:bg-slate-200"
            onClick={handleRedirect} // Trigger redirection on click
          >
            View Events
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-xl">
          <video
            src="https://cdn.lu.ma/landing/phone-dark.mp4"
            autoPlay
            muted
            loop
            className="object-cover w-full h-full"
          ></video>
        </div>
      </div>
    </section>
  );
}
