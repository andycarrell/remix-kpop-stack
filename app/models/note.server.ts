import { supabase } from "./user.server";
import type { User } from "./user.server";

export type Note = {
  id: string;
  title: string;
  body: string;
  profile_id: string;
};

export async function getNoteListItems({ userId }: { userId: User["id"] }) {
  const { data } = await supabase
    .from("notes")
    .select("id, title")
    .eq("profile_id", userId);

  return data;
}

export async function createNote({
  title,
  body,
  userId,
}: Pick<Note, "body" | "title"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, body, profile_id: userId }])
    .select()
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function deleteNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .match({ id, profile_id: userId });

  if (error) {
    return null;
  }

  return {};
}

export async function getNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("profile_id", userId)
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return {
    userId: data.profile_id,
    id: data.id,
    title: data.title,
    body: data.body,
  };
}
