"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { FaTimes } from 'react-icons/fa';
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { formSchema } from "../schemas/eventSchema";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEdgeStore } from '@/lib/edgestore'; // Adjust the import path as needed

type FormData = z.infer<typeof formSchema>;

export default function EventForm() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const { edgestore } = useEdgeStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      date: undefined, // Ensure date is set to undefined if not provided
      time: '', // Ensure time is included
    },
  });
  
  const time = watch("time"); // Watch the time value

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailUrl(reader.result as string); // Create a preview URL
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setThumbnailUrl('');
    setProgress(0);
  };

  // Handle image upload
  const handleImageUpload = async (): Promise<string | null> => {
    if (!file) return null;
    try {
      // Upload image to Edge Store
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progressValue) => {
          setProgress(progressValue);
        },
      });
      console.log("Uploaded Image URL:", res.url); // Adjust based on actual response
      return res.url; // Return the URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null; // Return null if there's an error
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    console.log("Selected Date:", selectedDate); // Log selected date
    setDate(selectedDate);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  // Form submit handler
  const onSubmit = async (data: FormData) => {
    console.log("Form Data Submitted:", data);
    console.log("Date value submitted:", formatDate(date));
    const Date:any= formatDate(date);

    // Upload the image if selected and get the image URL
    const imageUrl = file ? await handleImageUpload() : null;
    console.log("Image URL:", imageUrl);
    

    // Include the image URL in the form data if available
    const formData = { ...data, date: Date, imageUrl };
    console.log("Form Data:", formData);

    try {
      // Send form data to API endpoint
      const response = await axios.post("/api/registerEvent", formData);

      if (response.status !== 200) {
        throw new Error("Failed to submit form");
      }

      // Handle successful submission
      console.log("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center p-6 text-gray-900">
          Event Registration
        </h1>

        <div className="main md:h-full w-full flex flex-col md:flex-row bg-white/25 backdrop-blur-lg rounded-xl">
          {/* Left section: Image upload */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-[80%] h-[80%] mx-auto border-2 border-dotted border-gray-400 rounded-lg flex items-center justify-center relative">
              {thumbnailUrl ? (
                <>
                  {/* Thumbnail Image */}
                  <img
                    src={thumbnailUrl}
                    width={400}
                    height={400}
                    alt="Preview"
                    className="rounded-lg object-contain"
                  />
                  {/* Remove Button (Cross) */}
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={handleRemoveFile}
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <span className="text-gray-500">Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            {/* Progress bar (if needed) */}
          </div>

          {/* Right section: Form */}
          <div className="w-full md:w-1/2 p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="h-full w-full flex flex-col justify-center items-center"
            >
              <div className="w-full mb-4">
                <Input placeholder="Name" {...register("name")} />
                {errors.name?.message && <div className="min-h-[1.8rem] mt-2 text-red-500">{errors.name.message}</div>}
              </div>

              <div className="w-full mb-4">
                <Input placeholder="Location" {...register("location")} />
                {errors.location?.message && <div className="min-h-[1.8rem] mt-2 text-red-500">{errors.location.message}</div>}
              </div>

              {/* Description */}
              <div className="w-full mb-4">
                <Textarea placeholder="Description" {...register("description")} />
                {errors.description?.message && <div className="min-h-[1.8rem] mt-2 text-red-500">{errors.description.message}</div>}
              </div>

              {/* Time */}
              <div className="w-full mb-4 relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal flex items-center"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {time ? time : <span>Pick a time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-xs p-0 border border-gray-300 shadow-lg rounded-lg bg-white">
                    <div className="p-4">
                      <input
                        type="time"
                        {...register("time")}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.time?.message && <div className="min-h-[1.8rem] mt-2 text-red-500">{errors.time.message}</div>}
              </div>

              {/* Date */}
              <div className="w-full mb-4 relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal flex items-center"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDate(date) : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full max-w-xs p-0 border border-gray-300 shadow-lg rounded-lg bg-white">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date()} // Disabling past dates
                    />
                  </PopoverContent>
                </Popover>
                {errors.date?.message && <div className="min-h-[1.8rem] mt-2 text-red-500">{errors.date.message}</div>}
              </div>

              <Button type="submit" className="w-full mt-4">Submit</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
