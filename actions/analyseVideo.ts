"use server";

import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { redirect } from "next/navigation";

export async function analyseVideo(formData: FormData) {
  const url = formData.get("url")?.toString();
  if (!url) return;
  const videoId = getVideoIdFromUrl(url);
  redirect(`/video/${videoId}/analyse`);
}
