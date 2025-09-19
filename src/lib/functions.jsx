import Supabase from "../Supabase";




export async function deleteFunction(tableName, id){
const { error } = await Supabase.from(tableName).delete().eq("id", id);
window.location.reload();
};