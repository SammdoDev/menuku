"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentMerchant } from "../../lib/merchant";

const slugify = (value:string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80);
async function requireTenant() { const merchant=await getCurrentMerchant(); if (!merchant.user) redirect("/login"); if (!merchant.tenant) redirect("/onboarding"); return merchant; }

export async function createCategoryAction(formData:FormData) {
  const parsed=z.object({name:z.string().trim().min(2,"Nama kategori minimal 2 karakter.").max(80),description:z.string().trim().max(200).optional()}).safeParse({name:formData.get("name"),description:formData.get("description")||undefined});
  if(!parsed.success) redirect(`/dashboard/categories?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const {tenant,supabase}=await requireTenant(); const value=parsed.data!;
  const {error}=await supabase.from("categories").insert({tenant_id:tenant!.id,name:value.name,slug:slugify(value.name),description:value.description||null});
  if(error?.code==="23505") redirect("/dashboard/categories?error=Kategori+dengan+nama+tersebut+sudah+ada.");
  if(error) redirect("/dashboard/categories?error=Kategori+belum+dapat+disimpan."); revalidatePath("/dashboard/categories");
}
export async function toggleCategoryAction(formData:FormData) { const id=z.string().uuid().safeParse(formData.get("id"));const active=formData.get("active")==="true";if(!id.success)return;const {tenant,supabase}=await requireTenant();await supabase.from("categories").update({is_active:!active}).eq("id",id.data!).eq("tenant_id",tenant!.id);revalidatePath("/dashboard/categories");revalidatePath("/dashboard/menu"); }
export async function deleteCategoryAction(formData:FormData) { const id=z.string().uuid().safeParse(formData.get("id"));if(!id.success)return;const {tenant,supabase}=await requireTenant();await supabase.from("categories").delete().eq("id",id.data!).eq("tenant_id",tenant!.id);revalidatePath("/dashboard/categories");revalidatePath("/dashboard/menu"); }

export async function createProductAction(formData:FormData) {
  const parsed=z.object({name:z.string().trim().min(2,"Nama menu minimal 2 karakter.").max(120),description:z.string().trim().max(1000).optional(),imageUrl:z.string().url().optional(),categoryId:z.string().uuid().optional(),price:z.coerce.number().int().min(0,"Harga tidak valid."),discountPrice:z.preprocess(v=>v===""?undefined:v,z.coerce.number().int().min(0).optional()),featured:z.boolean().optional()}).safeParse({name:formData.get("name"),description:formData.get("description")||undefined,imageUrl:formData.get("imageUrl")||undefined,categoryId:formData.get("categoryId")||undefined,price:formData.get("price"),discountPrice:formData.get("discountPrice"),featured:formData.get("featured")==="on"});
  if(!parsed.success) redirect(`/dashboard/menu?error=${encodeURIComponent(parsed.error.issues[0].message)}`); const value=parsed.data!;
  if(value.discountPrice!==undefined&&value.discountPrice>value.price) redirect("/dashboard/menu?error=Harga+promo+tidak+boleh+lebih+besar+dari+harga+normal.");
  const {tenant,supabase}=await requireTenant();
  if(value.categoryId){const {data:category}=await supabase.from("categories").select("id").eq("id",value.categoryId).eq("tenant_id",tenant!.id).maybeSingle();if(!category)redirect("/dashboard/menu?error=Kategori+tidak+valid.");}
  const {error}=await supabase.from("products").insert({tenant_id:tenant!.id,category_id:value.categoryId||null,name:value.name,slug:slugify(value.name),description:value.description||null,image_url:value.imageUrl||null,price:value.price,discount_price:value.discountPrice??null,is_featured:value.featured??false});
  if(error?.code==="23505") redirect("/dashboard/menu?error=Nama+menu+tersebut+sudah+ada.");if(error)redirect("/dashboard/menu?error=Menu+belum+dapat+disimpan.");revalidatePath("/dashboard/menu");revalidatePath("/dashboard");
}
export async function toggleProductAction(formData:FormData){const id=z.string().uuid().safeParse(formData.get("id"));const field=formData.get("field");const value=formData.get("value")==="true";if(!id.success||(field!=="is_active"&&field!=="is_available"&&field!=="is_featured"))return;const {tenant,supabase}=await requireTenant();await supabase.from("products").update({[field]:!value}).eq("id",id.data!).eq("tenant_id",tenant!.id);revalidatePath("/dashboard/menu");revalidatePath("/dashboard");}
export async function deleteProductAction(formData:FormData){const id=z.string().uuid().safeParse(formData.get("id"));if(!id.success)return;const {tenant,supabase}=await requireTenant();await supabase.from("products").delete().eq("id",id.data!).eq("tenant_id",tenant!.id);revalidatePath("/dashboard/menu");revalidatePath("/dashboard");}

export async function createLinkAction(formData:FormData){
  const parsed=z.object({title:z.string().trim().min(2,"Judul link minimal 2 karakter.").max(100),url:z.string().trim().url("Masukkan URL yang valid, misalnya https://instagram.com/namabisnis."),linkType:z.enum(["whatsapp","instagram","tiktok","maps","website","marketplace","reservation","custom"])}).safeParse({title:formData.get("title"),url:formData.get("url"),linkType:formData.get("linkType")});
  if(!parsed.success)redirect(`/dashboard/links?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  const {tenant,supabase}=await requireTenant();const value=parsed.data!;
  const {error}=await supabase.from("custom_links").insert({tenant_id:tenant!.id,title:value.title,url:value.url,link_type:value.linkType});
  if(error)redirect("/dashboard/links?error=Link+belum+dapat+disimpan.");
  revalidatePath("/dashboard/links");revalidatePath(`/store/${tenant!.slug}`);revalidatePath("/dashboard");
}
export async function toggleLinkAction(formData:FormData){const id=z.string().uuid().safeParse(formData.get("id"));const active=formData.get("active")==="true";if(!id.success)return;const {tenant,supabase}=await requireTenant();await supabase.from("custom_links").update({is_active:!active}).eq("id",id.data!).eq("tenant_id",tenant!.id);revalidatePath("/dashboard/links");revalidatePath(`/store/${tenant!.slug}`);}
export async function deleteLinkAction(formData:FormData){const id=z.string().uuid().safeParse(formData.get("id"));if(!id.success)return;const {tenant,supabase}=await requireTenant();await supabase.from("custom_links").delete().eq("id",id.data!).eq("tenant_id",tenant!.id);revalidatePath("/dashboard/links");revalidatePath(`/store/${tenant!.slug}`);revalidatePath("/dashboard");}

export async function togglePublishAction(formData:FormData){const published=formData.get("published")==="true";const {tenant,supabase}=await requireTenant();await supabase.from("tenants").update({is_published:!published}).eq("id",tenant!.id).eq("owner_id",tenant!.owner_id);revalidatePath("/dashboard");revalidatePath(`/store/${tenant!.slug}`);revalidatePath("/dashboard/publish");}
