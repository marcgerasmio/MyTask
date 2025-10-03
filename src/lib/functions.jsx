import Supabase from "../Supabase";




export async function deleteFunction(tableName, id){
const { error } = await Supabase.from(tableName).delete().eq("id", id);
window.location.reload();
};


export async function updateTaskFunction(tableName, task_id, id){
const { error } = await Supabase
 .from(tableName)
  .update({ user_id: id })
  .eq('id', task_id)
  .select()
window.location.reload();
};

export async function saveEmotion(tableName, user_id, emotion){
const { error } = await Supabase
 .from(tableName)
  .update({ 'emotion': emotion })
  .eq('user_id', user_id)
  .select()
window.location.reload();
};