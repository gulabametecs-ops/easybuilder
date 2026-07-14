"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";

export type FormState = { ok: boolean; message: string };

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().optional().default(""),
  location: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

// Quote / contact form -> creates a Lead for the current tenant.
export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, message: "Site not found." };

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    service: formData.get("service") ?? "",
    location: formData.get("location") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.lead.create({
    data: {
      tenantId: tenant.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
      service: parsed.data.service ?? "",
      location: parsed.data.location ?? "",
      message: parsed.data.message ?? "",
    },
  });

  return { ok: true, message: "Thank you! We've received your request and will call you back shortly." };
}

const apptSchema = leadSchema.extend({
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
});

// Appointment form -> creates an Appointment for the current tenant.
export async function submitAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  const tenant = await getCurrentTenant();
  if (!tenant) return { ok: false, message: "Site not found." };

  const parsed = apptSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    service: formData.get("service") ?? "",
    location: formData.get("location") ?? "",
    message: formData.get("message") ?? "",
    date: formData.get("date") ?? "",
    time: formData.get("time") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.appointment.create({
    data: {
      tenantId: tenant.id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ?? "",
      service: parsed.data.service ?? "",
      date: parsed.data.date ?? "",
      time: parsed.data.time ?? "",
      message: parsed.data.message ?? "",
    },
  });

  return { ok: true, message: "Your appointment request is booked! We'll confirm shortly." };
}
