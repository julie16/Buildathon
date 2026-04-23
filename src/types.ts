/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlantHistory = {
  id: string;
  image: string;
  diagnosis: string;
  plantType: string;
  date: string;
  location?: string;
};

export type PlantingCalendar = {
  crop: string;
  region: string;
  steps: {
    month: string;
    action: string;
    advice: string;
  }[];
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
  likes: number;
  commentsCount: number;
};

export type ForumComment = {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: any;
};
