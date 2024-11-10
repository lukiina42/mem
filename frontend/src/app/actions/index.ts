import { revalidateTag } from 'next/cache';

export async function revalidateUser() {
  'use server';
  revalidateTag('profile');
}

export async function revalidateMems() {
  'use server';
  revalidateTag('mems');
}
