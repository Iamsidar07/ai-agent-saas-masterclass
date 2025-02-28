type ChannelDetails = {
  subscribersCount: number;
  channelName: string;
  avatar: string;
  channel_url: string;
  username: string;
  user_url: string;
  isVerified: boolean;
  keywords: string[];
  category: string;
  lengthSeconds: string;
};
export type Video = {
  thumbnail: string;
  title: string;
  description: string;
  views: string;
  publishedAt: string;
  channelDetails: ChannelDetails;
  url: string;
};
